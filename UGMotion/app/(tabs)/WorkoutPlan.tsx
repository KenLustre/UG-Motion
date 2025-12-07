import React from "react";
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Alert, ImageBackground, Platform, StatusBar, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProfile } from "./_layout";
interface Exercise {
    id: string;
    name: string;
    details: string; 
    completed: boolean;
}
interface DayPlan {
    day: string;
    focus: string;
    activities: Exercise[];
}
const WorkoutPlan = () => {
    const router = useRouter();
    const textColor = '#FFFFFF';
    const { weeklyPlan } = useProfile();
    const renderIntro = () => (
        <View style={styles.introContainer}>
            <FontAwesome5 name="dumbbell" size={80} color="#0FAC43" />
            <Text style={[styles.setupTitle, { color: '#FFF', marginTop: 20 }]}>Workout Planner</Text>
            <Text style={[styles.setupSubtitle, { color: '#FFF', opacity: 0.7 }]}>
                Build custom routines, track your exercises, and stay consistent to reach your fitness goals.
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/Create')}>
                <Text style={styles.createButtonText}>Get Started</Text>
            </TouchableOpacity>
            {weeklyPlan && weeklyPlan.length > 0 && (
                <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/Calendar')}>
                    <Text style={styles.continueButtonText}>Continue Workout</Text>
                </TouchableOpacity>
            )}
        </View>
    );
    return (
        <ImageBackground
            source={require("../../assets/images/AboutUsBG.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        onPress={() => router.push('/Dashboard')} 
                        style={styles.backButton}
                    >
                        <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.backButtonText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                        <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                {
                    renderIntro()
                }
            </View>
        </ImageBackground>
    );
}
export default WorkoutPlan
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
    },
    introContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        textAlign: 'center',
        marginTop: -150,
    },
    setupTitle: {
        fontFamily: 'BebasNeue-Regular',
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 8,
    },
    setupSubtitle: {
        fontFamily: 'Georama-Regular',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        fontWeight: 'bold'
    },
    cardText: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 18,
    },
    createButton: {
        backgroundColor: '#0FAC43',
        padding: 18,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    continueButton: {
        backgroundColor: '#333',
        padding: 18,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        marginTop: 15,
    },
    continueButtonText: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 20,
        letterSpacing: 1,
    },
    createButtonText: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 20,
        letterSpacing: 1,
    },
    background: {
        flex: 2,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    backButton: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    backButtonText: {
        fontFamily: "BebasNeue-Regular",
        color: "#fff",
        fontSize: 16, 
        letterSpacing: 0.5,
        fontWeight: "bold",
        zIndex: 1
    },
    logo: {
        marginTop: 10,
        width: 100,
        height: 50,
    },
});