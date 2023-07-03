import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const sports = ['Futbol', 'Basquet', 'Paddle'];

const Profile = () => {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.navigate("MyEvents");
    }
    return (
        <View style={{flexDirection: 'column', alignItems: 'center', maxHeight: '100%'}}>
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
            <View style={{minWidth: '70%', marginTop: 10, paddingVertical: 2, flexDirection: 'column', justifyContent: 'space-between', minHeight: '14%'}}>
                <CustomButton title={"Editar"} color='grey' />
                <CustomButton title={"Mis eventos"} onPress={handlePress} color='green' />
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
        height: '55%',
        width: '90%',
    }
});
