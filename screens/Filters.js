import { useCardAnimation } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Animated, useWindowDimensions, Platform, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import { EXPERTISE } from "../constants/data";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, showDatepicker } from "../utils/datetime";
import { Chip } from "@rneui/themed";
import { COLORS } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";



const FilterModal = ({ navigation }) => {

    const LOCATIONS = ["Mis ubicaciones", "Almagro", "Balvanera", "Villa Crespo", "Villa Soldati", "Devoto", "Belgrano"]
    const HORARIOS = ["Mañana", "Tarde", "Noche"]
    const STORAGE_KEY = 'selectedChips';
    const { height } = useWindowDimensions();
    const { current } = useCardAnimation();
    const { currFilters, setCurrentFilters } = useState({ location: null, expertise: null, date: null, time: null })
    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        navigation.navigate("Inicio", { filters: JSON.stringify(data) });
        try {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving filter data:', error);
        }

    }

    useEffect(() => {
        const loadFilterData = async () => {
            try {
                const storedFormValues = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedFormValues !== null) {
                    const formValues = JSON.parse(storedFormValues);
                    Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
                        console.log("Field name: " + fieldName + " Field value: " + fieldValue)
                        if (fieldValue !== undefined) {
                            if(fieldName === "date"){
                                fieldValue = new Date(fieldValue);
                            }
                            setValue(fieldName, fieldValue);
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading filter data:', error);
            }
        };

        loadFilterData();
    }, []);

    const cleanFilters = () => {
        setValue("location", 'Elija una ubicacion');
        setValue("expertise", 'Elija el nivel');
        setValue("date", null);
        setValue("time", []);
        AsyncStorage.removeItem(STORAGE_KEY);
    }


    const selectedChips = getValues('selectedChips') || [];

    const toggleChipSelection = async (index, selectedChips, onChange) => {
        const isSelected = selectedChips.includes(index);
        const newSelectedChips = isSelected
            ? selectedChips.filter((chipIdx) => chipIdx !== index)
            : [...selectedChips, index];
        onChange(newSelectedChips);
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Animated.View
                style={[
                    {
                        height: height,
                        transform: [
                            {
                                translateY: current.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [height, height * 0.15],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                    styles.viewAnimated,
                ]}>
                <View style={styles.viewContainer}>
                    <Text style={[styles.bigText, { alignSelf: 'center' }]}>
                        Filtros de busqueda
                    </Text>
                    <View style={styles.section}>
                        <Text>Ubicacion: </Text>
                        <Controller control={control} rules={{ required: false }} render={({ field }) => {
                            return (
                                <SelectList
                                    setSelected={field.onChange}
                                    data={LOCATIONS}
                                    save="value"
                                    maxHeight={200}
                                    placeholder='Elija la ubicacion'
                                    boxStyles={{ marginVertical: 10 }}
                                    dropdownStyles={{ minWidth: '35%' }}
                                    inputStyles={{ minWidth: '35%' }}
                                    search={false}
                                    defaultOption={{ key: field.value, value: field.value }}
                                />)
                        }}
                            name="location" />
                    </View>
                    <View style={styles.section}>
                        <Text>Nivel de juego: </Text>
                        <Controller control={control} rules={{ required: false }} render={({ field }) => (
                            <SelectList
                                setSelected={field.onChange}
                                data={EXPERTISE}
                                save="value"
                                maxHeight={200}
                                placeholder='Elija el nivel'
                                boxStyles={{ marginVertical: 10 }}
                                dropdownStyles={{ minWidth: '35%' }}
                                inputStyles={{ minWidth: '35%' }}
                                search={false}
                                defaultOption={{ key: field.value, value: field.value }}
                            />)}
                            name="expertise" />
                    </View>
                    <View>
                        <Text>Fecha:</Text>
                        <Controller control={control} rules={{ required: false }} render={({ field }) => {
                            if (!field.value)
                                field.value = new Date();
                            return (
                                Platform.OS === 'ios' ?
                                    <RNDateTimePicker mode="date"
                                        style={{ alignSelf: 'flex-start' }}
                                        onChange={(event, selectedDate) => field.onChange(selectedDate)}
                                        value={field.value} minimumDate={new Date()} />
                                    :
                                    <TouchableOpacity onPress={() => showDatepicker(field)} style={styles.dateTimeContainer}>
                                        <Text>{formatDate(field.value)}</Text>
                                    </TouchableOpacity>

                            )
                        }} name="date" />
                    </View>
                    <View>
                        <Text>Horario:</Text>
                        <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', marginVertical: 8 }}>
                            <Controller control={control} rules={{ required: false }} defaultValue={[]} render={({ field }) =>
                            (
                                HORARIOS.map((horario, idx) => {
                                    const isSelected = field.value.includes(idx)
                                    return (
                                        <Chip title={horario} key={idx} color={COLORS.primary} type={isSelected ? 'solid' : 'outline'} onPress={() => toggleChipSelection(idx, field.value, field.onChange)} />
                                    )
                                })
                            )
                            }
                                name="time" />
                        </View>

                    </View>
                    <Button
                        color={'red'}
                        mode="contained"
                        onPress={navigation.goBack}
                        title="Cancelar">
                    </Button>
                    <Button
                        color={COLORS.primary}
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        title="Guardar">
                    </Button>
                    <Button
                        color={COLORS.primary}
                        mode="contained"
                        onPress={cleanFilters}
                        title="Limpiar">
                    </Button>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewAnimated: {
        width: '100%',
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#E5E5E5',
        borderRadius: 20,
    },
    bigText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateTimeContainer: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        minWidth: '35%',
        borderColor: '#aeaeae',
        borderWidth: 1,
    },
});


export default FilterModal;