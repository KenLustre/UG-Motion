import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Alert, ImageBackground, Platform, StatusBar, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProfile } from "./_layout";
type SplitType = 'ppl' | 'upper_lower' | 'body_part' | null;
type EquipmentType = 'dumbbells' | 'bodyweight' | 'cardio' | 'machines';
const CreateWorkoutPlan = () => {
    const router = useRouter();
    const { updateWeeklyPlan, setSelectedEquipment } = useProfile();
    const textColor = '#FFFFFF';
    const [splitType, setSplitType] = useState<SplitType>(null);
    const [equipment, setEquipment] = useState<EquipmentType[]>([]);
    const handleCreatePlan = () => {
        if (!splitType || equipment.length === 0) {
            Alert.alert("Incomplete Setup", "Please select a split structure and at least one type of equipment.");
            return;
        }
        const plan = [
            { id: 1, day: 'Mon', focus: 'Push', activities: [] },
            { id: 2, day: 'Tue', focus: 'Pull', activities: [] },
            { id: 3, day: 'Wed', focus: 'Legs', activities: [] },
            { id: 4, day: 'Thu', focus: 'Rest', activities: [] },
            { id: 5, day: 'Fri', focus: 'Push', activities: [] },
            { id: 6, day: 'Sat', focus: 'Pull', activities: [] },
            { id: 7, day: 'Sun', focus: 'Rest', activities: [] },
        ];
        updateWeeklyPlan(plan as any); 
        setSelectedEquipment(equipment); 
        router.replace('/Calendar'); 
    };
    const toggleEquipment = (item: EquipmentType) => {
        setEquipment(prev => 
            prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
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
                <ScrollView style={styles.setupContainer}>
                    <Text style={[styles.setupTitle, { color: '#FFF' }]}>Create Your Workout Plan</Text>
                    <Text style={[styles.setupSubtitle, { color: '#FFF', opacity: 0.7}]}>First, let's personalize your week.</Text>
                    {/* Split Structure Selection */}
                    <Text style={[styles.sectionTitle, { color: '#FFF' }]}>1. Choose Your Split Structure</Text>
                    <View style={styles.selectionGrid}>
                        <TouchableOpacity style={[styles.selectionCard, splitType === 'ppl' && styles.selectedCard]} onPress={() => setSplitType('ppl')}>
                            <Text style={styles.cardText}>Push / Pull / Legs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectionCard, splitType === 'upper_lower' && styles.selectedCard]} onPress={() => setSplitType('upper_lower')}>
                            <Text style={styles.cardText}>Upper / Lower</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectionCard, splitType === 'body_part' && styles.selectedCard]} onPress={() => setSplitType('body_part')}>
                            <Text style={styles.cardText}>Body Part Split</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Equipment Selection */}
                    <Text style={[styles.sectionTitle, { color: '#FFF' }]}>2. Select Available Equipment</Text>
                    <View style={styles.selectionGrid}>
                        <TouchableOpacity style={[styles.selectionCard, equipment.includes('dumbbells') && styles.selectedCard]} onPress={() => toggleEquipment('dumbbells')}>
                            <Text style={styles.cardText}>Dumbbells</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectionCard, equipment.includes('bodyweight') && styles.selectedCard]} onPress={() => toggleEquipment('bodyweight')}>
                            <Text style={styles.cardText}>Bodyweight</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectionCard, equipment.includes('cardio') && styles.selectedCard]} onPress={() => toggleEquipment('cardio')}>
                            <Text style={styles.cardText}>Cardio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectionCard, equipment.includes('machines') && styles.selectedCard]} onPress={() => toggleEquipment('machines')}>
                            <Text style={styles.cardText}>Machines</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.createButton} onPress={handleCreatePlan}>
                        <Text style={styles.createButtonText}>Create Plan</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}
export default CreateWorkoutPlan;
const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    container: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: Platform.OS === 'android' ? 10 : 0, marginBottom: 20, paddingHorizontal: 20, zIndex: 1 },
    backButton: { flexDirection: "row", alignItems: "center" },
    backButtonText: { fontFamily: "BebasNeue-Regular", color: "#fff", fontSize: 16, letterSpacing: 0.5, fontWeight: "bold" },
    logo: { marginTop: 10, width: 100, height: 50 },
    setupContainer: { flex: 1, padding: 20 },
    setupTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 36, textAlign: 'center', marginBottom: 8 },
    setupSubtitle: { fontFamily: 'Georama-Regular', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30, fontWeight: 'bold' },
    sectionTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 22, marginBottom: 15, marginTop: 10 },
    selectionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 20 },
    selectionCard: { backgroundColor: '#333', paddingVertical: 20, paddingHorizontal: 15, borderRadius: 15, flexGrow: 1, minWidth: '45%', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
    selectedCard: { borderColor: '#0FAC43' },
    cardText: { color: '#FFF', fontFamily: 'BebasNeue-Regular', fontSize: 18 },
    createButton: { backgroundColor: '#0FAC43', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 20, marginBottom: 50 },
    createButtonText: { color: '#FFF', fontFamily: 'BebasNeue-Regular', fontSize: 20, letterSpacing: 1 },
});