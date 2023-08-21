import React from "react"
import { View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { EXPERTISE, SPORT } from "../constants/data";
import { COLORS } from "../constants";
import { Avatar } from "@rneui/themed";
import { Button } from "@rneui/base";

const Card = ({ props }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate("Evento", { props: props });
    }
    console.log(props)

    const getDayAndMonth = (date) => {
        // Convert the input string to a Date object
        const parsedDate = new Date(date);

        // Get the day and month
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1; // Months are zero-based, so add 1

        return { day, month };
    };

    const time = props?.time?.split(" ")[1].split(":")[0] + ":" + props?.time?.split(" ")[1].split(":")[1]
    const { day, month } = getDayAndMonth(props?.time)

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.section}>
                <View style={{...styles.verticalSection,marginLeft: 8}}>
                    <Avatar rounded size={100} source={require("../assets/default-profile.png")} containerStyle={{ backgroundColor: COLORS.secondary }} />
                    <Text style={styles.cardMidText}>{props.owner_firstname} Marcos</Text>
                </View>
                <View style={[styles.verticalSection, {alignItems: 'flex-start'}]}>
                    <Text style={styles.cardBigText}>{SPORT[props.sport_id - 1]}</Text>
                    <Text style={{...styles.cardMidText, flex: 1}}>{EXPERTISE[2]}</Text>
                    <Text style={{...styles.cardMidText, marginBottom: 2}}>Falta{props.remaining > 1 ? 'n: ' : ': '}{props.remaining}</Text>
                </View>
            </View>
            <View style={[styles.section, { backgroundColor: COLORS.primary, margin: -10, paddingHorizontal: 10, paddingVertical: 4 }]}>
                <Text style={[styles.cardSmText, { color: COLORS.white }]}>{EXPERTISE[props.expertise]} 23 de agosto</Text>
                <Text style={[styles.cardSmText, { color: COLORS.white }]}>Villa Crespo</Text>
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
    }
})

export default Card;
