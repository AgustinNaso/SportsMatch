import React, {useState} from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'


const Pill = ({props}) => {

    const [selected, setSelected] = React.useState(false);

    return (
        <TouchableOpacity style={[
            styles.pill, selected ? styles.selectedPill : null
        ]}
        onPress={() => setSelected(!selected)}>
            <Text style={[ selected ? {color: 'white'}: null]}>{props.sport}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    pill : {
        flex: 1,
        width: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        maxHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4
    },
    selectedPill : {
        backgroundColor: 'black',
    }
});

export default Pill;
