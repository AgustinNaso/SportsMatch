import {React} from 'react'
import {View, Text, StyleSheet} from 'react-native'


const Pill = ({props}) => {
    return (
    <View style={styles.pill}>
        <Text>{props.sport}</Text>
    </View>
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
    }
});

export default Pill;
