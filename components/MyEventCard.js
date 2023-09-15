import React, { useEffect } from "react"
import { Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { acceptParticipant, fetchUser } from "../services/eventService";
import { Avatar, Button, color } from "@rneui/base";
import { COLORS } from "../constants";
import { Rating, RatingProps } from '@rneui/themed';



const MyEventCard = ({ userData }) => {

    const [userAccepted, setUserAccepted] = React.useState(userData.participant_status == "true");
    const [modalVisible, setModalVisible] = React.useState(false);


    const openRateModal = () => {
        setModalVisible(true);
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Puntua al participante</Text>
                        <View style={{marginBottom: 10}}>
                            <Rating showRating imageSize={20} fractions={1} onFinishRating={rating => console.log(rating)} />
                        </View>
                        <Button color={COLORS.primary} mode="contained" title="Guardar puntuacion" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});