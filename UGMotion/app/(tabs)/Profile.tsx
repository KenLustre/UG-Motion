import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme, Image, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardTypeOptions, ImageBackground, SafeAreaView, Platform, StatusBar } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useProfile } from "./_layout";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Profile = () => {
    const textColor = '#FFFFFF';
    const boxBackgroundColor = '#1C1C1E';
    const router = useRouter();
    const { profileImageUri, setProfileImageUri, userData, setUserData } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(userData);
    useEffect(() => {
        setTempData(userData);
    }, [userData]);
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImageUri(result.assets[0].uri);
        }
    };
    const handleSave = () => {
        const hasChanged = tempData.height !== userData.height || 
                    tempData.weight !== userData.weight ||
                    tempData.name !== userData.name ||
                    tempData.age !== userData.age ||
                    tempData.sex !== userData.sex;
        setUserData(tempData);
        setIsEditing(false);
        if (hasChanged) {
            Alert.alert(
                "Profile Updated",
                "Your information has been saved. Would you like to check your updated BMI?",
                [
                    { text: "Later", style: "cancel" },
                    {
                        text: "Check BMI",
                        onPress: () => router.push('/BMI'),
                    },
                ]
            );
        } else {
            Alert.alert("Profile Updated", "Your information has been saved.");
        }
    };
    const handleCancel = () => {
        setTempData(userData); 
        setIsEditing(false);
    };
    const handleInputChange = (field: keyof typeof tempData, value: string) => {
        setTempData(prev => ({ ...prev, [field]: value }));
    };
    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Log Out", 
                    onPress: async () => {
                        await AsyncStorage.removeItem('loggedInUserId');
                        router.replace('/Login'); 
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleClear = () => {
        setTempData(prev => ({
            ...prev,
            name: '',
            age: '',
            sex: 'N/A',
            height: '',
            weight: '',
        }));
    };
    return (
        <ImageBackground
            source={require("../../assets/images/AboutUsBG.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
                        <Text style={[styles.logoutText, { color: '#fff' }]}>LOG OUT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                        <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                    style={styles.profileButton} 
                    onPress={pickImage}
                >
                    {profileImageUri ? (
                        <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
                    ) : (
                        <FontAwesome5 name="user-alt" size={70} color={textColor} />
                    )}
                    <View style={styles.editIconContainer}>
                        <FontAwesome5 name="user-edit" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                {!isEditing && (
                    <Text style={[styles.profileName, { color: '#fff' }]}>
                        {userData.name}
                    </Text>
                )}
                <View style={styles.buttonRow}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity style={[styles.modeButton, {backgroundColor: '#22C55E'}]} onPress={handleSave}>
                                <FontAwesome5 name="save" size={16} color="#fff" />
                                <Text style={styles.modeButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modeButton, {backgroundColor: '#888'}]} onPress={handleCancel}>
                                <FontAwesome5 name="times" size={16} color="#fff" />
                                <Text style={styles.modeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.modeButton} onPress={() => setIsEditing(true)}>
                                <FontAwesome5 name="user-edit" size={16} color="#fff" />
                                <Text style={styles.modeButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modeButton} onPress={() => router.push("/AboutUs")}>
                                <FontAwesome5 name="info-circle" size={16} color="#fff" />
                                <Text style={styles.modeButtonText}>About Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modeButton} onPress={() => router.push("/Privacy")}>
                                <FontAwesome5 name="user-shield" size={16} color="#fff" />
                                <Text style={styles.modeButtonText}>Privacy</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                {/* Info Boxes */}
                <View style={[styles.infoBox, { backgroundColor: boxBackgroundColor }]}>
                    <InfoRow label="Name" value={tempData.name} isEditing={isEditing} onChangeText={(text) => handleInputChange('name', text)} textColor={textColor} /> 
                    <InfoRow label="Age" value={tempData.age} isEditing={isEditing} onChangeText={(text) => handleInputChange('age', text)} keyboardType="numeric" textColor={textColor} />                    
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: textColor }]}>Sex</Text>
                        {isEditing ? (
                            <View style={styles.sexSelector}>
                                <TouchableOpacity style={[styles.sexOption, tempData.sex === 'Male' && styles.selectedSexOption]} onPress={() => handleInputChange('sex', 'Male')}>
                                    <Text style={[styles.sexOptionText, tempData.sex === 'Male' && styles.selectedSexText]}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.sexOption, tempData.sex === 'Female' && styles.selectedSexOption]} onPress={() => handleInputChange('sex', 'Female')}>
                                    <Text style={[styles.sexOptionText, tempData.sex === 'Female' && styles.selectedSexText]}>Female</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={[styles.infoValue, { color: textColor }]}>{tempData.sex}</Text>
                        )}
                    </View>
                    <InfoRow label="Height (cm)" value={tempData.height} isEditing={isEditing} onChangeText={(text) => handleInputChange('height', text)} keyboardType="numeric" textColor={textColor} />
                    <InfoRow label="Weight (kg)" value={tempData.weight} isEditing={isEditing} onChangeText={(text) => handleInputChange('weight', text)} keyboardType="numeric" textColor={textColor} />
                    {isEditing && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                            <Text style={[styles.clearButtonText, { color: textColor }]}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}
interface InfoRowProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChangeText: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    textColor: string;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value, isEditing, onChangeText, keyboardType = 'default', textColor }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const placeholderColor = isDark ? '#888' : '#AAA';
    return (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: textColor }]}>{label}</Text>
            {isEditing ? ( 
                <TextInput style={[styles.infoInput, { color: textColor }]} value={value === 'N/A' ? '' : value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder="N/A" placeholderTextColor={placeholderColor} />
            ) : (
                <Text style={[styles.infoValue, { color: textColor }]}>{value}</Text>
            )} 
        </View>
    );
};
export default Profile
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
},
headerContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
},
logoutText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 16,
    letterSpacing: 1,
},
logo: {
    width: 100,
    height: 50,
    marginTop: 5,
},
contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, 
    paddingBottom: 100, 
},
profileButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
},
profileImage: { width: '100%', height: '100%', borderRadius: 70 },
profileName: { fontFamily: "BebasNeue-Regular", fontSize: 32, letterSpacing: 1, marginTop: 20 },
editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 50,
},
buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
    marginBottom: 25,
    paddingHorizontal: 20,
    gap: 10,
},
modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
},
modeButtonText: {
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
    fontSize: 16,
},
infoBox: {
    width: '90%',
    borderRadius: 20,
    paddingHorizontal: 20,
    alignSelf: 'center',
    position: 'relative', // Needed for absolute positioning of child
    paddingBottom: 40, // Add padding to prevent overlap with clear button
},
infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
},
infoLabel: {
    fontSize: 20,
    opacity: 0.6,
},
infoValue: {
    fontSize: 20,
    opacity: 0.7,
},
infoInput: {
    fontSize: 20,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderColor: '#555',
    padding: 2,
    minWidth: 80,
},
sexSelector: {
    flexDirection: 'row',
    gap: 10,
},
sexOption: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#555',
},
selectedSexOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
},
sexOptionText: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    color: '#888',
},
selectedSexText: {
    color: '#FFF',
},
clearButton: {
    alignSelf: 'flex-end', // Align the button itself to the right
    marginTop: 10,
},
clearButtonText: {
    opacity: 0.7,
    fontFamily: 'BebasNeue-Regular',
    textDecorationLine: 'underline',
    fontSize: 16, 
},
});