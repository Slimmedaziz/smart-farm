
SmartFarm Expo Project (converted)

Important:
- This project is prepared to connect to a real backend.
- Open app/services/api.js and set BASE_URL to your backend, e.g.:
    export const BASE_URL = 'http://192.168.1.10:5000';

Install dependencies:
  npm install

Run:
  npx expo start

Notes:
- Uses NativeWind for Tailwind-like classes. Ensure babel.config.js includes nativewind/babel and tailwind.config.js content paths include ./app.
- Charts use react-native-chart-kit (requires react-native-svg).
