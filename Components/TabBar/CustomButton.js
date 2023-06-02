import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: color}]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    maxWidth: '80%',
    minWidth: '40%'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});