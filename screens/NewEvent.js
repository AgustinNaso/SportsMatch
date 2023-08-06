import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React, { useEffect } from 'react'
import { Keyboard, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../components/CustomButton'
import { getCurrUserJWT, getCurrentUserData } from '../services/authService'


const SPORT = ['Futbol', 'Basquet', 'Paddle', 'Voley', 'Tenis', 'Ping Pong']
const EXPERTISE = ['Principiante', 'Intermedio', 'Avanzado', 'Profesional']

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

    //TODO: migrate to react-hook-form
    const [selectedSport, setSelectedSport] = React.useState("");
    const [selectedDifficulty, setSelectedDifficulty] = React.useState("");
    const [selectedLocation, setSelectedLocation] = React.useState("");
    const [date, setDate] = React.useState(new Date());
    const [time, setTime] = React.useState(new Date());
    const [user, setUser] = React.useState(null);
    const [description, setDescription] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        getCurrentUserData().then((data) => {
            console.log("DATA: " + JSON.parse(data));
            setUser(JSON.parse(data));
        });
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    //TODO: move to utils
    const formatDate = (date, time) => {
        // Convert the input string to a Date object
        const parsedDate = new Date(date);
        const parsedTime = new Date(time);

        // Extract the date components
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedTime.getHours()).padStart(2, '0');
        const minutes = String(parsedTime.getMinutes()).padStart(2, '0');
        const seconds = String(parsedTime.getSeconds()).padStart(2, '0');

        // Construct the desired format "YYYY-MM-DD HH:mm:ss"
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    };

    //TODO: this should be deprecated when using react-hook-form
    const updateDate = e => {
        setDate(e.nativeEvent.timestamp)
    }

    const updateTime = e => {
        setTime(e.nativeEvent.timestamp)
    }

    const setText = e => {
        setDescription(e.nativeEvent.text);

    }
    const createEvent = () => {
        setIsLoading(!isLoading);
        // console.log("Sport: " + `${SPORT.indexOf(selectedSport) + 1}`)
        // console.log("Difficulty: " + `${EXPERTISE.indexOf(selectedDifficulty) + 1}`)
        // console.log("Location: " + selectedLocation)
        // console.log("Date: " + formatDate(date, time));
        // console.log("USE aR" + JSON.stringify(user));
        // const data = {
        //     sportId: `${SPORT.indexOf(selectedSport) + 1}`,
        //     expertise: `${EXPERTISE.indexOf(selectedDifficulty) + 1}`,
        //     location: selectedLocation,
        //     time: formatDate(date, time),
        //     description: description,
        //     userId: user.uid,
        //     remaining: 4
        // }
        // publishEvent(data).then((data) => {
        //     data.json().then(data => {
        //         console.log(data);
        //     }
        //     )
        // }).catch(err => console.log(err));
    }


    return (
        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SelectList
                        setSelected={(val) => setSelectedSport(val)}
                        data={SPORT}
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
                        data={EXPERTISE}
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
                <TouchableOpacity onPress={showDatepicker}>
                    <Text>{date.toLocaleString()}</Text>
                </TouchableOpacity>
                {/* <RNDateTimePicker mode="date" value={new Date(date)} minimumDate={new Date()} onChange={updateDate} />
                <RNDateTimePicker mode="time" value={new Date(time)} minimumDate={new Date()} onChange={updateTime} /> */}
            </View>
            <TextInput
                style={styles.input}
                multiline={true} blurOnSubmit={true}
                onSubmitEditing={() => { Keyboard.dismiss() }}
                onChange={setText} />
            <View style={styles.buttonContainer}>
                <CustomButton title={"Cancelar"} color='red' />
                <CustomButton title={isLoading ? "Creando" : "Crear"} color='green' isLoading={isLoading} onPress={createEvent} />
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
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-around',
        width: '90%',
        alignSelf: 'center',
    }
});