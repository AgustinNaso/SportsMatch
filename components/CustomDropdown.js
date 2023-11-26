import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '../constants';


const CustomDropdown = ({data, selected,setSelected, name, showLabel = true, search = false}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
      <View style={styles.container}>
        {showLabel && <Text style={styles.label}>{name}</Text>}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={{fontSize: 14}}
          iconStyle={styles.iconStyle}
          data={data.map((item) => ({ label: item, value: item }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? `Seleccione ${name}`  : '...'}
          value={selected}
          search={search}
          searchPlaceholder='Buscar...'
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelected(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  export default CustomDropdown;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 6,
      paddingVertical: 12,
      minWidth: '50%',
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      width: '100%',
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: COLORS.primary10,
      left: 24,
      top: 4,
      zIndex: 999,
      paddingHorizontal: 4,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 14,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 14,
    },
  });