/**
 * Send SMS alerts via Twilio when there are high-priority advisories
 * (weather, severe disease, etc.). Recipients and credentials from env.
 */

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const alertPhonesRaw = process.env.TWILIO_ALERT_PHONES || '';

const client =
  accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

const alertPhones = alertPhonesRaw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((num) => (num.startsWith('+') ? num : `+91${num}`));

/** Short English labels for recommendation keys (for SMS, no i18n) */
const SMS_LABELS = {
  irrigationSuggested: 'High temp: increase irrigation',
  avoidFertilizer: 'Rain: avoid fertilizer today',
  diseaseTreatmentTitle: (vars) => `Disease: ${vars?.diseaseName || 'detected'} (${vars?.severity ?? '?'}% severity)`,
  pestMonitoring: 'High humidity: monitor pests',
  highRiskActionsTitle: 'High risk: review actions',
  localDiseaseManagementTitle: (vars) => `Disease: ${vars?.diseaseName || 'detected'} (${vars?.severity ?? '?'}%)`,
};

/**
 * Build a single SMS line from one recommendation (high-priority).
 * @param {object} rec - { titleKey, vars }
 * @returns {string}
 */
function lineForRec(rec) {
  const fn = SMS_LABELS[rec.titleKey];
  if (typeof fn === 'function') return fn(rec.vars);
  if (typeof fn === 'string') return fn;
  return rec.titleKey || 'Alert';
}

/**
 * Build SMS body from dynamically fetched high-priority recommendations and optional weather.
 * @param {object[]} highPriorityRecommendations - Array of { titleKey, messageKey, priority, vars }
 * @param {object} [weather] - { temp, humidity, rain }
 * @returns {string} Message for SMS (max 1600 chars)
 */
export function buildAlertMessageFromRecommendations(highPriorityRecommendations, weather = null) {
  const lines = [];
  if (weather && (weather.rain === 'Rain' || weather.temp > 32 || (weather.humidity ?? 0) > 70)) {
    const w = [];
    if (weather.rain === 'Rain') w.push('Rain');
    if (weather.temp > 32) w.push(`${Math.round(weather.temp)}°C`);
    if ((weather.humidity ?? 0) > 70) w.push(`${weather.humidity}% humidity`);
    lines.push(`Weather: ${w.join(', ')}`);
  }
  const recs = Array.isArray(highPriorityRecommendations) ? highPriorityRecommendations : [];
  recs.slice(0, 5).forEach((r) => {
    const prefix = r?.priority ? `${String(r.priority).toUpperCase()}: ` : '';
    lines.push(`${prefix}${lineForRec(r)}`);
  });
  const body = lines.length ? `Alert from KrishiShield: ${lines.join('. ')}.` : '';
  return body.slice(0, 1600);
}

/**
 * Send one SMS to a single number (E.164).
 * @param {string} to - E.164 number
 * @param {string} body - Message text
 * @returns {Promise<object|null>} Twilio message or null if skipped
 */
async function sendOne(to, body) {
  if (!client || !fromNumber) {
    console.log('SMS skipped: Twilio not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)');
    return null;
  }
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    return message;
  } catch (err) {
    console.error('Twilio SMS error to', to, err.message);
    return null;
  }
}

/**
 * Send an alert SMS to all configured recipient numbers (non-blocking).
 * @param {string} message - Short alert text (e.g. "Alert from KrishiShield: ...")
 */
export function sendAlertSms(message) {
  if (!message || !message.trim()) return;
  if (!alertPhones.length) {
    console.log('SMS skipped: No TWILIO_ALERT_PHONES configured');
    return;
  }
  const body = message.slice(0, 1600);
  alertPhones.forEach((to) => {
    sendOne(to, body).catch(() => {});
  });
}

/**
 * Send SMS to all configured recipients and return detailed results.
 * Useful for testing / debugging.
 * @param {string} message
 * @returns {Promise<Array<{to:string, ok:boolean, sid?:string, status?:string, error?:string, code?:string|number}>>}
 */
export async function sendAlertSmsDetailed(message) {
  if (!message || !message.trim()) return [];
  if (!client || !fromNumber) {
    return [
      {
        to: '(all)',
        ok: false,
        error: 'Twilio not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)',
      },
    ];
  }
  if (!alertPhones.length) {
    return [{ to: '(all)', ok: false, error: 'No TWILIO_ALERT_PHONES configured' }];
  }

  const body = message.slice(0, 1600);
  const results = await Promise.all(
    alertPhones.map(async (to) => {
      try {
        const msg = await client.messages.create({ body, from: fromNumber, to });
        return { to, ok: true, sid: msg.sid, status: msg.status };
      } catch (err) {
        return {
          to,
          ok: false,
          error: err?.message || String(err),
          code: err?.code,
        };
      }
    })
  );
  return results;
}
