import React, { useState, useEffect } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { useProfile } from "./_layout";
const { width } = Dimensions.get("window");
const BMI = () => {
  const router = useRouter();
  const backgroundColor = '#000000';
  const textColor = '#FFFFFF';
  const placeholderColor = '#888';
  const { userData, setUserData } = useProfile();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState(70); // Default weight
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiClassification, setBmiClassification] = useState('');
  // Pre-fill data from profile when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const profileHeight = userData.height;
      const profileWeight = userData.weight;
      if (profileHeight && profileHeight !== 'N/A') {
        setHeight(profileHeight);
      }
      if (profileWeight && profileWeight !== 'N/A') {
        const weightNum = parseInt(profileWeight, 10);
        if (!isNaN(weightNum)) {
          setWeight(weightNum);
        }
      }
    }, [userData])
  );
  const handleCalculate = () => {
    // Don't calculate if inputs are empty
    if (!height || !weight || parseFloat(height) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid height and weight to calculate your BMI.");
      setBmi(null);
      setBmiClassification('');
      return;
    }
    const heightInMeters = parseFloat(height) / 100;
    if (heightInMeters > 0 && weight > 0) {
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
      // Set classification based on BMI
      if (calculatedBmi < 18.5) setBmiClassification('Underweight');
      else if (calculatedBmi <= 24.9) setBmiClassification('Healthy Weight');
      else if (calculatedBmi <= 29.9) setBmiClassification('Overweight');
      else if (calculatedBmi <= 34.9) setBmiClassification('Obese (Class 1)');
      else if (calculatedBmi <= 39.9) setBmiClassification('Obese (Class 2)');
      else setBmiClassification('Obese (Class 3)');
      // Check if the new values differ from profile and prompt to save
      const profileHeight = userData.height;
      const profileWeight = userData.weight;
      if (height !== profileHeight || String(weight) !== profileWeight) {
        Alert.alert(
          "Update Profile?",
          `Your entered height (${height} cm) and weight (${weight} kg) are different from your profile. Would you like to save these new values?`,
          [
            { text: "No, Thanks", style: "cancel" },
            {
              text: "Yes, Save",
              onPress: () => {
                setUserData({ ...userData, height, weight: String(weight) });
                Alert.alert("Profile Updated", "Your height and weight have been saved to your profile.");
              },
            },
          ]
        );
      }
    } else {
      setBmi(null);
      setBmiClassification('');
    }
  };
  const handleWeightChange = (amount: number) => {
    setWeight(prev => Math.max(0, prev + amount));
  };
  const handleHeightInput = (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setHeight(numericValue);
  };
  const showBmiInfo = () => {
    Alert.alert(
      "BMI Classification Info",
      `BMI is classified into four main categories:
• Underweight: < 18.5
• Healthy Weight: 18.5 – 24.9
• Overweight: 25.0 – 29.9
• Obese: 30.0 or higher
The obese category is further divided into three classes:
• Class 1: 30.0 – 34.9
• Class 2: 35.0 – 39.9
• Class 3: > 40.0`,
      [{ text: "OK" }]
    );
  };
  const handleWeightTextInput = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 0) {
      setWeight(num);
    } else if (text === '') {
      setWeight(0);
    } else {
      Alert.alert("Invalid Input", "Please enter a valid positive number for weight.");
    }
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
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#550A0A", marginRight: 0 }]} onPress={() => router.push('/BMI')}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Q8yViyeUqE/57to65ha_expires_30_days.png" }} 
              resizeMode="contain"
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>BMI CALCULATOR</Text>
          </TouchableOpacity>
          {/* Info Boxes */}
          <View style={[styles.infoBox, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.boxTitle}>HEIGHT</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type in CM"
                placeholderTextColor={placeholderColor}
                keyboardType="numeric"
                value={height}
                onChangeText={handleHeightInput}
              />
            </View>
          </View>
          <View style={[styles.infoBox, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.boxTitle}>WEIGHT</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.modifierButton} onPress={() => handleWeightChange(-1)}>
                <FontAwesome5 name="minus" size={20} color="#FFF" />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { textAlign: 'center' }]}
                keyboardType="numeric"
                value={String(weight)}
                onChangeText={handleWeightTextInput}
              />
              <TouchableOpacity style={styles.modifierButton} onPress={() => handleWeightChange(1)}>
                <FontAwesome5 name="plus" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.infoBox, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.boxTitle}>RESULT</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                {bmi !== null ? `BMI: ${bmi.toFixed(1)}` : 'BMI: N/A'}
              </Text>
              {bmiClassification ? (
                <View style={styles.classificationContainer}>
                  <Text style={styles.resultText}>{bmiClassification}</Text>
                  <TouchableOpacity onPress={showBmiInfo} style={styles.infoIcon}>
                    <FontAwesome5 name="info-circle" size={22} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>CALCULATE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default BMI
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
    marginBottom: 20 },
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
    height: 190, // A suitable height for the boxes
    backgroundColor: "#1A1A1A", 
    borderRadius: 35,
    marginBottom: 20, // Space between boxes
    width: "100%",
    borderColor: '#9F0000',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTitle: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 50,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    width: '80%',
    height: 60,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: "BebasNeue-Regular",
    fontSize: 24,
    color: '#FFF',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  modifierButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 35,
  },
  classificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  infoIcon: {
    marginLeft: 10,
  },
  calculateButton: {
    backgroundColor: '#0FAC43',
    width: '80%',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  calculateButtonText: {
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    letterSpacing: 2,
  },
});
