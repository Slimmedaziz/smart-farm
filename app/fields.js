import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../services/api';

export default function Fields() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFields = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/fields');
      setFields(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load fields');
      console.log('Error fetching fields:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFields();
  };

  const handleAddField = () => {
    router.push('/add-field');
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading fields...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Fields</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#C1502E" />
        </TouchableOpacity>
      </View>

      {/* Fields List */}
      <FlatList
        data={fields}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color="#8B7355" />
            <Text style={styles.emptyText}>No fields yet</Text>
            <Text style={styles.emptySubtext}>Add your first field to get started</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldName}>{item.name}</Text>
              <Text style={styles.cropType}>{item.cropType}</Text>
            </View>
            <Text style={styles.fieldLocation}>{item.location}</Text>
            {item.size > 0 && (
              <Text style={styles.fieldSize}>Size: {item.size} hectares</Text>
            )}
          </View>
        )}
      />

      {/* Add Field Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D5016',
  },
  logoutButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B7355',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 8,
    textAlign: 'center',
  },
  fieldCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DCC8',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5016',
  },
  cropType: {
    fontSize: 14,
    color: '#C1502E',
    fontWeight: '500',
  },
  fieldLocation: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 4,
  },
  fieldSize: {
    fontSize: 12,
    color: '#8B7355',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D5016',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});