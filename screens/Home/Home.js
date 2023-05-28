import React from "react"
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import TabNavigator from "../../TabNavigator";

const Home = () => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home</Text>
        </SafeAreaView>
    )
}

export default Home;