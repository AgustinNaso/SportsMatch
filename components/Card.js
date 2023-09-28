import React from "react"
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { EXPERTISE, SPORT, MONTHS } from "../constants/data";
import { COLORS } from "../constants";
import { Avatar } from "@rneui/themed";
import { getDateComponents } from "../utils/datetime";
import { AirbnbRating, Button } from "@rneui/base";


const Card = ({ props }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [userRate, setUserRate] = React.useState(3);

    const handlePress = () => {
        navigation.navigate("Evento", { props: props });
    }

    const postUserRating = async () => {
        try {
            await rateUser(props.event_id, currUser.id, userRate, props.user_id)
            setModalVisible(false)
        } catch (error) {
            console.log(error)
            //TODO: send user feedback of this error
        }

    }
    const { day, month, hours, minutes } = getDateComponents(props?.schedule)

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>¿Cómo fue jugar con este participante?</Text>
                        <View style={{ marginBottom: 20 }}>
                            <AirbnbRating size={30} reviewSize={25} reviews={['Muy malo', 'Malo', 'Normal', 'Bueno', 'Muy bueno']} onFinishRating={setUserRate} />
                        </View>
                        <Button color={COLORS.primary} mode="contained" title="Enviar puntuación" onPress={postUserRating} />
                    </View>
                </View>
            </Modal>
            <View style={styles.section}>
                <View style={{ ...styles.verticalSection, marginLeft: 8 }}>
                    <Avatar rounded size={100} source={require("../assets/default-profile.png")} containerStyle={{ backgroundColor: COLORS.secondary }} />
                    <Text style={styles.cardMidText}>{props.owner_firstname}</Text>
                </View>
                <View style={[styles.verticalSection, { alignItems: 'flex-start' }]}>
                    <Text style={styles.cardBigText}>{SPORT[props.sport_id - 1]}</Text>
                    <Text style={{ ...styles.cardMidText, flex: 1 }}>{EXPERTISE[props.expertise]}</Text>
                    {props.event_status === 2 ?
                        <Button color={COLORS.primary} mode="contained" title="Puntuar" onPress={() => setModalVisible(true)} /> :
                        <Text style={{ ...styles.cardMidText, marginBottom: 2 }}>{props.remaining > 0 ? 'Faltan: ' + props.remaining : 'Completo'}</Text>
                    }
                </View>
            </View>
            <View style={[styles.section, { backgroundColor: COLORS.primary, margin: -10, paddingHorizontal: 10, paddingVertical: 4 }]}>
                <Text style={[styles.cardSmText, { color: COLORS.white }]}>{day} de {MONTHS[month + 1]} {hours}:{minutes} hs</Text>
                <Text style={[styles.cardSmText, { color: COLORS.white }]}>{props.location}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
        marginVertical: 5,
        borderBottomEndRadius: 8,
        borderBottomLeftRadius: 8,
        flexDirection: 'column',
        padding: 10,
        borderWidth: 3,
        borderColor: COLORS.primary,
        height: 180,
        justifyContent: 'space-between',
        gap: 8,
        backgroundColor: COLORS.white
    },

    cardBigText: {
        fontSize: 28,
        fontWeight: 700,
        color: COLORS.primary
    },
    cardMidText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    cardSmText: {
        fontSize: 14,
        fontWeight: 500
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    verticalSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
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
})

export default Card;
