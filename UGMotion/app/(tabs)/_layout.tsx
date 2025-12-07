import { Tabs } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { View, Platform, Image, Pressable } from 'react-native';
import '../../global.css';
import { CustomTabBar } from '@/components/CustomTabBar';
import { initDatabase, fetchUserById, saveUserProfile, User, saveWeeklyPlan, fetchWeeklyPlan, DayPlan as DBDayPlan, RoutineActivity, fetchTodayWater, addWaterLog, fetchTodayProtein, addProteinLog, fetchDailyGoals, saveDailyGoals, fetchTodayCalories, addCalorieLog } from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';
type EquipmentType = 'dumbbells' | 'bodyweight' | 'cardio' | 'machines';
interface UserData {
  id?: number; 
  name: string;
  age: string;
  email: string | null;
  sex: 'Male' | 'Female' | 'N/A';
  height: string;
  weight: string;
  selectedEquipment?: string; 
}
interface WaterData {
  current: number;
  target: number | null;
  history: number[];
}
interface CalorieData {
  current: number;
  target: number | null;
  history: number[];
}
interface ProteinData {
  current: number;
  target: number | null;
  history: number[];
}
interface ProfileContextType {
  profileImageUri: string | null;
  setProfileImageUri: (uri: string | null) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
  waterData: WaterData;
  addWater: (amount: number) => void;
  updateWaterTarget: (target: number) => void;
  calorieData: CalorieData;
  addCalories: (amount: number) => void;
  updateCalorieTarget: (target: number | null) => void;
  proteinData: ProteinData;
  addProtein: (amount: number) => void;
  updateProteinTarget: (target: number | null) => void;
  weeklyPlan: DBDayPlan[];
  updateWeeklyPlan: (newPlan: DBDayPlan[]) => void;
  selectedEquipment: EquipmentType[];
  setSelectedEquipment: (equipment: EquipmentType[]) => void;
}
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [userData, setUserDataState] = useState<UserData>({
    name: 'N/A',
    email: null,
    age: 'N/A', 
    sex: 'N/A',
    height: 'N/A', 
    weight: 'N/A', 
    selectedEquipment: '[]',
  });
  const [waterData, setWaterData] = useState<WaterData>({
    current: 0,
    target: 2000, 
    history: [],
  });
  const [calorieData, setCalorieData] = useState<CalorieData>({
    current: 0,
    target: 2000, 
    history: [],
  });
  const [proteinData, setProteinData] = useState<ProteinData>({
    current: 0,
    target: 150,
    history: [],
  });
  const [weeklyPlan, setWeeklyPlan] = useState<DBDayPlan[]>([]);
  useEffect(() => {
    const loadData = async () => {
        try {
            await initDatabase();
            const userIdStr = await AsyncStorage.getItem('loggedInUserId');
            if (userIdStr) {
                const userId = parseInt(userIdStr, 10);
                const user = fetchUserById(userId);
                if (user) {
                    setUserDataState(user);
                    if (user.profileImageUri) {
                        setProfileImageUri(user.profileImageUri);
                    }
                }
            }

            const plan = fetchWeeklyPlan();
            setWeeklyPlan(plan);

            const water = await fetchTodayWater();
            const calories = await fetchTodayCalories();
            const protein = await fetchTodayProtein();
            const goals = await fetchDailyGoals();

            setWaterData(prev => ({ ...prev, current: water, target: goals.water_target || prev.target }));
            setCalorieData(prev => ({ ...prev, current: calories, target: goals.calorie_target || prev.target }));
            setProteinData(prev => ({ ...prev, current: protein, target: goals.protein_target || prev.target }));
        } catch (error) {
            console.error("Failed to load data from database", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);
  const setUserData = (data: UserData) => {
    setUserDataState(data);
    const userToSave = { ...data, selectedEquipment: (data as any).selectedEquipment || '[]' };
    saveUserProfile(userToSave as User);
  };
  const setProfileImageUriAndSave = (uri: string | null) => {
    setProfileImageUri(uri);
    const updatedUser = { ...userData, profileImageUri: uri };
    setUserDataState(updatedUser);
    saveUserProfile(updatedUser as User);
  };
  const updateWeeklyPlan = (newPlan: DBDayPlan[]) => {
    setWeeklyPlan(newPlan);
    saveWeeklyPlan(newPlan);
  };
  const setSelectedEquipment = (equipment: EquipmentType[]) => {
    const equipmentJson = JSON.stringify(equipment);
    const updatedUser = { ...userData, selectedEquipment: equipmentJson };
    setUserDataState(updatedUser);
    saveUserProfile(updatedUser as User);
  };
  if (isLoading) {
    return null; 
  }
  const selectedEquipment: EquipmentType[] = userData.selectedEquipment ? JSON.parse(userData.selectedEquipment) : [];
  const addWater = async (amount: number) => {
    try {
      await addWaterLog(amount);
      setWaterData(prev => ({
        ...prev,
        current: prev.current + amount,
      }));
    } catch (error) {
      console.error("Failed to save water:", error);
    }
  };
  const updateWaterTarget = async (newTarget: number | null) => {
    try {
      await saveDailyGoals({ water_target: newTarget });
      setWaterData(prev => ({ ...prev, target: newTarget }));
    } catch (error) {
      console.error("Failed to save water target:", error);
    }
  };
  const addCalories = async (amount: number) => {
    try {
      await addCalorieLog(amount);
      setCalorieData(prev => ({
        ...prev,
        current: prev.current + amount,
      }));
    } catch (error) {
      console.error("Failed to save calories:", error);
    }
  };
  const updateCalorieTarget = async (newTarget: number | null) => {
    try {
      await saveDailyGoals({ calorie_target: newTarget });
      setCalorieData(prev => ({ ...prev, target: newTarget }));
    } catch (error) {
      console.error("Failed to save calorie target:", error);
    }
  };
  const addProtein = async (amount: number) => {
    try {
      await addProteinLog(amount);
      setProteinData(prev => ({
        ...prev,
        current: prev.current + amount,
      }));
    } catch (error) {
      console.error("Failed to save protein:", error);
    }
  };
  const updateProteinTarget = async (newTarget: number | null) => {
    try {
      await saveDailyGoals({ protein_target: newTarget });
      setProteinData(prev => ({ ...prev, target: newTarget }));
    } catch (error) {
      console.error("Failed to save protein target:", error);
    }
  };
  const value = { profileImageUri, setProfileImageUri: setProfileImageUriAndSave, userData, setUserData, waterData, addWater, updateWaterTarget, calorieData, addCalories, updateCalorieTarget, proteinData, addProtein, updateProteinTarget, weeklyPlan, updateWeeklyPlan, selectedEquipment, setSelectedEquipment };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
export default function TabLayout() {
  return (
    <ProfileProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        {/* Note: We removed the 'tabBarIcon' props here because 
            CustomTabBar.tsx now handles the icons and the green circle.
        */}
        <Tabs.Screen 
          name="Dashboard" 
          options={{ title: 'Home' }} 
        />
        <Tabs.Screen 
          name="MealPrep" 
          options={{ title: 'Meal Prep' }} 
        />
        <Tabs.Screen 
          name="WorkoutPlan" 
          options={{ title: 'Workout Plan' }} 
        />
        <Tabs.Screen 
          name="Profile" 
          options={{ title: 'Profile' }} 
        />
        {/* --- Hidden Screens --- */}
        <Tabs.Screen name="BMI" options={{ href: null }} />
        <Tabs.Screen name="CalorieCounter" options={{ href: null }} />
        <Tabs.Screen name="ProteinCounter" options={{ href: null }} />
        <Tabs.Screen name="WaterIntake" options={{ href: null }} />
        <Tabs.Screen name="AboutUs" options={{ href: null }} />
        <Tabs.Screen name="Privacy" options={{ href: null }} />
        <Tabs.Screen name="Create" options={{ href: null }} />
        <Tabs.Screen name="Calendar" options={{ href: null }} />
        <Tabs.Screen name="LoadData" options={{ href: null }} />
      </Tabs>
    </ProfileProvider>
  );
}