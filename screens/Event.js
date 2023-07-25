import React from "react";
import {View, Text, StyleSheet, Touchable, TouchableOpacity} from "react-native"
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../Components/TabBar/CustomButton";



const Event = () => {
    return (
        <View style={styles.eventContainer}>
            <View style={styles.eventHeader}>
            <Ionicons name="person" size={110} style = {{marginLeft: 20}} />
                <View style={styles.headerData}>
                    <Text style={styles.headerBigText}>Juan</Text>
                    <Text>Buscamos 2 jugadores mas para un futbol 5.{"\n"}
                        El partido es en el porton de Nuñez.
                    </Text>
                </View>
            </View>
            <View style={styles.eventBody}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.bodyBigText}>Futbol</Text>
                    <Text style={styles.bodyBigText}>20:00hs</Text>
                </View>
                
                <Text style={styles.bodyMidText}>Intermedio</Text>
                <Text style={styles.bodyMidText}>El Porton de Nuñez</Text>
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