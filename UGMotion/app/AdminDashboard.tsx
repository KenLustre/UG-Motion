import React, { useState } from "react";
import {
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
    Alert,
    Modal,
    TextInput,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchAllUsers, User, deleteUserById, addUser } from "./database";

export default function AdminDashboardScreen() {
    const backgroundColor = '#121212';
    const textColor = '#FFFFFF';
    const cardBackgroundColor = '#1E1E1E';
    const headerColor = '#000000';

    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [lastDeletedUser, setLastDeletedUser] = useState<User | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            const allUsers = fetchAllUsers();
            setUsers(allUsers);
        }, [])
    );

    const handleAdd = () => setIsModalVisible(true);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsDetailsModalVisible(true);
    };

    const handleConfirmAddUser = () => {
        if (!newUsername.trim() || !newPassword.trim()) {
            Alert.alert("Invalid Input", "Username and password cannot be empty.");
            return;
        }

        const newUser = addUser(newUsername.trim(), newPassword.trim());
        if (newUser) {
            setUsers(currentUsers => [...currentUsers, newUser]);
            Alert.alert("Success", `User "${newUser.name}" has been created.`);
        } else {
            Alert.alert("Error", "Failed to create the user. Username might already exist.");
        }
        setNewUsername('');
        setNewPassword('');
        setIsModalVisible(false);
    };

    const handleDelete = (userId: number) => {
        const userToDelete = users.find(u => u.id === userId);
        if (!userToDelete) return;

        if (userToDelete.name.toLowerCase() === 'admin') {
            Alert.alert("Action Not Allowed", "The main Admin user cannot be deleted.");
            return;
        }

        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete the user "${userToDelete.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Delete", 
                    onPress: () => {
                        setLastDeletedUser(userToDelete);
                        deleteUserById(userId);
                        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
                        Alert.alert("User Deleted", `User "${userToDelete.name}" has been deleted.`);
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleUndo = () => {
        if (lastDeletedUser) {
            const restoredUser = addUser(lastDeletedUser.name, lastDeletedUser.password ?? '');
            if (restoredUser) {
                setUsers(fetchAllUsers());
                setLastDeletedUser(null);
                Alert.alert("Undo Successful", `Restored user: ${lastDeletedUser.name}.`);
            } else {
                Alert.alert("Undo Failed", "Could not restore the user.");
            }
        } else {
            Alert.alert("Undo", "No recent activity to undo.");
        }
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
                    onPress: () => router.replace('/Login'),
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.headerContainer, { backgroundColor: headerColor }]}>
                <Text style={[styles.headerTitle, { color: textColor }]}>Admin Dashboard</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <FontAwesome5 name="sign-out-alt" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            <View style={styles.mainActions}>
                <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={handleAdd}>
                    <FontAwesome5 name="plus" size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.undoButton]} onPress={handleUndo} disabled={!lastDeletedUser}>
                    <FontAwesome5 name="undo" size={16} color="#FFF" />
                    <Text style={styles.actionButtonText}>Undo</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.tableHeader, { borderBottomColor: '#333'}]}>
                    <Text style={[styles.headerCell, { flex: 1.5, color: textColor }]}>Name</Text>
                    <Text style={[styles.headerCell, styles.actionsHeaderCell, { color: textColor }]}>Actions</Text>
                </View>
                {users.map((user) => (
                    <TouchableOpacity 
                        key={user.id} 
                        style={[styles.userRow, { backgroundColor: cardBackgroundColor, borderBottomColor: '#333'}]}
                        onPress={() => handleUserClick(user)}
                    >
                        <View style={[styles.userInfo, { flex: 2.5 }]}>
                            <Text style={[styles.userName, { color: textColor }]}>{user.name}</Text>
                            <Text style={[styles.userEmail, { color: '#AAA'}]}>ID: {user.id}</Text>
                        </View>
                        <View style={[styles.userActions, { justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => handleDelete(user.id)} style={styles.deleteButton}>
                                <FontAwesome5 name="trash" size={14} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Add New User</Text>
                        <TextInput
                            style={[styles.input, { color: textColor, backgroundColor: '#333'}]}
                            placeholder="Username"
                            placeholderTextColor="#888"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={[styles.input, { color: textColor, backgroundColor: '#333'}]}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity 
                                style={[styles.modalButton, { backgroundColor: '#888' }]} 
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setNewUsername('');
                                    setNewPassword('');
                                }}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, { backgroundColor: '#34C759' }]} 
                                onPress={handleConfirmAddUser}
                            >
                                <Text style={styles.modalButtonText}>Add User</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isDetailsModalVisible}
                onRequestClose={() => setIsDetailsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor, maxHeight: '80%' }]}>
                        <View style={styles.modalHeaderRow}>
                             <Text style={[styles.modalTitle, { color: textColor }]}>User Details</Text>
                             <TouchableOpacity onPress={() => setIsDetailsModalVisible(false)}>
                                 <FontAwesome5 name="times" size={24} color={textColor} />
                             </TouchableOpacity>
                        </View>
                        
                        {selectedUser && (
                            <ScrollView style={{ width: '100%' }}>
                                {selectedUser.profileImageUri ? (
                                    <Image 
                                        source={{ uri: selectedUser.profileImageUri }} 
                                        style={styles.detailImage} 
                                    />
                                ) : (
                                    <View style={[styles.detailImagePlaceholder, { backgroundColor: '#333' }]}>
                                        <FontAwesome5 name="user" size={40} color="#888" />
                                    </View>
                                )}

                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>ID:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.id}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Name:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.name}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Email:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.email || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Age:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.age}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Sex:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.sex}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Height:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.height}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Weight:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.weight}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Equipment:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.selectedEquipment}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={[styles.detailLabel, { color: '#888' }]}>Password:</Text>
                                    <Text style={[styles.detailValue, { color: textColor }]}>{selectedUser.password || 'N/A'}</Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 5,
    },
    mainActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
    addButton: { backgroundColor: '#34C759' },
    undoButton: { backgroundColor: '#FF9500' },
    scrollContent: {
        paddingHorizontal: 10,
        paddingBottom: 50,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 2,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionsHeaderCell: { flex: 1, textAlign: 'right', paddingRight: 15 },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderRadius: 8,
        marginVertical: 5,
    },
    userInfo: { flex: 2 },
    userName: { fontSize: 16, fontWeight: '600' },
    userEmail: { fontSize: 12, marginTop: 2 },
    userActions: { flex: 1, flexDirection: 'row', marginLeft: 80 },
    editButton: { padding: 8 },
    deleteButton: { padding: 8 },
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
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    detailImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        width: 100,
    },
    detailValue: {
        flex: 1,
    },
});