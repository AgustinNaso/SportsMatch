import React from "react"
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const Card = ({ props }) => {

    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate("Event");
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
                <View style={styles.header}>
                    <Text style={styles.cardBigText}>{props.sport}</Text>
                    <Text style={styles.cardBigText}>{props.time}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.cardMidText}>{props.name}</Text>
                    <Text style={styles.cardMidText}>Nuñez</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.cardSmText}>Intermedio</Text>
                    <Text style={styles.cardSmText}>8/10P</Text>
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
        fontWeight: 500
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