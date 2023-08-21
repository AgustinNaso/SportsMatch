import { useCardAnimation } from "@react-navigation/stack";
import React from "react";
import { View, Text, Button, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { SelectList } from "react-native-dropdown-select-list";
import { EXPERTISE } from "../constants/data";



const FilterModal = ({ navigation }) => {

    const LOCATIONS = ["Mis ubicaciones", "Almagro", "Balvanera", "Villa Crespo", "Villa Soldati", "Devoto", "Belgrano"]

    const { height } = useWindowDimensions();
    const { current } = useCardAnimation();
    const { control, handleSubmit, formState: { errors }, watch } = useForm();


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
                        <Controller control={control} rules={{ required: true }} render={({ field }) => (
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
                            />)}
                            name="location" />
                    </View>
                    <View style={styles.section}>
                        <Text>Nivel de juego: </Text>
                        <Controller control={control} rules={{ required: true }} render={({ field }) => (
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
                            />)}
                            name="expertise" />
                    </View>
                    <Button
                        style={{ marginTop: 40 }}
                        mode="contained"
                        onPress={navigation.goBack}
                        title="Guardar">
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
    }
});


export default FilterModal;