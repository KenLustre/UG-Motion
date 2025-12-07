import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Alert, ImageBackground, Platform, StatusBar, Image, Modal, TextInput, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProfile } from "./_layout";
import { RoutineActivity } from "../database";
const workoutSuggestions = {
    dumbbells: [
        "Dumbbell Bench Press", "Dumbbell Rows", "Goblet Squat", "Dumbbell Shoulder Press", "Bicep Curls", "Tricep Extensions", "Lunges"
    ],
    bodyweight: [
        "Push-ups", "Pull-ups", "Squats", "Plank", "Crunches", "Burpees", "Jumping Jacks"
    ],
    cardio: [
        "Running", "Cycling", "Jump Rope", "Stair Climbing", "Elliptical Trainer"
    ],
    machines: [
        "Leg Press", "Lat Pulldown", "Chest Press Machine", "Seated Cable Row", "Leg Extension", "Hamstring Curl"
    ]
};
type EquipmentType = 'dumbbells' | 'bodyweight' | 'cardio' | 'machines';
const Calendar = () => {
    const router = useRouter();
    const textColor = '#FFFFFF';
    const cardBackgroundColor = '#1C1C1E';
    const { weeklyPlan, updateWeeklyPlan, selectedEquipment } = useProfile();
    const getAvailableWorkouts = () => {
        const available: string[] = [];
        (selectedEquipment as EquipmentType[]).forEach(equip => {
            if (workoutSuggestions[equip]) {
                available.push(...workoutSuggestions[equip]);
            }
        });
        return [...new Set(available)];
    };
    const availableWorkouts = getAvailableWorkouts();
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(10);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newActivityName, setNewActivityName] = useState('');
    const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
    const [completedActivityIds, setCompletedActivityIds] = useState<Set<number>>(new Set());
    const addActivity = () => {
        setNewActivityName('');
        setSets(3); 
        setReps(10);
        setIsModalVisible(true);
        setEditingActivityId(null); 
    };
    const handleSaveActivity = () => {
        if (!newActivityName.trim()) {
            Alert.alert("Missing Information", "Please enter an activity name.");
            return;
        }
        let updatedPlan;
        if (editingActivityId !== null) {
            updatedPlan = weeklyPlan.map((day, index) => {
                if (index === selectedDayIndex) {
                    return {
                        ...day,
                        activities: day.activities.map(act => 
                            act.id === editingActivityId 
                                ? { ...act, name: newActivityName.trim(), sets, reps } 
                                : act
                        )
                    };
                }
                return day;
            });
        } else {
            const newActivity: RoutineActivity = {
                id: Date.now(), 
                plan_day_id: weeklyPlan[selectedDayIndex].id,
                name: newActivityName.trim(),
                sets: sets,
                reps: reps,
            };
            updatedPlan = [...weeklyPlan];
            updatedPlan[selectedDayIndex].activities.push(newActivity);
        }
        updateWeeklyPlan(updatedPlan);
        setIsModalVisible(false);
    }
    const isActivityCompleted = (activityId: number) => {
        return completedActivityIds.has(activityId);
    };
    const toggleActivityComplete = (activityId: number) => {
        setCompletedActivityIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(activityId)) {
                newIds.delete(activityId);
            } else {
                newIds.add(activityId);
            }
            return newIds;
        });
    };
    const handleEditActivity = (activityId: number) => {
        const activityToEdit = weeklyPlan[selectedDayIndex].activities.find(act => act.id === activityId);
        if (activityToEdit) {
            setEditingActivityId(activityToEdit.id);
            setNewActivityName(activityToEdit.name);
            setSets(activityToEdit.sets);
            setReps(activityToEdit.reps);
            setIsModalVisible(true);
        }
    };
    const handleDeleteActivity = (activityId: number) => {
        const updatedPlan = weeklyPlan.map((day, index) => {
            if (index === selectedDayIndex) {
                return {
                    ...day,
                    activities: day.activities.filter(activity => activity.id !== activityId)
                };
            }
            return day;
        });
        updateWeeklyPlan(updatedPlan);
    };
    const handleOptionsPress = (activityId: number) => {
        Alert.alert(
            "Activity Options",
            "What would you like to do?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Edit", onPress: () => handleEditActivity(activityId) },
                { text: "Delete", onPress: () => handleDeleteActivity(activityId), style: "destructive" },
            ]
        );
    };
    if (weeklyPlan.length === 0) {
        router.replace('/WorkoutPlan');
        return null; 
    }
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
                        onPress={() => router.push('/Create')} 
                        style={styles.backButton}
                    >
                        <FontAwesome5 name="chevron-left" size={14} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.backButtonText}>Create your Workout Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/Dashboard")}>
                        <Image source={require("../../assets/images/LoginLogo.png")} style={styles.logo} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.flexOne}>
                    {/* Days Navigation Carousel */}
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysCarousel}>
                            {weeklyPlan.map((day, index) => (
                                <TouchableOpacity key={index} style={[styles.dayCard, index === selectedDayIndex && styles.selectedDayCard]} onPress={() => setSelectedDayIndex(index)}>
                                    <Text style={[styles.dayText, index === selectedDayIndex && styles.selectedDayText]}>{day.day}</Text>
                                    <Text style={[styles.dayFocus, index === selectedDayIndex && styles.selectedDayText]}>{day.focus}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    {/* Activity List */}
                    <ScrollView style={styles.activityList}>
                        <Text style={[styles.activityTitle, { color: '#FFF' }]}>Activities for {weeklyPlan[selectedDayIndex].day}</Text>
                        {weeklyPlan[selectedDayIndex].activities.length === 0 ? (
                            <Text style={styles.emptyText}>No activities planned. Add one!</Text>
                        ) : (
                            weeklyPlan[selectedDayIndex].activities.map(activity => (
                                <View key={activity.id} style={[styles.activityCard, { backgroundColor: cardBackgroundColor }]}>
                                    <TouchableOpacity onPress={() => toggleActivityComplete(activity.id)} style={styles.checkbox}>
                                        {isActivityCompleted(activity.id) && <FontAwesome5 name="check" size={16} color="#0FAC43" />}
                                    </TouchableOpacity>
                                    <View style={styles.activityThumbnail} />
                                    <View style={styles.activityDetails}>
                                        <Text style={[styles.activityName, { color: textColor }]}>{activity.name}</Text>
                                        <Text style={styles.activityMetrics}>{`${activity.sets} sets x ${activity.reps} reps`}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleOptionsPress(activity.id)}>
                                        <FontAwesome5 name="ellipsis-h" size={20} color="#888" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>
                    {/* "Add" Button */}
                    <TouchableOpacity style={styles.addButton} onPress={addActivity}>
                        <FontAwesome5 name="plus" size={20} color="#FFF" />
                    </TouchableOpacity>
                    {/* Add Activity Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
                                <Text style={[styles.modalTitle, { color: textColor }]}>{editingActivityId ? 'Edit Activity' : 'Add New Activity'}</Text>
                                <Text style={styles.suggestionTitle}>Suggestions based on your equipment:</Text>
                                <FlatList
                                    horizontal
                                    data={availableWorkouts}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.suggestionChip} onPress={() => setNewActivityName(item)}>
                                            <Text style={styles.suggestionChipText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.suggestionList}
                                />
                                <TextInput
                                    style={[styles.input, { color: textColor, backgroundColor: '#333'}]}
                                    placeholder="Exercise Name (e.g., Bench Press)"
                                    placeholderTextColor="#888"
                                    value={newActivityName}
                                    onChangeText={setNewActivityName}
                                />
                                {/* Sets and Reps Controls */}
                                <View style={styles.setRepContainer}>
                                    <View style={styles.controlGroup}>
                                        <Text style={styles.controlLabel}>Sets</Text>
                                        <View style={styles.controlButtons}>
                                            <TouchableOpacity style={styles.plusMinusButton} onPress={() => setSets(s => Math.max(1, s - 1))}>
                                                <FontAwesome5 name="minus" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                            <Text style={styles.controlValue}>{sets}</Text>
                                            <TouchableOpacity style={styles.plusMinusButton} onPress={() => setSets(s => s + 1)}>
                                                <FontAwesome5 name="plus" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.controlGroup}>
                                        <Text style={styles.controlLabel}>Reps</Text>
                                        <View style={styles.controlButtons}>
                                            <TouchableOpacity style={styles.plusMinusButton} onPress={() => setReps(r => Math.max(1, r - 1))}>
                                                <FontAwesome5 name="minus" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                            <Text style={styles.controlValue}>{reps}</Text>
                                            <TouchableOpacity style={styles.plusMinusButton} onPress={() => setReps(r => r + 1)}>
                                                <FontAwesome5 name="plus" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.modalButtonRow}>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#888' }]} onPress={() => setIsModalVisible(false)}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#0FAC43' }]} onPress={handleSaveActivity}>
                                        <Text style={styles.modalButtonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    );
}
export default Calendar;
const styles = StyleSheet.create({
    flexOne: { flex: 1, position: 'relative' },
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 0,
    },
    background: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
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
    backButton: { flexDirection: "row", alignItems: "center" },
    backButtonText: { fontFamily: "BebasNeue-Regular", color: "#fff", fontSize: 16, letterSpacing: 0.5, fontWeight: "bold" },
    logo: { marginTop: 10, width: 100, height: 50 },
    daysCarousel: { paddingHorizontal: 15, paddingVertical: 15 },
    dayCard: { backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, alignItems: 'center' },
    selectedDayCard: { backgroundColor: '#0FAC43' },
    dayText: { color: '#FFF', fontFamily: 'BebasNeue-Regular', fontSize: 18 },
    dayFocus: { color: '#AAA', fontFamily: 'Georama-Regular', fontSize: 12 },
    selectedDayText: { color: '#FFF' },
    activityList: { flex: 1, paddingHorizontal: 20 },
    activityTitle: { fontFamily: 'BebasNeue-Regular', fontSize: 24, marginVertical: 10 },
    emptyText: { fontFamily: 'Georama-Regular', fontSize: 16, color: '#FFF' , opacity: 0.7, textAlign: 'center', marginTop: 50, fontWeight: 'bold' },
    activityCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 10 },
    checkbox: { width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: '#888', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    activityThumbnail: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#444', marginRight: 15 },
    activityDetails: { flex: 1 },
    activityName: { fontFamily: 'BebasNeue-Regular', fontSize: 20 },
    activityMetrics: { fontFamily: 'Georama-Regular', fontSize: 14, color: '#888' },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0FAC43',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '85%',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: 'BebasNeue-Regular',
        fontSize: 28,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 16,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        opacity: 0.7
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    suggestionTitle: {
        alignSelf: 'flex-start',
        fontFamily: 'Georama-Regular',
        color: '#AAA',
        fontSize: 12,
        marginBottom: 8,
    },
    suggestionList: {
        width: '100%',
        marginBottom: 15,
    },
    suggestionChip: {
        backgroundColor: '#0FAC43',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginRight: 8,
    },
    suggestionChipText: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 14,
    },
    setRepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    controlGroup: {
        alignItems: 'center',
    },
    controlLabel: {
        fontFamily: 'BebasNeue-Regular',
        fontSize: 18,
        color: '#AAA',
        marginBottom: 8,
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    plusMinusButton: {
        backgroundColor: '#555',
        width: 30, height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlValue: { fontFamily: 'BebasNeue-Regular', fontSize: 24, color: '#FFF' },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#FFF',
        fontFamily: 'BebasNeue-Regular',
        fontSize: 18,
    },
});