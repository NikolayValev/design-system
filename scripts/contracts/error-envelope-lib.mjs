const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

export const validateErrorEnvelopePayload = payload => {
  const errors = [];

  const root = isRecord(payload) ? payload : null;
  if (!root) {
    errors.push('Payload must be a JSON object.');
    return errors;
  }

  const envelope = isRecord(root.error) ? root.error : null;
  if (!envelope) {
    errors.push('Payload must include an "error" object.');
    return errors;
  }

  if (!isNonEmptyString(envelope.code)) {
    errors.push('error.code must be a non-empty string.');
  }
  if (!isNonEmptyString(envelope.message)) {
    errors.push('error.message must be a non-empty string.');
  }
  if (!isNonEmptyString(envelope.request_id)) {
    errors.push('error.request_id must be a non-empty string.');
  }

  return errors;
};
