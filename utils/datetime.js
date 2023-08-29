import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

//DATETIME PICKER UTILS
const formatTime = (date) => {
    return date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
}

const formatDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
};

const showMode = (currentMode, field) => {
    let currentDate = new Date();
    DateTimePickerAndroid.open({
        value: field.value !== undefined ? field.value : currentDate,
        onChange: (event, selectedDate) => {
            field.onChange(selectedDate)
        },
        mode: currentMode,
        is24Hour: true,
        minuteInterval: 15,
        minimumDate: currentDate,
        display: currentMode === 'date' ? 'calendar' : 'spinner',

    });
};

const showDatepicker = (field) => {
    showMode('date', field);
};

const showTimepicker = (field) => {
    showMode('time', field);
};

export { formatTime, formatDate, showDatepicker, showTimepicker }