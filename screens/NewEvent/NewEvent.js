import RNDateTimePicker from '@react-native-community/datetimepicker'
import React from 'react'
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView } from 'react-native-safe-area-context'


const sportsData = [
    { key: '1', value: 'Futbol' },
    { key: '2', value: 'Paddle' },
    { key: '3', value: 'Tennis' },
    { key: '4', value: 'Basquet' },
    { key: '5', value: 'Handball' },
]

const difficultyData = [
    { key: '1', value: 'Principiante' },
    { key: '2', value: 'Intermedio' },
    { key: '3', value: 'Avanzado' },
    { key: '4', value: 'Profesional' }
]

const locations = [
    { key: 1, value: "Agronomía" },
    { key: 2, value: "Almagro" },
    { key: 3, value: "Balvanera" },
    { key: 4, value: "Barracas" },
    { key: 5, value: "Belgrano" },
    { key: 6, value: "Boedo" },
    { key: 7, value: "Caballito" },
    { key: 8, value: "Chacarita" },
    { key: 9, value: "Coghlan" },
    { key: 10, value: "Colegiales" },
];


const NewEvent = () => {

    const [selectedSport, setSelectedSport] = React.useState("");
    const [selectedDifficulty, setSelectedDifficulty] = React.useState("");
    const [selectedLocation, setSelectedLocation] = React.useState("");
    const [date, setDate] = React.useState(new Date(1598051730000));
    const [mode, setMode] = React.useState('date');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };


    return (
        <View style={{flexDirection: 'col', justifyContent: 'space-evenly'}}>
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SelectList
                        setSelected={(val) => setSelectedSport(val)}
                        data={sportsData}
                        save="value"
                        maxHeight={200}
                        placeholder='Elija el deporte'
                        boxStyles={{ marginVertical: 10 }}
                        dropdownStyles={{ minWidth: '35%' }}
                        inputStyles={{ minWidth: '35%' }}
                        search={false}
                    />
                    <SelectList
                        setSelected={(val) => setSelectedDifficulty(val)}
                        data={difficultyData}
                        save="value"
                        maxHeight={200}
                        placeholder='Elija la dificultad'
                        boxStyles={{ marginVertical: 10 }}
                        dropdownStyles={{ minWidth: '35%' }}
                        inputStyles={{ minWidth: '35%' }}
                        search={false}
                    />
                </View>
                <SelectList
                    setSelected={(val) => setSelectedLocation(val)}
                    data={locations}
                    save="value"
                    maxHeight={200}
                    placeholder='Elija el lugar'
                    boxStyles={{ marginVertical: 10 }}
                />
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                <RNDateTimePicker mode="date" value={new Date()} minimumDate={new Date()} />
                <RNDateTimePicker mode="time" value={new Date()} minimumDate={new Date()} />
            </View>
            <TextInput 
                style={styles.input}
                multiline={true} blurOnSubmit={true}
                onSubmitEditing={() => { Keyboard.dismiss() }}/>
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 30, alignContent: 'space-between' }}>
                <Button title="Cancelar" />
                <Button title="Crear" />
            </View>

        </View>
    )
}

export default NewEvent

const styles = StyleSheet.create({
    input: {
        height: '45%',
        margin: 12,
        borderWidth: 1,
        padding: 20,
        borderRadius: 4,
        fontSize: 20,
        marginTop: 30
    },
});