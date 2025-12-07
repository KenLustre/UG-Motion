import React, { useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, ImageBackground, Platform, StatusBar, Image, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router"; 
const { width } = Dimensions.get("window");
const LoadData = () => {
    const router = useRouter();
    const textColor = '#FFFFFF';
    useEffect(() => {
        router.replace('/Calendar');
    }, [router]);
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
                        onPress={() => router.push('/WorkoutPlan')} 
                        style={styles.backButton}
                    >
                        <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.backButtonText}>Workout Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                        <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                {/* You can add a loading indicator here if needed */}
                <Text style={styles.loadingText}>Loading Your Plan...</Text>
            </View>
        </ImageBackground>
    );
}
export default LoadData;
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: Platform.OS === 'android' ? 10 : 0, 
        marginBottom: 20,
        paddingHorizontal: 20,
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
    },
    logo: {
        marginTop: 10,
        width: 100,
        height: 50,
    },
    loadingText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 24,
        color: '#FFF',
    }
});