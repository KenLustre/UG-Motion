import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { initDatabase } from './database'; 
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Tektur_Condensed-Bold': require('../assets/fonts/Tektur_Condensed-Bold.ttf'),
    'Roboto_Condensed-ExtraBold': require('../assets/fonts/Roboto_Condensed-ExtraBold.ttf'),
    'Georama-Regular': require('../assets/fonts/Georama_Condensed-ExtraLight.ttf'),
  });
  const [dbInitialized, setDbInitialized] = useState(false);
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  useEffect(() => {
    try {
      initDatabase();
      setDbInitialized(true);
    } catch (err) {
      console.error("Database initialization error:", err);
    }
  }, []);
  useEffect(() => {
    if (loaded && dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbInitialized]);
  if (!loaded || !dbInitialized) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
    </Stack>
  );
}