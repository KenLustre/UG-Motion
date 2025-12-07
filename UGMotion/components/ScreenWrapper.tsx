import React from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    useColorScheme,
    Platform,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

interface ScreenWrapperProps {
    children: React.ReactNode;
    headerLeft?: React.ReactNode;
}

export default function ScreenWrapper({ children, headerLeft }: ScreenWrapperProps) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const backgroundColor = isDark ? '#000000' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? '#FFFFFF' : '#000000';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}>

                {/* Header Row */}
                <View style={styles.headerRow}>
                    <View style={styles.headerLeftContainer}>
                        {headerLeft}
                    </View>

                    <View style={styles.spacer} />
                    <TouchableOpacity onPress={() => router.push("/(tabs)/Dashboard")}>
                        <Image
                            source={require("../assets/images/LoginLogo.png")}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                </View>

                {/* Screen-specific content will be rendered here */}
                {children}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollViewContent: {
        paddingBottom: 120,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    headerLeftContainer: {
        width: 50, // Reserve space on the left
        justifyContent: 'center',
    },
    profileButton: {
        borderWidth: 1,
        borderRadius: 50,
        padding: 2,
        marginRight: 12,
    },
    profileImage: { width: 40, height: 40, borderRadius: 20 },
    headerText: { fontFamily: "BebasNeue-Regular", fontSize: 24, letterSpacing: 1 },
    spacer: { flex: 1 },
    logo: { paddingTop: 80, width: 100, height: 50 },
});