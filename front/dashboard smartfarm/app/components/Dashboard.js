
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import SensorChart from "./SensorChart";
import { getFields, getLiveSensorData, triggerIrrigation } from "../services/mockApi";

export default function Dashboard({ onLogout, user }) {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState({
    humidity: { value: 0, data: [] },
    soilTemp: { value: 0, data: [] },
    light: { value: 0, data: [] },
    waterLevel: { value: 0, data: [] },
    ph: { value: 7.0, data: [] },
  });
  const [irrigating, setIrrigating] = useState(false);
  const [alerts, setAlerts] = useState([]);

  function genMockSeries(min = 0, max = 100) {
    const now = Date.now();
    const arr = [];
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * 3600 * 1000);
      arr.push({ time: t.getHours() + ":00", value: Math.round(min + Math.random() * (max - min)) });
    }
    return arr;
  }

  async function refresh() {
    setLoading(true);
    try {
      const fields = await getFields();
      const avgHumidity = Math.round(
        fields.reduce((s, f) => s + (f.lastHumidity || 0), 0) / Math.max(1, fields.length)
      );
      const fieldId = fields[0]?.id;

      const humiditySeries = genMockSeries(30, 90);
      const humidityVal = avgHumidity || Math.round(30 + Math.random() * 60);

      const soilSeries = fieldId ? await getLiveSensorData(fieldId) : genMockSeries(15, 35);
      const soilVal = soilSeries[soilSeries.length - 1]?.value ?? Math.round(20 + Math.random() * 10);

      const lightSeries = genMockSeries(300, 800);
      const lightVal = Math.round(300 + Math.random() * 500);

      const waterSeries = genMockSeries(30, 100);
      const waterVal = Math.round(30 + Math.random() * 70);

      const phSeries = genMockSeries(55, 80);
      const phVal = (5.5 + Math.random() * 2.5).toFixed(2);

      setSensors({
        humidity: { value: humidityVal, data: humiditySeries },
        soilTemp: { value: soilVal, data: soilSeries },
        light: { value: lightVal, data: lightSeries },
        waterLevel: { value: waterVal, data: waterSeries },
        ph: { value: phVal, data: phSeries },
      });

      const newAlerts = [];
      if (waterVal < 40) newAlerts.push("⚠️ Low water level detected.");
      if (soilVal > 32) newAlerts.push("🌡️ High soil temperature detected.");
      if (humidityVal < 40) newAlerts.push("💧 Low humidity level.");
      if (phVal < 6 || phVal > 7.5) newAlerts.push("⚠️ pH out of optimal range (6 - 7.5).");
      setAlerts(newAlerts);
    } catch (e) {
      console.error("refresh error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, []);

  async function onRunIrrigation() {
    setIrrigating(true);
    try {
      await triggerIrrigation(null);
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      console.error(e);
    } finally {
      setIrrigating(false);
      refresh();
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">SmartFarm Dashboard</Text>
        <TouchableOpacity onPress={onLogout} className="bg-red-500 px-3 py-2 rounded">
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#22c55e" className="my-4" />}

      <SensorChart title="Humidity" data={sensors.humidity.data} color="#3b82f6" unit="%" />
      <SensorChart title="Soil Temperature" data={sensors.soilTemp.data} color="#f97316" unit="°C" />
      <SensorChart title="Light Intensity" data={sensors.light.data} color="#f59e0b" unit=" lx" />
      <SensorChart title="Water Level" data={sensors.waterLevel.data} color="#06b6d4" unit="%" />
      <SensorChart title="Soil pH" data={sensors.ph.data} color="#84cc16" unit="" />

      <View className="bg-white rounded-2xl p-4 shadow mb-4">
        <Text className="text-gray-500 text-sm">Irrigation (Manual)</Text>
        <TouchableOpacity onPress={onRunIrrigation} disabled={irrigating} className={`mt-3 py-3 rounded-xl ${irrigating ? 'bg-green-300' : 'bg-green-600'}`}>
          <Text className="text-white font-semibold text-center">{irrigating ? 'Irrigating...' : 'Run Irrigation'}</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-8">
        <Text className="text-gray-500 text-sm mb-2">Alerts</Text>
        {alerts.length === 0 ? (
          <Text className="text-green-600">✅ All good — no alerts currently.</Text>
        ) : (
          alerts.map((a, i) => <Text key={i} className="text-red-600 mb-1">{a}</Text>)
        )}
      </View>
    </ScrollView>
  );
}
