export function readNumberGroup(inputs) {
  const values = {};
  for (const [key, input] of Object.entries(inputs ?? {})) {
    const rawValue = String(input?.value ?? '').trim();
    if (rawValue === '') return null;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return null;
    values[key] = value;
  }
  return values;
}

export function normalizeCmykValues(values) {
  if (!values) return null;
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Math.min(100, Math.max(0, Math.round(Number(value) || 0))),
    ]),
  );
}
