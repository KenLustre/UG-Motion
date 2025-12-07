import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
export default function IndexScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/LoginLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.motion}>MOTION</Text>
      </View>
      <View style={styles.kiffyGlowContainer}>
        <View style={styles.kiffyContainer}>
          <Image
            source={require("../assets/images/kiffymanPage.jpeg")}
            style={styles.kiffy}
            resizeMode="contain"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/Login")}
      >
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        THE FIRST WORLD CLASS IRON GYM IN THE PHILIPPINES
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.1,
  },
  logoContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.5,
    marginTop: height * -0.15,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  kiffyGlowContainer: {
    width: width * 0.7,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  kiffyContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    position: "absolute",
    zIndex: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  kiffy: {
    width: "100%",
    height: "100%",
  },
  motion: {
    color: "#fff",
    fontSize: width * 0.03,
    fontFamily: "Tektur_Condensed-Bold",
    letterSpacing: width * 0.09,
    textAlign: "center",
    marginTop: height * -0.177,
  },
  loginButton: {
    backgroundColor: "#0FAC43",
    width: width * 0.35,
    height: height * 0.055,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
  },
  loginText: {
    color: "#fff",
    fontSize: width * 0.055,
    fontFamily: "BebasNeue-Regular",
    letterSpacing: 2,
  },
  footerText: {
    color: "#fff",
    fontSize: width * 0.03,
    fontFamily: "Georama-Regular",
    letterSpacing: 1.7,
    textAlign: "center",
    paddingHorizontal: "10%",
  },
});
