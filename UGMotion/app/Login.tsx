import React, { useState, useMemo } from "react"; 
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchUserForLogin } from "./database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  const inputBackgroundColor = '#333';
  const inputTextColor = '#FFF';
  const placeholderTextColor = '#888';
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Login Failed", "Please enter both username and password.");
      return;
    }
    try {
      const user = await fetchUserForLogin(username);
      if (!user) {
        Alert.alert("Login Failed", "User not found.");
        return;
      }
      if (user.password === password) {
        // In a real app, this should check a role, not a hardcoded name
        const isAdmin = user.name.toLowerCase() === 'admin';
        const redirectPath = isAdmin ? "/AdminDashboard" : "/(tabs)/Dashboard";
        
        await AsyncStorage.setItem('loggedInUserId', user.id.toString());
        router.replace(redirectPath);
      } else {
        Alert.alert("Login Failed", "Incorrect password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      paddingVertical: height * 0.08,
      paddingHorizontal: width * 0.05,
    },
    welcomeText: {
      fontSize: width * 0.02, 
    },
    logoContainer: {
      marginTop: height * 0.08, 
      marginBottom: height * 0.2, 
    },
    logo: {
      width: width * 0.6,
      height: height * 0.2,
    },
    motion: {
      fontSize: width * 0.03,
      letterSpacing: width * 0.08, 
      marginTop: height * -0.04,
    },
    formContainer: {
      paddingHorizontal: width * 0.05,
    },
    inputContainer: {
      marginBottom: height * 0.02,
      height: height * 0.07,
    },
    iconContainer: {
      width: width * 0.15,
    },
    input: {
      paddingHorizontal: width * 0.04,
      fontSize: width * 0.04,
    },
    loginText: {
      fontSize: width * 0.055,
    },
    footerContainer: {
      marginTop: height * 0.1,
    },
    footerText: {
      fontSize: width * 0.02,
    },
  }), [width, height]);

  return (
    <ImageBackground
      source={require("../assets/images/LoginPlates.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "web" ? undefined : (Platform.OS === "ios" ? "padding" : "height")}
        style={styles.flexOne}
      >
        <View style={dynamicStyles.container}>
          {/* Header with Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.welcomeButton}
            >
              <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>WELCOME TO UG MOTION</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.logoContainer, dynamicStyles.logoContainer]}>
            <Image
              source={require("../assets/images/LoginLogo.png")}
              style={dynamicStyles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.motion, dynamicStyles.motion]}>MOTION</Text>
          </View>
          <View style={[styles.formContainer, dynamicStyles.formContainer]}>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                <FontAwesome name="user" size={width * 0.06} color="black" />
              </View>
              <TextInput
                style={[styles.input, dynamicStyles.input, { color: inputTextColor }]}
                placeholder="USERNAME"
                placeholderTextColor={placeholderTextColor}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                <FontAwesome5 name="key" size={width * 0.06} color="black" />
              </View>
              <TextInput
                style={[styles.input, dynamicStyles.input, { color: inputTextColor }]}
                placeholder="PASSWORD"
                placeholderTextColor={placeholderTextColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <FontAwesome5 name={isPasswordVisible ? "eye-slash" : "eye"} size={width * 0.05} color={placeholderTextColor} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.loginButton, { width: width * 0.35, height: height * 0.055 }]}
              onPress={handleLogin}>
              <Text style={[styles.loginText, dynamicStyles.loginText]}>LOG IN</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.footerContainer, dynamicStyles.footerContainer]}>
            <Text style={[styles.footerText, dynamicStyles.footerText]}>
              BY LOGGING IN, YOU AGREE TO UG MOTION{" "}
              <Text style={styles.footerLink}>PRIVACY POLICY</Text> AND{"\n"}
              <Text style={styles.footerLink}>TERMS AND CONDITIONS</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignSelf: "flex-start",
  },
  welcomeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "BebasNeue-Regular",
    color: "#fff",
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
  },
  motion: {
    color: "#fff",
    fontFamily: "Tektur_Condensed-Bold",
    textAlign: "center",
    marginRight: 10,
  },
  formContainer: {
    width: "100%",
    marginTop: 50
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(230, 230, 230, 1)",
    borderRadius: 10,
    overflow: "hidden",
  },
  iconContainer: {
    backgroundColor: "#0FAC43",
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#0FAC43",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
    marginTop: 10
  },
  loginText: {
    color: "#fff",
    fontFamily: "BebasNeue-Regular",
    letterSpacing: 2,
  },
  footerContainer: {
  },
  footerText: {
    color: "#ffffffff",
    fontFamily: "BebasNeue-Regular",
    letterSpacing: 0.2,
    textAlign: "center",
    paddingHorizontal: "5%",
    fontWeight: "bold",
  },
  footerLink: {
    color: "#0FAC43",
    fontFamily: "BebasNeue-Regular",
    fontWeight: "bold",
  },
});