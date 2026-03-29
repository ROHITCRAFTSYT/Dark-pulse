// Pure utility functions shared across the app

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const randomFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(1);
export const pick = (arr) => arr[randomInt(0, arr.length - 1)];
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const drift = (value, min, max, step = 3) => clamp(value + randomInt(-step, step), min, max);
export const formatTime = () => new Date().toLocaleTimeString('en-US', { hour12: false });

export const randomIoc = () => {
  const type = randomInt(0, 3);
  if (type === 0) return `${randomInt(1,254)}.${randomInt(1,254)}.${randomInt(1,254)}.${randomInt(1,254)}`;
  if (type === 1) return `CVE-2025-${randomInt(1000, 9999)}`;
  if (type === 2) return Math.random().toString(36).slice(2, 10) + '...' + Math.random().toString(36).slice(2, 6);
  return `${pick(['c2','cdn','update','malware','dark'])}-${randomInt(10,999)}.${pick(['ru','cn','io','net','cc'])}`;
};

export const typeColor = (type) => ({
  CVE:        '#ff1744',
  'DARK WEB': '#d500f9',
  MALWARE:    '#ff6d00',
  TTP:        '#2979ff',
  EXPOSURE:   '#ffd600',
  IOC:        '#00e5ff',
}[type] || '#7fa8c0');

export const severityColor = (severity) => ({
  CRITICAL: '#ff1744',
  HIGH:     '#ff6d00',
  MEDIUM:   '#ffd600',
  LOW:      '#00e676',
}[severity] || '#7fa8c0');

export const riskColor = (score) =>
  score >= 85 ? '#ff1744' : score >= 70 ? '#ff6d00' : score >= 55 ? '#ffd600' : '#00e676';

export const riskLabel = (score) =>
  score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 55 ? 'ELEVATED' : 'MODERATE';
