import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  useColorScheme,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { PieChart } from "react-native-gifted-charts";import { useProfile } from "./_layout";
const { width } = Dimensions.get("window");
const WaterIntake = () => {
  const router = useRouter();
  const backgroundColor = '#000000';
  const textColor = '#FFFFFF';
  const trackColor = "#333333";
  const { waterData, addWater, updateWaterTarget } = useProfile();
  const [customAmount, setCustomAmount] = useState('');
  const addToCustomAmount = (amountToAdd: number) => {
    const currentAmount = parseInt(customAmount, 10) || 0;
    const newAmount = currentAmount + amountToAdd;
    setCustomAmount(String(newAmount));
  };
  const handleTextInput = (text: string) => {
    // Allow only positive integers
    const numericValue = text.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
  };
  const undoLastLog = () => {
    Alert.alert("Undo Not Available", "This feature is not currently supported.");
  };
  const handleClear = () => {
    Alert.alert(
      "Clear Data",
      "Are you sure you want to clear your current intake and target for today?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            addWater(-waterData.current);
            updateWaterTarget(null);
          },
          style: "destructive",
        },
      ]
    );
  };
  const handleEnter = () => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number.");
      return;
    }
    Alert.alert(
      "Confirm Action",
      `What would you like to do with ${amount}ML?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Set as Target", onPress: () => {
            updateWaterTarget(amount);
            setCustomAmount('');
        }},
        { text: "Add to Intake", onPress: () => {
            addWater(amount);
            setCustomAmount('');
        }},
      ]
    );
  };
  const max = waterData.target || 1; // Avoid division by zero
  const percentage = Math.min(100, Math.max(0, (waterData.current / max) * 100));
  const getChartData = () => {
    const roundedPercentage = Math.round(percentage);
    if (roundedPercentage === 0) return [{ value: 100, color: trackColor }];
    return [
      { value: percentage, color: '#0D79A2' },
      { value: 100 - percentage, color: trackColor }
    ];
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {/* Custom Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => router.push('/Dashboard')} 
            style={styles.welcomeButton}
          >
            <FontAwesome5 name="chevron-left" size={14} color={textColor} style={{ marginRight: 8 }} />
            <Text style={[styles.welcomeText, { color: textColor }]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Dashboard")}>
            <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        {/* Content */}
        <View style={styles.contentContainer}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#0D79A2", marginRight: 0 }]} onPress={() => router.push('/WaterIntake')}>
            <Image
                          source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8yViyeUqE/o22lvw00_expires_30_days.png" }} 
                          resizeMode="contain"
                          style={styles.actionIcon}
                        />
            <Text style={styles.actionText}>WATER INTAKE</Text>
          </TouchableOpacity>
          {/* --- 1st Info Box: Graph --- */}
          <View style={[styles.infoBox, styles.graphBox]}>
            <View style={styles.chartContainer}>
              <PieChart
                donut
                radius={65}
                innerRadius={55}
                data={getChartData()}
                backgroundColor={"#1A1A1A"}
                centerLabelComponent={() => (
                  <View style={styles.chartCenterLabel}>
                    <FontAwesome5 name="tint" size={30} color="#0D79A2" />
                    <Text style={styles.chartCenterText}>
                      {`${Math.round(percentage)}%`}
                    </Text>
                  </View>
                )}
              />
            </View>
            <View style={styles.legendContainer}>
              <Text style={[styles.legendValue]}>{waterData.current}ML</Text>
              <Text style={styles.legendLabel}>Target: {waterData.target ? `${waterData.target}ML` : 'N/A'}</Text>
              <Text style={styles.legendLabel1}>Remaining: {waterData.target ? `${Math.max(0, waterData.target - waterData.current)}ML` : 'N/A'}</Text>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          </View>
          {/* --- 2nd Info Box: Controls --- */}
          <View style={styles.infoBox}>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(1000)}><Text style={styles.gridButtonText}>+1,000ML</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(800)}><Text style={styles.gridButtonText}>+800ML</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(350)}><Text style={styles.gridButtonText}>+350ML</Text></TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(100)}><Text style={styles.gridButtonText}>+100ML</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(50)}><Text style={styles.gridButtonText}>+50ML</Text></TouchableOpacity>
              <TouchableOpacity style={styles.gridButton} onPress={() => addToCustomAmount(30)}><Text style={styles.gridButtonText}>+30ML</Text></TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.inputBoxContainer}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Type your own Volume"
                  value={customAmount}
                  onChangeText={handleTextInput}
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.gridButton} onPress={undoLastLog}><Text style={styles.gridButtonText}>UNDO LAST LOG</Text></TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              <TouchableOpacity style={[styles.gridButton, styles.enterButton]} onPress={handleEnter}><Text style={styles.gridButtonText}>Enter</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoBox3}>
            <Text style={styles.infoSubtitle}>WHY HYDRATE?</Text>
            <Text style={[styles.infoContent, { color: 'white' }]}>Proper hydration is essential for overall wellness, boosting physical performance, promoting healthy skin, and sharpening your focus.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default WaterIntake
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
  },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  scrollViewContent: { paddingBottom: 120 },
  headerContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Platform.OS === 'android' ? 20 : 0, 
    marginBottom: 20 
  },
  welcomeButton: { flexDirection: "row", alignItems: "center" },
  welcomeText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: width * 0.04, 
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  logo: {
    marginTop: 10,
    width: 100,
    height: 50,
  },
  contentContainer: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 20 
  },
  actionButton: {
    width: 200, 
    height: 80, 
    justifyContent: "center", 
    flexDirection: 'row', 
    alignItems: "center", 
    borderRadius: 50, 
    borderColor: "#FFFFFF", // White border for the button
    borderWidth: 2,
    marginBottom: 30, // Add space between button and info boxes
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  actionIcon: {
    width: 40, 
    height: 40,
    marginRight: 10, 
  },
  actionText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 20, 
    color: "#FFF", 
    textAlign: "left",  
  },
  infoBox: {
    height: 290, // Adjusted height for more content
    backgroundColor: "#1A1A1A", 
    borderRadius: 35,
    marginBottom: 20, // Space between boxes
    width: "100%",
    borderColor: '#0D79A2',
    borderWidth: 3,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox3: {
    height: 150, // Adjusted height for more content
    backgroundColor: "#1A1A1A", 
    borderRadius: 35,
    marginBottom: 20, // Space between boxes
    width: "100%",
    borderColor: '#0D79A2',
    borderWidth: 3,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSubtitle: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 50,
    color: '#FFF', // Match the border color
  },
  infoContent: {
    fontFamily: "Roboto_Condensed-ExtraBold",
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.4
  },
  // Styles for the grid in the second info box
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    paddingBottom: 12, // Add vertical spacing between rows
  },
  gridButton: {
    flex: 1,
    backgroundColor: '#0D79A2',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonText: {
    color: '#FFF',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 20,
  },
  inputBoxContainer: {
    flex: 2.1, // Make it take up roughly two button spaces
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
  },
  inputBox: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 22,
    paddingVertical: 12,
  },
  enterButton: {
    backgroundColor: '#084C61', // A slightly different shade for emphasis
  },
  // Styles for the graph in the first info box
  graphBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 190, // Reset height for this specific box
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  legendValue: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 42,
    lineHeight: 45,
    color: '#009AD6'
  },
  legendLabel: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 18,
    color: '#AAA',
    marginTop: 5,
  },
  legendLabel1: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 18,
    color: '#0FAC43',
    marginTop: 5,
  },
  clearButton: {
    position: 'absolute',
    bottom: 15,
    right: 25,
  },
  clearButtonText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 20,
    color: '#AAA',
    textDecorationLine: 'underline',
  },
  chartCenterLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BebasNeue-Regular',
    marginTop: 4,
  },
});
