import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Define dynamic styles inside the component
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      paddingVertical: height * 0.1,
    },
    logo: {
      width: width * 0.7,
      height: height * 0.5,
      marginTop: height * -0.15,
    },
    kiffyGlowContainer: {
      width: width * 0.7,
    },
    motion: {
      fontSize: width * 0.03,
      letterSpacing: width * 0.09,
      marginTop: height * -0.177,
    },
    loginButton: {
      width: width * 0.35,
      height: height * 0.055,
    },
    loginText: {
      fontSize: width * 0.055,
    },
    footerText: {
      fontSize: width * 0.03,
    },
  }), [width, height]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/LoginLogo.png")}
          style={[styles.logo, dynamicStyles.logo]}
          resizeMode="contain"
        />
        <Text style={[styles.motion, dynamicStyles.motion]}>MOTION</Text>
      </View>
      <View style={[styles.kiffyGlowContainer, dynamicStyles.kiffyGlowContainer]}>
        <View style={styles.kiffyContainer}>
          <Image
            source={require("../assets/images/kiffymanPage.jpeg")}
            style={styles.kiffy}
            resizeMode="contain"
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.loginButton, dynamicStyles.loginButton]}
        onPress={() => router.push("/Login")}
      >
        <Text style={[styles.loginText, dynamicStyles.loginText]}>LOG IN</Text>
      </TouchableOpacity>
      <Text style={[styles.footerText, dynamicStyles.footerText]}>
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
  },
  logoContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  logo: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  kiffyGlowContainer: {
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
    fontFamily: "Tektur_Condensed-Bold",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#0FAC43",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
  },
  loginText: {
    color: "#fff",
    fontFamily: "BebasNeue-Regular",
    letterSpacing: 2,
  },
  footerText: {
    color: "#fff",
    fontFamily: "Georama-Regular",
    letterSpacing: 1.7,
    textAlign: "center",
    paddingHorizontal: "10%",
  },
});
