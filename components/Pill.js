import React, {useState} from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import { COLORS } from '../constants';


//TODO: Props es solo el title
const Pill = ({props, handlePress, currentFilter, customStyle}) => {

    const [selected, setSelected] = React.useState(false);

    React.useEffect(() => {
        setSelected(currentFilter === props.title)
    }, [currentFilter])


    return (
        <TouchableOpacity style = {
            [ customStyle ? customStyle : styles.pill, selected ? styles.selectedPill : null ]
        }
        onPress={() => {
            handlePress(props.title)
            }
        }>
            <Text style={[ selected ? {color: 'white', fontWeight: '700'}: null, customStyle ? customStyle.textStyle : null ]}>{props.title}</Text>
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
        marginHorizontal: 7,
        minHeight: 37
    },
    selectedPill : {
        backgroundColor: COLORS.primary
    }
});

export default Pill;
