import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  useColorScheme,
  Platform,
  StatusBar,
  Alert
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { PieChart } from "react-native-gifted-charts";
import { FontAwesome, FontAwesome5} from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useProfile } from "./_layout";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Dashboard() {
  const router = useRouter();
  const backgroundColor = '#000000';
  const textColor = '#FFFFFF';
  const dateColor = '#E0E0E0'; 
  const borderColor = '#FFFFFF'; 
  const boxBackgroundColor = '#1A1A1A';
  const { profileImageUri, userData, waterData, calorieData, proteinData } = useProfile();
  const waterColor = "#00C2FF";
  const proteinColor = '#FFFFFF';
  const calorieColor = "#FF8A00";
  const trackColor = "#333333";
  const stepsColor = "#8A2BE2";
  const sleepColor = "#008080";
  const [stepsCount, setStepsCount] = React.useState(0);
  const [isSleeping, setIsSleeping] = React.useState(false);
  const [sleepDuration, setSleepDuration] = React.useState({ hours: 0, mins: 0 });
  const maxSteps = 10000;
  const maxSleepMins = 8 * 60;
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const currentDate = today.toLocaleDateString('en-US', dateOptions).toUpperCase();
  useFocusEffect(
    React.useCallback(() => {
      const getSteps = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) {
          console.log("Pedometer not available on this device.");
          return;
        }
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status === 'granted') {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setStepsCount(pastStepCountResult.steps);
          }
        }
      };
      getSteps();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      const checkSleepState = async () => {
        const bedtimeString = await AsyncStorage.getItem('bedtime');
        if (bedtimeString) {
          setIsSleeping(true);
        }
      };
      checkSleepState();
    }, [])
  );

  const handleSleepToggle = async () => {
    if (isSleeping) {
      const bedtimeString = await AsyncStorage.getItem('bedtime');
      if (bedtimeString) {
        const bedtime = new Date(parseInt(bedtimeString, 10));
        const wakeupTime = new Date();

        const diffMs = wakeupTime.getTime() - bedtime.getTime();
        
        if (diffMs > 0) {
          const totalMins = Math.floor(diffMs / 60000);
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          setSleepDuration({ hours, mins });
          Alert.alert("Good Morning!", `You slept for ${hours} hours and ${mins} minutes.`);
        }

        await AsyncStorage.removeItem('bedtime');
        setIsSleeping(false);
      }
    } else {
      Alert.alert(
        "Start Sleep Session?",
        "This will begin tracking your sleep time. Press the button again when you wake up.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Start Sleep", async onPress() {
            await AsyncStorage.setItem('bedtime', Date.now().toString());
            setIsSleeping(true);
          }}
        ]
      )
    }
  };
  const getChartData = (current: number, max: number, color: string) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const remainder = 100 - percentage;
    if (percentage === 0) {
      return [{ value: 100, color: trackColor }];
    }
    return [
      { value: percentage, color: color },
      { value: remainder, color: trackColor }
    ];
  };
  const waterChartData = getChartData(waterData.current, waterData.target || 1, waterColor);
  const proteinRingData = getChartData(proteinData.current, proteinData.target || 1, proteinColor);
  const calorieChartData = getChartData(calorieData.current, calorieData.target || 1, calorieColor);
  const stepsData = getChartData(stepsCount, maxSteps, stepsColor);
  const currentSleepTotalMins = (sleepDuration.hours * 60) + sleepDuration.mins;
  const sleepData = getChartData(currentSleepTotalMins, maxSleepMins, sleepColor);  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.profileContainer} onPress={() => router.push("/Profile")}>
            <View style={[styles.profileButton, { borderColor }]}>
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }} 
                  resizeMode="cover"
                  style={styles.profileImage}
                />
              ) : (
                <FontAwesome name="user" size={30} color={textColor} />
              )}
            </View>
            <Text style={[styles.headerText, { color: textColor }]}>
              {userData.name}
            </Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity onPress={() => router.push("/Dashboard")}>
            <Image
              source={require("../../assets/images/LoginLogo.png")} 
              resizeMode="contain"
              style={styles.logo} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>SUMMARY</Text>
          <Text style={[styles.dateText, { color: dateColor }]}>{currentDate}</Text>
        </View>
        <View style={[styles.infoBoxSmall, { backgroundColor: boxBackgroundColor }]}>
          <View style={styles.chartArea}>
            <View style={styles.ringOverlay}>
              <PieChart
                donut
                radius={85}
                innerRadius={75}
                data={waterChartData}
                backgroundColor={boxBackgroundColor}
                centerLabelComponent={() => null}
              />
            </View>
            <View style={styles.ringOverlay}>
              <PieChart
                donut
                radius={68}
                innerRadius={58}
                data={proteinRingData}
                backgroundColor={"transparent"}
                centerLabelComponent={() => null}
              />
            </View>
            <View style={[styles.maskingRing, { borderColor: boxBackgroundColor }]} />
            <View style={styles.ringOverlay}>
              <PieChart
                donut
                radius={51}
                innerRadius={41}
                data={calorieChartData}
                backgroundColor={"transparent"}
                centerLabelComponent={() => null}
              />
            </View>
            <View style={[styles.centerCover, { backgroundColor: boxBackgroundColor }]} />
            <FontAwesome name="bolt" size={32} color={"#0FAC43"} style={styles.centerIcon} />
          </View>
          <View style={styles.legendArea}>
            <TouchableOpacity onPress={() => router.push('/WaterIntake')}>
              <View style={styles.legendItem}>
                <Text style={[styles.legendLabel2, { color: textColor }]}>WATER</Text>
                <Text style={[styles.legendValue, { color: waterColor }]}>
                  {waterData.current}<Text style={styles.legendUnit}>ML</Text>
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/ProteinCounter')}>
              <View style={styles.legendItem}>
                <Text style={[styles.legendLabel2, { color: textColor }]}>PROTEIN</Text>
                <Text style={[styles.legendValue, { color: proteinColor }]}>
                  {proteinData.current}<Text style={styles.legendUnit}>G</Text>
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/CalorieCounter')}>
              <View style={styles.legendItem}>
                <Text style={[styles.legendLabel2, { color: textColor }]}>CALORIES</Text>
                <Text style={[styles.legendValue, { color: calorieColor }]}>
                  {calorieData.current}<Text style={styles.legendUnit}>KCAL</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.infoBoxLarge, { backgroundColor: boxBackgroundColor, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
          <View style={styles.subChartContainer}>
            <PieChart
              donut
              radius={55}
              innerRadius={45}
              data={stepsData}
              backgroundColor={boxBackgroundColor}
              centerLabelComponent={() => (
                <View style={styles.chartCenterLabel}>
                  <Image
                    source={require('../../assets/images/rapidboots.png')}
                    style={styles.chartCenterIcon}
                  />
                  <Text style={[styles.chartCenterTextSmall, { color: textColor }]}>{`${stepsCount}/${maxSteps}`}</Text>
                </View>
              )}
            />
            <View style={styles.subChartTitleContainer}>
              <Text style={[styles.subChartTitle, { color: textColor }]}>STEPS</Text>
              <Text style={[styles.subChartSubtitle, { color: textColor }]}>Steps boost stamina and burn calories.</Text>
            </View>
          </View>
          <View style={styles.verticalDivider} />
          <TouchableOpacity style={styles.subChartContainer} onPress={handleSleepToggle}>
            <PieChart
              donut
              radius={55}
              innerRadius={45}
              data={sleepData}
              backgroundColor={boxBackgroundColor}
              centerLabelComponent={() => (
                <View style={styles.chartCenterLabel}>
                  <FontAwesome5 
                    name={isSleeping ? "bed" : "moon"} 
                    size={30} 
                    color={isSleeping ? "#FFD700" : sleepColor} 
                  />
                  <Text style={[styles.chartCenterTextSmall, { color: textColor }]}>{`${sleepDuration.hours}HR ${sleepDuration.mins}MINS`}</Text>
                </View> 
              )}
            />
            <View style={styles.subChartTitleContainer}>
              <Text style={[styles.subChartTitle, { color: textColor }]}>SLEEP</Text>
              <Text style={[styles.subChartSubtitle, { color: textColor }]}>Sleep restores energy and performance.</Text>
            </View> 
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#0D79A2" }]} onPress={() => router.push('/WaterIntake')}>
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8yViyeUqE/o22lvw00_expires_30_days.png" }} resizeMode="contain" style={styles.actionIcon} />
              <Text style={styles.actionText}>WATER INTAKE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#BE6F01" }]} onPress={() => router.push('/CalorieCounter')}>
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8yViyeUqE/eqgth43w_expires_30_days.png" }} resizeMode="contain" style={styles.actionIcon} />
              <Text style={styles.actionText}>CALORIE COUNTER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#1A1A1A"}]} onPress={() => router.push('/ProteinCounter')}>
              <FontAwesome5 name="dna" size={20} color="#818982" />
              <Text style={styles.actionText2}>PROTEIN COUNTER</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.actionRow, { justifyContent: 'center' }]}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#550A0A"}]} onPress={() => router.push('/BMI')}>
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8yViyeUqE/57to65ha_expires_30_days.png" }} resizeMode="contain" style={styles.actionIcon} />
              <Text style={styles.actionText}>BMI CALCULATOR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === 'android' ? 20 : 0,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 54,
    height: 54,
    borderWidth: 1,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 24,
    letterSpacing: 1,
  },
  spacer: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 50,
  },
  titleContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "BebasNeue-Regular", 
    fontSize: 50,
    marginBottom: 5,
    letterSpacing: 1, 
  },
  dateText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 16,
    letterSpacing: 1,
  },
  infoBoxSmall: {
    height: 210,
    borderRadius: 35,
    marginBottom: 14,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  infoBoxLarge: {
    height: 233,
    borderRadius: 35,
    marginBottom: 25,
    width: "100%",
  },
  chartArea: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
  },
  ringOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerIcon: {
    position: 'absolute',
  },
  centerCover: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  maskingRing: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 6,
  },
  legendArea: {
    flex: 0.9, 
    justifyContent: "center",
    height: "100%",
    paddingLeft: 10,
    gap: 15,
  },
  legendItem: {
    margin: -5
  },
  legendLabel2: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.7,
  },
  legendValue: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 40,
    lineHeight: 40,
  },
  legendUnit: {
    fontSize: 20,
    marginLeft: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, 
    gap: 6, 
  },
  actionButton: {
    width: '32%',
    height: 55, 
    flexDirection: 'row', 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 50, 
    borderColor: "#FFFFFF",
    borderWidth: 2, 
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  actionIcon: {
    width: 20, 
    height: 18,
    marginRight: 4, 
  },
  actionText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 12, 
    color: "#FFF", 
    textAlign: "left", 
    lineHeight: 12, 
  },
  actionText2: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 12, 
    color: "#FFF", 
    textAlign: "left",  
    marginLeft: 4
  },
  subChartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  chartCenterLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  chartCenterTextSmall: {
    fontSize: 10,
    fontFamily: 'BebasNeue-Regular',
    marginTop: 4,
  },
  subChartTitleContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  subChartTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 30,
    letterSpacing: 1,
  },
  subChartSubtitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#444',
  },
});