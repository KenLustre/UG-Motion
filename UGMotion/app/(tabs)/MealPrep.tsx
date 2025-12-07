import React from "react";
import { StyleSheet, useColorScheme, Image, ScrollView, SafeAreaView, Platform, StatusBar, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons'; 
const { width } = Dimensions.get("window");
export default function MealPrepScreen() {
    const backgroundColor = '#000000';
    const textColor = '#FFFFFF';
    const router = useRouter();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Custom Header with Back Button */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.push('/Dashboard')} style={styles.backButton}>
                        <FontAwesome5 name="chevron-left" size={14} color={textColor} style={{ marginRight: 8 }} />
                        <Text style={[styles.backButtonText, { color: textColor }]}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                        <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageBorderContainer}>
                    <View style={styles.imageClipContainer}>
                        <Image
                            source={require('../../assets/images/MEAL.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingHorizontal: 20,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100, 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: Platform.OS === 'android' ? 20 : 0,
        zIndex: 2, 
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center"
    },
    backButtonText: {
        fontFamily: "BebasNeue-Regular",
        fontSize: width * 0.04,
        letterSpacing: 0.5,
        fontWeight: "bold",
    },
    logo: {
        width: 100,
        height: 50,
    },
    imageBorderContainer: {
        width: '100%',
        aspectRatio: 389 / 1024,
        marginTop: 10,
        borderRadius: 35,
        borderWidth: 10,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 2, // Optional: small gap between border and image
    },
    imageClipContainer: {
        width: '100%',
        height: '70%',
        borderRadius: 25, // Inner radius
        overflow: 'hidden',
        backgroundColor: '#000', // Match the image background
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
