import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';

const CustomButton = ({ title, onPress, color, isLoading = false, enabled=true, filled=true }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: color?? COLORS.primary}]} disabled={isLoading}>
      {isLoading ? <ActivityIndicator size="small" color="white" style={{paddingRight: 10}} />:
      <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: '40%',
    alignSelf: 'stretch'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});