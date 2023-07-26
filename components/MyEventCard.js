import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';


const MyEventCard = ({userData}) => {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.userText}>{userData.name}</Text>
                <Text>{userData.expertise}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity>
                    <Ionicons name="close" size={40} color="red" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="checkmark" size={40} color="green" />
                </TouchableOpacity>

            </View>
        </View>
    );
}

export default MyEventCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: '85%',
        alignSelf: 'center',
        height: 100,
        marginVertical: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    textContainer: {
        flexDirection: 'column'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '35%',
        justifyContent: 'space-between'

    },
    userText: {
        fontSize: 30,
        fontWeight: 600
    }
});