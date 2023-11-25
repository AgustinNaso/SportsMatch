import React, { useEffect } from 'react'
import { Keyboard, StyleSheet, TextInput, Text, TouchableOpacity, View, Platform, Modal, Pressable } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../components/CustomButton'
import { Controller, useForm } from 'react-hook-form'
import { EXPERTISE, LOCATIONS, SPORT } from '../constants/data'
import { COLORS } from '../constants'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { formatDate, formatTime, showDatepicker, showTimepicker } from '../utils/datetime'
import { fetchUser, publishEvent } from '../services/eventService'
import { useNavigation } from '@react-navigation/native'
import Pill from '../components/Pill'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import CustomDropdown from '../components/CustomDropdown'
import { getCurrentUserData } from '../services/LocalStorageService'


const NewEvent = () => {
    const navigation = useNavigation();
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [customPlayerQty, setCustomPlayerQty] = React.useState('+');
    const eventDuration = ['60', '90', '120'];
    const playersQty = ['1','2','3', customPlayerQty];


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
        const { sport, difficulty, location, date, time, description, players, duration } = formData;
        // setIsLoading(!isLoading);
        const data = {
            sportId: SPORT.indexOf(sport) + 1,
            expertise: EXPERTISE.indexOf(difficulty) + 1,
            location: location,
            schedule: dateTimeToDate(date, time),
            description: description ?? " ",
            remaining: +players,
            duration: +duration
        }
        try {
            setIsLoading(true);
            await publishEvent(data);
            setIsLoading(false);
            navigation.goBack();
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <SafeAreaView style={{...styles.centeredView, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: COLORS.primary10}}>
             <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <Pressable
              style={styles.centeredView}
              onPress={(e) =>
                e.target == e.currentTarget && setModalVisible(false)
              }
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  ¿Cuantos jugadores faltan?
                </Text>
                <TextInput style={{width: 50, backgroundColor: COLORS.primary10, borderColor: COLORS.primary, borderWidth: 1, borderRadius: 4}}
                textAlign='center' autoFocus={true}
                 keyboardType='number-pad' onChangeText={(text) => setCustomPlayerQty(text)}/>
                <CustomButton
                  title="Guardar"
                  onPress={() => {
                    setValue('players', customPlayerQty);
                    setModalVisible(false);
                }}
                />
              </View>
            </Pressable>
          </Modal>
            <View style={{ flex: 1, alignSelf: 'stretch'}}>
                <View style={{flexDirection: 'row',  justifyContent: 'center', width: '100%', flex: 1}}>
                    <Controller control={control} rules={{ required: true }} render={({ field }) => (                        
                        <CustomDropdown
                         selected={field.value}
                         setSelected={field.onChange}
                         data={SPORT}
                         label="Deporte"
                         />
                    )}
                        name="sport" /> 
                    <Controller control={control} rules={{ required: true }} render={({ field }) => (
                        <CustomDropdown
                        selected={field.value}
                        setSelected={field.onChange}
                        data={EXPERTISE}
                        label="Nivel"
                        />
                        )}
                        name="difficulty" />
                </View>
                <Controller control={control} rules={{ required: true }} render={({ field }) => (
                    <CustomDropdown
                    selected={field.value}
                    setSelected={field.onChange}
                    data={LOCATIONS}
                    label="Lugar"
                    search={true}
                    />
                    )}
                    name="location" />
            </View>
            <View style={styles.dateSectionContainer}>
                <View style={styles.dateTimeLabelContainer}>
                    <Text style={styles.label}>Fecha</Text>
                    <Controller control={control} rules={{ required: true }} render={({ field }) => {
                        if (field.value === undefined)
                            field.value = new Date();
                        return (
                            Platform.OS !== 'ios' ? (
                                <TouchableOpacity onPress={() => showDatepicker(field)} style={styles.dateTimeContainer}>
                                    <Text style={{textAlign: 'center'}}>{formatDate(field.value)}</Text>
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
                        return (Platform.OS !== 'ios' ? (
                            <TouchableOpacity onPress={() => showTimepicker(field)} style={styles.dateTimeContainer}>
                                <Text style={{textAlign: 'center'}}>{formatTime(field.value)}</Text>
                            </TouchableOpacity>
                        ) :
                            <RNDateTimePicker value={field.value} mode="time" onChange={(event, selecteDate) => field.onChange(selecteDate)} minimumDate={new Date()} />
                        )
                    }} name="time" />
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.qtyInputContainer}>
                    <Text style={styles.label}>Faltan</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    playersQty.map((qty, index) => {
                                        return <Pill key={index} props={{ title: qty}} handlePress={
                                            index != playersQty.length - 1 ? onChange : () => setModalVisible(true)}
                                            currentFilter={value} />
                                    })
                                )
                            }
                        }
                        name = "players"/>
                        </View>
                </View>
                <View style={{ ...styles.qtyInputContainer}}>
                    <Text style={styles.label}>Duración (min)</Text>
                    <View style={{flexDirection: 'row', maxWidth: '80%', alignItems: 'center'}}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    eventDuration.map((duration, index) => {
                                        return <Pill key={index} props={{ title: duration}} handlePress={onChange} currentFilter={value} />
                                    })
                                )
                            }
                        }
                        name = "duration"/>
                    </View>
                </View>
            </View>
            <Controller control={control} rules={{ required: false }} render={({ field }) => (
                <TextInput
                    placeholder='El partido es en el club a las ...'
                    value={field.value}
                    style={styles.input}
                    multiline={true} blurOnSubmit={true}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    onChangeText={field.onChange} />
            )}
                name="description" />
            <CustomButton title="Crear" isLoading={isLoading} onPress={handleSubmit(onSubmit)} />
        </SafeAreaView>
    )
}


export default NewEvent

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    input: {
        height: '20%',
        alignSelf:'stretch',
        paddingHorizontal: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 18,
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
        minWidth: 140,
    },
    dateSectionContainer: {
        flexDirection: 'row',
        minHeight: 28,
        alignSelf: 'center',
        marginTop: 10,
        gap: 20
    },
    dateTimeLabelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        marginBottom: 10,
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 600
    },
    qtyInputContainer: {
        alignSelf: 'center', // Center the input container horizontally
        padding: 10,
        alignItems: 'center',
    },
    numberInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 16,
        paddingHorizontal: 5,
        marginTop: 5, // Add some space between the label and the input
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalView: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 36,
        paddingVertical: 24,
        alignItems: "center",
        flexDirection: 'column',
        gap: 14,
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
      },
        modalText: {
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.primary,
        },
});