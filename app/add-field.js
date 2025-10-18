import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
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
      // Token is automatically added by api.js interceptor
      const res = await api.get('/fields');
      setFields(res.data);
    } catch (err) {
      console.error('Error fetching fields:', err);
      
      if (Platform.OS === 'web') {
        alert('Failed to load fields');
      } else {
        Alert.alert('Error', 'Failed to load fields');
      }
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

  const handleEditField = (fieldId) => {
    router.push(`/edit-field?id=${fieldId}`);
  };

  const handleDeleteField = async (fieldId, fieldName) => {
    const confirmDelete = Platform.OS === 'web' 
      ? confirm(`Are you sure you want to delete "${fieldName}"?`)
      : await new Promise((resolve) => {
          Alert.alert(
            'Delete Field',
            `Are you sure you want to delete "${fieldName}"?`,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
            ]
          );
        });

    if (!confirmDelete) return;

    try {
      await api.delete(`/fields/${fieldId}`);
      setFields(fields.filter(f => f._id !== fieldId));
      
      if (Platform.OS === 'web') {
        alert('Field deleted successfully');
      } else {
        Alert.alert('Success', 'Field deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting field:', err);
      
      if (Platform.OS === 'web') {
        alert('Failed to delete field');
      } else {
        Alert.alert('Error', 'Failed to delete field');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading fields...</Text>
        </View>
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
            <View style={styles.fieldContent}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldName}>{item.name}</Text>
                <Text style={styles.cropType}>{item.cropType}</Text>
              </View>
              <View style={styles.fieldDetails}>
                <Ionicons name="location-outline" size={14} color="#8B7355" />
                <Text style={styles.fieldLocation}>{item.location}</Text>
              </View>
              {item.size > 0 && (
                <Text style={styles.fieldSize}>Size: {item.size} hectares</Text>
              )}
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => handleEditField(item._id)}
              >
                <Ionicons name="create-outline" size={20} color="#2D5016" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => handleDeleteField(item._id, item.name)}
              >
                <Ionicons name="trash-outline" size={20} color="#C1502E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Field Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B7355',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldContent: {
    flex: 1,
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
    flex: 1,
  },
  cropType: {
    fontSize: 14,
    color: '#C1502E',
    fontWeight: '500',
    marginLeft: 8,
  },
  fieldDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLocation: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 4,
  },
  fieldSize: {
    fontSize: 12,
    color: '#8B7355',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
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