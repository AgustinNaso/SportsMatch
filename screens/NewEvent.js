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
import { fetchUser, publishEvent } from '../services/eventService'
import { useNavigation } from '@react-navigation/native'
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
    { key: 10, value: "Colegiales", },
];

const NewEvent = () => {
    const navigation = useNavigation();
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, watch } = useForm();


    const dateTimeToDate = (date, time) => {
        //Months are 0 indexed
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`
    }

    useEffect(() => {
        getCurrentUserData().then((data) => {
            setUser(data);
        });
    }, []);


    const onSubmit = async (formData) => {
        const { sport, difficulty, location, date, time, description, players } = formData;
        const userD = await getCurrentUserData();
        console.log("USERD: ", userD);
        const userData = await fetchUser(userD.email)
        console.log("date:", date, "time:", time, "datetime: ", dateTimeToDate(date, time))
        // setIsLoading(!isLoading);
        const data = {
            sport_id: SPORT.indexOf(sport) + 1,
            expertise: EXPERTISE.indexOf(difficulty) + 1,
            location: location,
            schedule: dateTimeToDate(date, time),
            description: description,
            owner_id: userData.user_id,
            remaining: +players,
            duration: +formData.duration
        }
        console.log("FORMD: ", data);
        try {
            publishEvent(data);
            navigation.goBack();
        }
        catch (err) {
            console.log(err);
        }
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
                        if (field.value === undefined)
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
                        )
                    }} name="date" />
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
            <View style={styles.inputsContainer}>
                <View style={styles.qtyInputContainer}>
                    <Text style={styles.label}>Faltan</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.numberInput}
                                keyboardType="numeric"
                                placeholder="Cantidad de jugadores"
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
                                message: 'Por favor ingrese un número válido',
                            },
                        }}
                    />
                    <Text style={styles.errorText}>{errors.duration?.message}</Text>
                </View>
                <View style={styles.qtyInputContainer}>
                    <Text style={styles.label}>Duración</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.numberInput}
                                keyboardType="numeric"
                                placeholder="Duracion del partido"
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="duration"
                        defaultValue=""
                        rules={{
                            required: 'La duración del evento es requerida',
                            pattern: {
                                value: /^\d+$/,
                                message: 'Por favor ingrese un número válido',
                            },
                        }}
                    />
                    <Text style={styles.errorText}>{errors.players?.message}</Text>
                </View>
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
                <CustomButton title={"Cancelar"} color='red' onPress={navigation.goBack} />
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
        alignSelf: 'center', // Center the input container horizontally
        padding: 10,
        alignItems: 'center',
    },
    numberInput: {
        height: 40,
        maxWidth: 140,
        minWidth: 140,
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 16,
        paddingHorizontal: 5,
        marginTop: 5, // Add some space between the label and the input
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
});