export async function getFields() {
  return [
    {
      id: 1,
      name: "Main Field",
      location: "Central Area",
    },
  ];
}

export async function getLiveSensorData() {
  try {
    const response = await fetch("http://localhost:3000/sensors");
    const data = await response.json();

    return {
      humidity: data.humidity ?? 0,
      soilTemp: data.soilTemp ?? data.temperature ?? 0,
      lightIntensity: data.lightIntensity ?? 300,
      waterLevel: data.waterLevel ?? 70,
      pH: data.pH ?? 6.5,
    };
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return {
      humidity: 0,
      soilTemp: 0,
      lightIntensity: 0,
      waterLevel: 0,
      pH: 0,
    };
  }
}

export async function triggerIrrigation() {
  console.log("Manual irrigation triggered (mock).");
  return { success: true, message: "Irrigation started" };
}
