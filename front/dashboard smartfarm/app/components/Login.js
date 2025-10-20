
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services/api';

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(BASE_URL + '/api/login', { email, password });
      if (res.data && res.data.user) {
        onLogin(res.data);
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Login</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email"
        className="border border-gray-300 rounded w-full p-3 mb-4" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry
        className="border border-gray-300 rounded w-full p-3 mb-6" />
      <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 rounded py-3 px-6 w-full">
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate && navigation.navigate('Register')}>
        <Text className="text-blue-600 mt-4">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
