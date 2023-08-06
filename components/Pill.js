import React, {useState} from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import { COLORS } from '../constants';


const Pill = ({props, handlePress, currentFilter}) => {

    const [selected, setSelected] = React.useState(false);

    React.useEffect(() => {
        setSelected(currentFilter === props.sport)
    }, [currentFilter])


    return (
        <TouchableOpacity style = {
            [ styles.pill, selected ? styles.selectedPill : null]
        }
        onPress={() => {
            handlePress(props.sport)
            }
        }>
            <Text style={[ selected ? {color: 'white', fontWeight: '700'}: null ]}>{props.sport}</Text>
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
        marginHorizontal: 7
    },
    selectedPill : {
        backgroundColor: COLORS.primary
    }
});

export default Pill;
