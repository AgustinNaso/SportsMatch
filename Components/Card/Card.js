import React from "react"
import { View , Text, StyleSheet} from "react-native";


const Card = ({props}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
            <Text style={styles.cardBigText}>{props.sport}</Text>
            <Text style={styles.cardBigText}>{props.time}</Text>
            </View>
            <View style={styles.header}>
            <Text style={styles.cardMidText}>Juan</Text>
            <Text style={styles.cardMidText}>Nuñez</Text>
            </View>
            <View style={styles.header}>
            <Text style={styles.cardSmText}>Intermedio</Text>
            <Text style={styles.cardSmText}>8/10P</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card : {
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
        fontWeight: 500
    },
    cardSmText: {
        fontSize: 14,
        fontWeight: 500
    },
    header : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default Card;

//metano mejora