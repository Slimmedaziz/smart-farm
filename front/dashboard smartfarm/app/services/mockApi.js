
export async function getFields() {
  return [
    { id: 1, name: 'Greenhouse A', lastHumidity: 65 },
    { id: 2, name: 'Field B', lastHumidity: 55 },
  ];
}

export async function getLiveSensorData(fieldId) {
  const now = Date.now();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * 3600 * 1000);
    data.push({ time: t.getHours() + ':00', value: Math.round(15 + Math.random() * 20) });
  }
  return data;
}

export async function triggerIrrigation(fieldId) {
  await new Promise((r) => setTimeout(r, 500));
  return { status: 'ok' };
}
