import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login...');
      
      const res = await api.post('/auth/login', { email, password });
      
      console.log('✅ Login response:', res.data);
      
      // ⭐ CRITICAL: SAVE THE TOKEN ⭐
      await AsyncStorage.setItem('token', res.data.token);
      console.log('💾 Token saved successfully');
      
      // Verify it was saved
      const savedToken = await AsyncStorage.getItem('token');
      console.log('🔍 Token verification:', savedToken ? 'EXISTS' : 'NULL');
      
      Alert.alert('Welcome Back!', 'Successfully logged into your farm dashboard');
      router.replace('/fields');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      Alert.alert(
        'Login Failed',
        err.response?.data?.message || 'Please check your credentials and try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative Header Background */}
          <View style={styles.headerBackground}>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Logo/Icon Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={48} color="#2D5016" />
              </View>
              <Text style={styles.appName}>FarmConnect</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to manage your farm and track your crops
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={emailFocused ? '#C1502E' : '#8B7355'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="farmer@example.com"
                    placeholderTextColor="#A89F91"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={passwordFocused ? '#C1502E' : '#8B7355'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#A89F91"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    style={[styles.input, styles.passwordInput]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#8B7355"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <>
                      <Ionicons name="hourglass-outline" size={20} color="#FFF" />
                      <Text style={styles.buttonText}>Signing In...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Options */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={24} color="#C1502E" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={24} color="#2D5016" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="call-outline" size={24} color="#8B7355" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>New to FarmConnect? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signupText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Decorative Element */}
            <View style={styles.bottomDecoration}>
              <Ionicons name="leaf-outline" size={16} color="#C1502E" />
              <Text style={styles.tagline}>Growing Together</Text>
              <Ionicons name="leaf-outline" size={16} color="#C1502E" />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E8DCC8',
    opacity: 0.5,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: -50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D4C5B0',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8DCC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2D5016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D5016',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2D5016',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E8DCC8',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#2D5016',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#C1502E',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D5016',
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#C1502E',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#2D5016',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5016',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#A89F91',
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4C5B0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E8DCC8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5016',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '500',
  },
  signupText: {
    color: '#C1502E',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  tagline: {
    fontSize: 13,
    color: '#8B7355',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});