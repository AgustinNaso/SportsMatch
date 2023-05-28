import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <Button onPress={()=> navigation.navigate("Home")} title="Login"/>

    </SafeAreaView>
  )
}

export default Login;