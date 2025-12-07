import React from "react";
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground, Platform, StatusBar, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { useProfile } from "./_layout";
import { updateUserPassword } from "../database";
const { width } = Dimensions.get("window");
const Privacy = () => {
    const [email, setEmail] = React.useState('');
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = React.useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = React.useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
    const textColor = '#FFFFFF';
    const placeholderColor = '#888';
    const boxBackgroundColor = '#1A1A1A';
    const inputBackgroundColor = '#333';
    const router = useRouter();
    const { userData, setUserData } = useProfile();
    const handleEmailSave = () => {
        if (!email) {
            Alert.alert("Invalid Input", "Email field cannot be empty.");
            return;
        }
        Alert.alert(
            "Confirm Email Change",
            `Are you sure you want to set your email to ${email}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Confirm", onPress: () => {
                    setUserData({ ...userData, email: email });
                    Alert.alert("Success", "Your email has been updated.");
                }}
            ]
        );
    };
    const handlePasswordSave = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Invalid Input", "All password fields must be filled.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Password Mismatch", "The new password and confirm password fields do not match. Please try again.");
            return;
        }
        Alert.alert(
            "Confirm Password Change",
            "Are you sure you want to change your password?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Confirm", onPress: async () => {
                    try {
                        if (userData.id) {
                            await updateUserPassword(userData.id, newPassword);
                            Alert.alert("Success", "Your password has been changed successfully.");
                        }
                    } catch (error) {
                        console.error("Failed to update password", error);
                        Alert.alert("Error", "Could not update password.");
                    }
                } }
            ]
        );
    };
    return (
        <ImageBackground
            source={require("../../assets/images/AboutUsBG.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerContainer}>
                        <TouchableOpacity 
                            onPress={() => router.push('/Profile')} 
                            style={styles.welcomeButton}
                        >
                            <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.welcomeText}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                            <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    {/* You can add your Privacy page content here */}
                    <Text style={[styles.aboutTitle, {color: textColor}]}>PRIVACY</Text>
                    <View style={[styles.infoBox, { backgroundColor: boxBackgroundColor }]}>
                        {/* Email Section */}
                        <Text style={[styles.sectionTitle, { color: '#0FAC43'}]}>Email</Text>
                        <Text style={[styles.descriptionText, { color: '#AAA'}]}>
                            Enter your email to receive notifications about new features, workout reminders, and calorie intake summaries.
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
                            <FontAwesome5 name="envelope" size={16} color={placeholderColor} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="(example@gmail.com)"
                                placeholderTextColor={placeholderColor}
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.enterButton, { backgroundColor: '#0FAC43'}]} onPress={handleEmailSave}>
                                <Text style={styles.enterButtonText}>Enter</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        {/* Password Section */}
                        <Text style={[styles.sectionTitle, { color: '#0FAC43'}]}>Change Password</Text>
                        <Text style={[styles.descriptionText, { color: '#AAA'}]}>
                            Update your password regularly to keep your account secure.
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
                            <FontAwesome5 name="lock" size={16} color={placeholderColor} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="Enter current password"
                                placeholderTextColor={placeholderColor}
                                secureTextEntry={!isCurrentPasswordVisible}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                            <TouchableOpacity onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                                <FontAwesome5 name={isCurrentPasswordVisible ? "eye-slash" : "eye"} size={16} color={placeholderColor} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
                            <FontAwesome5 name="lock" size={16} color={placeholderColor} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="Enter new password"
                                placeholderTextColor={placeholderColor}
                                secureTextEntry={!isNewPasswordVisible}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                                <FontAwesome5 name={isNewPasswordVisible ? "eye-slash" : "eye"} size={16} color={placeholderColor} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
                            <FontAwesome5 name="lock" size={16} color={placeholderColor} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="Confirm new password"
                                placeholderTextColor={placeholderColor}
                                secureTextEntry={!isConfirmPasswordVisible}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <FontAwesome5 name={isConfirmPasswordVisible ? "eye-slash" : "eye"} size={16} color={placeholderColor} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.enterButton, { backgroundColor:'#0FAC43' }]} onPress={handlePasswordSave}>
                                <Text style={styles.enterButtonText}>Enter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
export default Privacy
const styles = StyleSheet.create({
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
  },
  scrollView: { 
    flex: 1, 
  }, 
  scrollViewContent: { 
    paddingBottom: 120 
  },
  headerContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: Platform.OS === 'android' ? 10 : 0, 
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  welcomeButton: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
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
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 100, 
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
    borderRadius: 35,
    padding: 25,
    width: '90%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    letterSpacing: 1,
  },
  descriptionText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginRight: 15,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  enterButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 16,
    letterSpacing: 1,
  },
});