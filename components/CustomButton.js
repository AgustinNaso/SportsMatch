import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const CustomButton = ({ title, onPress, color, isLoading = false }) => {
  console.log(isLoading);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: color}]} disabled={isLoading}>
      {isLoading && <ActivityIndicator size="small" color="white" style={{paddingRight: 10}} />}
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