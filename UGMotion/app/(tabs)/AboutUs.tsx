import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const { width} = Dimensions.get("window");
export default function AboutUs() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../assets/images/AboutUsBG.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {/* Custom Header with Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => router.push("/Profile")}
              style={styles.welcomeButton}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.welcomeText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/Dashboard")}>
              <Image
                source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.aboutTitle}>ABOUT US</Text>
          <View style={styles.infoBox}>
            <Text style={styles.paragraphText}>
              Welcome to <Text style={styles.greenText}>UG Motion</Text>, We believe every step, every rep, and every choice matters. Our mission is to make your wellness experience effective, enjoyable, and empowering.
            </Text>
            <Text style={styles.paragraphText}>
              <Text style={styles.greenText}>UG Motion</Text> is more than just a fitness app it is your digital companion, dedicated to helping you move better, feel stronger, and live healthier. Every feature is thoughtfully designed to simplify your workouts, track your progress, and inspire you to push beyond your limits.
            </Text>
            <Text style={styles.paragraphText}>
              We care deeply about our users. Our commitment to community drives us to create an experience that feels welcoming, motivating, and supportive. Your goals are our mission, and together, we move, grow, and thrive.
            </Text>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                © 2025 <Text style={styles.greenText}>UG motion</Text>. All Rights Reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  scrollViewContent: { paddingBottom: 120 },
  headerContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Platform.OS === 'android' ? 10 : 0,
    marginBottom: 20,
    zIndex: 1,
  },
  welcomeButton: { flexDirection: "row", alignItems: "center" },
  welcomeText: {
    fontFamily: "BebasNeue-Regular",
    color: "#fff",
    fontSize: width * 0.04, 
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  logo: {
    marginTop: 10,
    width: 100,
    height: 50,
  },
  aboutTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 58,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignContent:"center",
    alignSelf:"center",
  },
  paragraphText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 14,
    lineHeight: 24,
    color: '#FFF',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'justify',
    fontWeight: 'bold'
  },
  greenText: {
    color: '#0FAC43',
    fontFamily: 'BebasNeue-Regular',
    fontWeight: 'bold',
  },
  footerContainer: {
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 14,
    color: '#FFF',
  },
});