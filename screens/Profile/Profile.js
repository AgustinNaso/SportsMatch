import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../Components/TabBar/CustomButton';

const sports = ['Futbol', 'Basquet', 'Paddle'];


const Profile = () => {
    return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.profileHeader} >
                <Ionicons name="person" size={100} />
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileTextName}>John Doe</Text>
                    <Text style={styles.profileTextLocation}>Barracas, Buenos Aires</Text>
                </View>
            </View>
            <View style={styles.profileBody}>
                <Text style={styles.bodyText}>Edad: 25 años</Text>
                <Text style={styles.bodyText}>Telefono: 1121224423</Text>
                <Text style={styles.bodyText}>Deportes de Interes:</Text>
                {sports.map(sport =>
                    <Text style={styles.itemText}>{`\u26ab ${sport}`}</Text>)}
            </View>
            <View style={{minWidth: '70%', marginTop: 12}}>
                <CustomButton title={"Editar"} color='grey' />
            </View>
        </View>
    );
}

export default Profile;


const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        padding: 32
    },
    profileTextContainer: {
        flexDirection: 'col',
        justifyContent: 'space-evenly',
        marginLeft: 20
    },
    profileTextLocation: {
        fontSize: 20,
        fontWeight: 400
    },
    profileTextName: {
        fontSize: 36,
        fontWeight: 500
    },
    bodyText: {
        fontSize: 26,
        fontWeight: 300
    },
    itemText: {
        fontSize: 20,
        fontWeight: 300
    },
    profileBody: {
        flexDirection: 'col',
        justifyContent: 'space-evenly',
        height: '60%',
        width: '90%',
    }
});
