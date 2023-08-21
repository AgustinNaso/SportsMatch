import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React, { useEffect } from 'react'
import { Keyboard, StyleSheet, TextInput, Text, TouchableOpacity, View, Platform } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../components/CustomButton'
import { getCurrUserJWT, getCurrentUserData } from '../services/authService'
import { Controller, useForm } from 'react-hook-form'
import { EXPERTISE, SPORT } from '../constants/data'
import { COLORS } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { formatDate, formatTime, showDatepicker, showTimepicker } from '../utils/datetime'
//TODO: move to constants
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
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, watch } = useForm();



    useEffect(() => {
        getCurrentUserData().then((data) => {
            console.log("DATA: " + JSON.parse(data));
            setUser(JSON.parse(data));
        });
    }, []);


    const onSubmit = (data) => {
        console.log('AAA ' + JSON.stringify(data));
        // setIsLoading(!isLoading);
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
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Controller control={control} rules={{ required: true }} render={({ field }) => (
                        <SelectList
                            setSelected={field.onChange}
                            data={SPORT}
                            save="value"
                            maxHeight={200}
                            placeholder='Elija el deporte'
                            boxStyles={{ marginVertical: 10 }}
                            dropdownStyles={{ minWidth: '35%' }}
                            inputStyles={{ minWidth: '35%' }}
                            search={false}
                        />)}
                        name="sport" />
                    <Controller control={control} rules={{ required: true }} render={({ field }) => (
                        <SelectList
                            setSelected={field.onChange}
                            data={EXPERTISE}
                            save="value"
                            maxHeight={200}
                            placeholder='Elija la dificultad'
                            boxStyles={{ marginVertical: 10 }}
                            dropdownStyles={{ minWidth: '35%' }}
                            inputStyles={{ minWidth: '35%' }}
                            search={false}
                        />)}
                        name="difficulty" />
                </View>
                <Controller control={control} rules={{ required: true }} render={({ field }) => (
                    <SelectList
                        setSelected={field.onChange}
                        data={locations}
                        save="value"
                        maxHeight={200}
                        placeholder='Elija el lugar'
                        boxStyles={{ marginVertical: 10 }}
                    />)}
                    name="location" />
            </View>
            <View style={styles.dateSectionContainer}>
                <View style={styles.dateTimeLabelContainer}>
                    <Text style={styles.label}>Fecha</Text>
                    <Controller control={control} rules={{ required: true }} render={({ field }) => {
                        if(field.value === undefined) 
                            field.value = new Date();
                        console.log("FIELD VALUE: " + JSON.stringify(field.value))

                        return (
                        Platform.OS !== 'ios' ? (
                            <TouchableOpacity onPress={() => showDatepicker(field)} style={styles.dateTimeContainer}>
                                <Text>{formatDate(field.value)}</Text>
                            </TouchableOpacity>
                        )
                            :
                            <RNDateTimePicker value={new Date(field.value)} mode="date" onChange={(event, selecteDate) => field.onChange(selecteDate)} minimumDate={new Date()} />
                        )}} name="date" />
                </View>
                <View style={styles.dateTimeLabelContainer}>
                    <Text style={styles.label}>Hora</Text>
                    <Controller control={control} rules={{ required: false }} render={({ field }) => {
                        if (field.value === undefined)
                            field.value = new Date();
                        console.log("FIELD VALUE: " + field.value)
                        return (Platform.OS !== 'ios' ? (
                            <TouchableOpacity onPress={() => showTimepicker(field)} style={styles.dateTimeContainer}>
                                <Text>{formatTime(field.value)}</Text>
                            </TouchableOpacity>
                        ) :
                            <RNDateTimePicker value={field.value} mode="time" onChange={(event, selecteDate) => field.onChange(selecteDate)} minimumDate={new Date()} />

                        )
                    }} name="time" />
                </View>
            </View>
            <View style={styles.qtyInputContainer}>
                <Text style={styles.label}>Faltan</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.numberInput}
                            keyboardType="numeric"
                            placeholder="Enter the quantity of players"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="players"
                    defaultValue=""
                    rules={{
                        required: 'Quantity of players is required',
                        pattern: {
                            value: /^\d+$/,
                            message: 'Please enter a valid number',
                        },
                    }}
                />
                <Text style={styles.errorText}>{errors.players?.message}</Text>
            </View>
            <Controller control={control} rules={{ required: false }} render={({ field }) => (
                <TextInput
                    placeholder='Comentarios adicionales...'
                    value={field.value}
                    style={styles.input}
                    multiline={true} blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    onChangeText={field.onChange} />
            )}
                name="description" />
            <View style={styles.buttonContainer}>
                <CustomButton title={"Cancelar"} color='red' />
                <CustomButton title={isLoading ? "Creando" : "Crear"} color='green' isLoading={isLoading} onPress={handleSubmit(onSubmit)} />
            </View>
        </SafeAreaView>
    )
}

export default NewEvent

const styles = StyleSheet.create({
    input: {
        height: '25%',
        margin: 12,
        borderWidth: 1,
        padding: 20,
        borderRadius: 4,
        fontSize: 20,
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-around',
        width: '90%',
        alignSelf: 'center',
    },
    dateTimeContainer: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        minWidth: 140
    },
    dateSectionContainer: {
        flexDirection: 'row',
        width: '90%',
        minHeight: 28,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    dateTimeLabelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        marginRight: 10,
        marginBottom: 5,
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 600
    },
    qtyInputContainer: {
        marginBottom: 10,
        width: '90%', // Set the width of the input container
        alignSelf: 'center', // Center the input container horizontally
        padding: 10,
        alignItems: 'center'
    },
    numberInput: {
        height: 40,
        maxWidth: 120,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        marginTop: 5, // Add some space between the label and the input
    },
});