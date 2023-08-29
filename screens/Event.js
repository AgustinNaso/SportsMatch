import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../components/CustomButton";
import { EXPERTISE, SPORT } from "../constants/data";
import { fetchEventById, fetchParticipants, joinNewEvent } from "../services/eventService";
import { getCurrentUserData } from "../services/authService";
import { Avatar, Divider } from "@rneui/themed";
import { COLORS } from "../constants";
import { MONTHS } from "../constants/data";


const Event = ({ route }) => {
    const { props } = route.params;
    const [eventParticipants, setEventParticipants] = useState([]);
    const [currUserIsParticipant, setCurrUserIsParticipant] = useState(false);
    const [currUserIsAccepted, setCurrUserIsAccepted] = useState(false);
    const [userStatus, setUserStatus] = useState(0); //0: no anotado, 1: anotado, 2: aceptado
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchEventById(props.event_id).then((data) => {
            console.log(data);
        });
        fetchParticipants(props.event_id).then((data) => {
            data.json().then((data) => {
                console.log("PARTICIPANTS: " + JSON.stringify(data));
                setEventParticipants(data);
            })
        })
        getCurrentUserData().then((data) => {
            console.log("DATA: " + data);
            setUser(JSON.parse(data));
        }
        );
    }, [])


    useEffect(() => {
        console.log('in' + JSON.stringify(eventParticipants));
        eventParticipants.forEach((participant) => {
            console.log("PPP : " + participant.user_id)
            if (participant.user_id == 1) { //1 cambiar por user.uid
                setCurrUserIsParticipant(true);
                setCurrUserIsAccepted(participant.participant_status == "true")
            }
        })
    }, [eventParticipants])


    const joinEvent = async () => {
        try {
            await joinNewEvent(props.event_id, user?.uid)
            setUserStatus(1);
            setCurrUserIsParticipant(true);
        }
        catch (error) {
            console.log(error)
        }
    }

    const getDateComponents = (date) => {
        const parsedDate = new Date(date);
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth(); // Months are zero-based
        const hours = parsedDate.getHours();
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0")

        return { day, month, hours, minutes };
    };
    const { day, month, hours, minutes } = getDateComponents(props?.time)

    return (
        <View style={styles.eventContainer}>
            <View style={styles.eventHeader}>
                <Avatar rounded size={120} source={require("../assets/default-profile.png")} containerStyle={{ backgroundColor: COLORS.secondary }} />
                <View style={styles.headerData}>
                    <Text style={styles.bigText}>{props.owner_firstname}</Text>
                    <Text style={{ ...styles.mediumText, alignSelf: 'center' }}>{SPORT[props.sport_id - 1]}</Text>
                </View>
            </View>
            <Divider width={4} style={{ width: '90%', marginBottom: 8 }} />
            <View style={styles.eventBody}>
                <View style={styles.bodySection}>
                    <Text style={styles.bodyBigText}>Fecha:</Text>
                    <Text style={styles.bodyBigText}>{`${day} de ${MONTHS[month]} ${hours}:${minutes}hs`}</Text>
                </View>
                <View style={styles.bodySection}>
                    <Text style={styles.bodyBigText}>Nivel:</Text>
                    <Text style={styles.bodyBigText}>{EXPERTISE[props.expertise - 1]}</Text>
                </View>
                <View style={styles.bodySection}>
                    <Text style={styles.bodyBigText}>Ubicacion:</Text>
                    <Text style={styles.bodyBigText}>{props.location}</Text>
                </View>
            </View>
            {currUserIsParticipant &&
                <Text style={{ fontSize: 20, fontWeight: 700 }}>Ya estas anotado al partido!</Text>
            }

            <View style={{
                width: '50%', marginTop: 50, marginLeft: 30, height: 90,
                flexDirection: 'column', justifyContent: 'space-between'
            }}>
                {currUserIsParticipant ?
                    <CustomButton title={"Desanotarme"} color={"red"} />
                    :
                    <CustomButton title={"Anotarme"} color="green" onPress={joinEvent} />
                }
            </View>
        </View>
    )
}


export default Event;

const styles = StyleSheet.create({
    bodySection: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    eventContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    eventHeader: {
        height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        width: '100%'
    },

    headerData: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 8,
    },

    bigText: {
        fontSize: 50,
        fontWeight: 'bold'
    },

    mediumText: {
        fontSize: 18
    },


    bodyBigText: {
        fontSize: 25,
        fontWeight: 600
    },

    bodyMidText: {
        fontSize: 18,
        fontWeight: 500
    },

    eventBody: {
        flexDirection: 'column',
        height: '40%',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20
    }
})