import React from "react"
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { acceptParticipant } from "../services/eventService";


const MyEventCard = ({ userData }) => {

    const [userAccepted, setUserAccepted] = React.useState(userData.status == "true");

    const acceptUser = () => {
        acceptParticipant(userData.event_id, userData.userid).then((data) => {
            data.json().then((data) => {
                console.log(data);
                setUserAccepted(true)
            })
        }
        )
    }

    const sendMessage = () => {
        console.log(JSON.stringify(userData))
        Linking.openURL(`whatsapp://send?phone=${userData.telephone}&text=Hola ${userData.firstname}. Nos vemos en el partido!'`);
    }


    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.userText}>{userData.firstname}</Text>
                <Text> {userData.expertise}</Text>
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
                : <TouchableOpacity onPress={sendMessage}><Text>Contactar</Text></TouchableOpacity>
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