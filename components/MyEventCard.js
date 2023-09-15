import React, { useEffect } from "react"
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { acceptParticipant, fetchUser } from "../services/eventService";
import { set } from "react-hook-form";
import { Avatar, Button } from "@rneui/base";
import { COLORS } from "../constants";


const MyEventCard = ({ userData }) => {
    console.log("USER DATA", userData)

    const [userAccepted, setUserAccepted] = React.useState(userData.participant_status == "true");

    const openRateModal = () => {

    }


    const acceptUser = async () => {
        try {
            await acceptParticipant(userData.event_id, userData.user_id)
            setUserAccepted(true)
        } catch (error) {
            console.log(error)
        }
    }

    const sendMessage = () => {
        console.log(JSON.stringify(userData))
        Linking.openURL(`whatsapp://send?phone=${+userData.phone_number}&text=Hola ${userData.firstname}. Nos vemos en el partido!`);
    }


    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Avatar rounded size={62} source={require("../assets/default-profile.png")} containerStyle={{ backgroundColor: COLORS.secondary }} />
                <Text style={styles.userText}>{userData.firstname}</Text>
            </View>
            {!userAccepted ?
                <View style={styles.buttonContainer}>
                    <TouchableOpacity>
                        <Ionicons name="close" size={40} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="checkmark" size={40} color="green" onPress={acceptUser} />
                    </TouchableOpacity>
                </View>
                : userData.eventStatus !== 2 ?
                    <Button color={COLORS.primary} mode="contained" title="Contactar" onPress={sendMessage} />
                    : userData.eventStatus === 2 && <Button color={COLORS.primary} mode="contained" title="Puntuar" onPress={openRateModal} />
                }

        </View>
    );
}

export default MyEventCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: '85%',
        alignSelf: 'center',
        height: 110,
        marginVertical: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 5,
    },
    textContainer: {
        flexDirection: 'row',
        padding: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '50%',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '35%',
        justifyContent: 'space-between'

    },
    userText: {
        fontSize: 30,
        fontWeight: 600,
        marginLeft: 12
    }
});