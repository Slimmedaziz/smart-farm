
import React from 'react';
import { View, Text } from 'react-native';

export default function Alerts() {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-xl font-bold mb-2">Alerts</Text>
      <Text className="text-gray-600">No alerts yet. All systems nominal.</Text>
    </View>
  );
}
