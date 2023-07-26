import React from "react"
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const Card = ({ props }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate("Event");
    }

    //TODO: Esto sacarlo de aca y ponerlo en un archivo de constantes
    const EXPERTISE = ['Principiante', 'Intermedio', 'Avanzado']
    const SPORT = ['Futbol', 'Basquet', 'Paddle', 'Voley', 'Tenis','Ping Pong']
    const time = props?.time?.split(" ")[1].split(":")[0] + ":" + props?.time?.split(" ")[1].split(":")[1]

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
                <View style={styles.header}>
                    <Text style={styles.cardBigText}>{SPORT[props.sport_id - 1]}</Text>
                    <Text style={styles.cardBigText}>{time}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.cardMidText}>{props.owner_firstname}</Text>
                    <Text style={{maxWidth: '60%', ...styles.cardMidText}}>{props.location}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.cardSmText}>{EXPERTISE[props.expertise]}</Text>
                    <Text style={styles.cardSmText}>Falta{props.remaining > 1 ? 'n: ':': '}{props.remaining}</Text>
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
        borderRadius: 5,
        flexDirection: 'column',
        padding: 15,
        borderWidth: 1,
        borderColor: 'black',
        height: 130,
        justifyContent: 'space-between'
    },

    cardBigText: {
        fontSize: 24,
        fontWeight: 700
    },
    cardMidText: {
        fontSize: 20,
        fontWeight: 500,
    },
    cardSmText: {
        fontSize: 14,
        fontWeight: 500
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default Card;

//metano mejora