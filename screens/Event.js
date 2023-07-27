import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../components/CustomButton";
import { EXPERTISE, SPORT } from "../constants/data";
import { fetchEventById } from "../services/eventService";


const Event = ({route}) => {
    const {props}= route.params;

    useEffect(() => {
        fetchEventById(props.event_id).then((data) => {
            console.log(data);
        });
    }, [])


    const joinEvent = () => {
    }

    const getDayAndMonth = (date) => {
        // Convert the input string to a Date object
        const parsedDate = new Date(date);
    
        // Get the day and month
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1; // Months are zero-based, so add 1
    
        return { day, month };
    };
    const time = props?.time?.split(" ")[1].split(":")[0] + ":" + props?.time?.split(" ")[1].split(":")[1]
    const {day, month} = getDayAndMonth(props?.time)

    return (
        <View style={styles.eventContainer}>
            <View style={styles.eventHeader}>
            <Ionicons name="person" size={110} style = {{marginLeft: 20}} />
                <View style={styles.headerData}>
                    <Text style={styles.headerBigText}>{props.owner_firstname}</Text>
                    <Text>{props.description}</Text>
                </View>
            </View>
            <View style={styles.eventBody}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.bodyBigText}>{SPORT[props.sport_id - 1]}</Text>
                    <Text style={styles.bodyBigText}>{`${day}/${month} ${time}`}</Text>
                </View>
                
                <Text style={styles.bodyMidText}>{EXPERTISE[props.expertise - 1]}</Text>
                <Text style={styles.bodyMidText}>{props.location}</Text>
            </View>
            <Text style={{fontSize: 20, fontWeight: 700}}>Ya estas anotado al partido!</Text>

            <View style={{width: '50%', marginTop: 50, marginLeft: 30, height: 90,
             flexDirection: 'column', justifyContent: 'space-between'}}>
                <CustomButton title={"Desanotarme"} color={"red"}/>
            </View>
        </View>
    )
}

export default Event;

const styles = StyleSheet.create({
    eventContainer : {
        flexDirection: 'column',
        alignItems: 'center'
    },
    eventHeader : {
        height: 200,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    headerData: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 30,
        width: '70%',
        height: '85%',
    },

    headerBigText : {
        fontSize: 22,
        fontWeight: 700
    },

    headerMidText : {
        fontSize: 18,
        fontWeight: 500
    },

    
   bodyBigText : {
        fontSize: 25,
        fontWeight: 600
    },

   bodyMidText : {
        fontSize: 18,
        fontWeight: 500
    },

    eventBody : {
        flexDirection: 'column',
        height: '40%',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20
    }
})