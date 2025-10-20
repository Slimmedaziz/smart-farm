
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

export default function SensorChart({ title, data, color = '#22c55e', unit = '' }) {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: () => color,
    strokeWidth: 2,
    propsForDots: { r: '3' },
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow mb-4">
      <Text className="text-gray-500 text-sm mb-1">{title}</Text>
      <Text className="text-2xl font-semibold mb-3">{data?.length ? `${data[data.length - 1].value}${unit}` : '—'}</Text>
      <LineChart
        data={{ labels: data?.slice(-6).map((d) => d.time) || [], datasets: [{ data: data?.slice(-6).map((d) => d.value) || [] }] }}
        width={screenWidth - 60}
        height={160}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}
