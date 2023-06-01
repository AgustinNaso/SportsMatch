import React from "react"
import { FlatList, ScrollView, View, SafeAreaView } from "react-native";
import TabNavigator from "../../TabNavigator";
import Card from "../../Components/Card/Card";
import Pill from "../../Components/Pill";


const mockData = [
    { key: 1, cardName: 'Card 1', sport: 'Futbol', time: '20:00hs' },
    { key: 2, cardName: 'Card 2', sport: 'Futbol', time: '20:00hs' },
    { key: 3, cardName: 'Card 3', sport: 'Futbol', time: '20:00hs' },
    { key: 4, cardName: 'Card 4', sport: 'Futbol', time: '20:00hs' },
    { key: 5, cardName: 'Card 5', sport: 'Futbol', time: '20:00hs' },
    { key: 6, cardName: 'Card 6', sport: 'Futbol', time: '20:00hs' },
    { key: 7, cardName: 'Card 6', sport: 'Futbol', time: '20:00hs' },
    { key: 8, cardName: 'Card 6', sport: 'Futbol', time: '20:00hs' },
    { key: 9, cardName: 'Card 6', sport: 'Futbol', time: '20:00hs' },
];

const filterData = [
    { key: 1, cardName: 'Card 1', sport: 'Futbol', time: '20:00hs' },
    { key: 2, cardName: 'Card 2', sport: 'Tenis', time: '20:00hs' },
    { key: 3, cardName: 'Card 3', sport: 'Basquet', time: '20:00hs' },
    { key: 4, cardName: 'Card 4', sport: 'Voley', time: '20:00hs' },
    { key: 5, cardName: 'Card 5', sport: 'Paddle', time: '20:00hs' },

];

const Home = () => {

    const renderItem = ({item}) => {
        return <Card props={item} />
    }

    const renderItemPill = ({item}) => {
        return <Pill props={item}/>
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList data={filterData} renderItem={renderItemPill}
             keyExtractor={(item) => {item.key}} horizontal showsHorizontalScrollIndicator={false}
             style={{flex: 1,paddingTop: 20, maxHeight: 60}}/>
            <FlatList
                data={mockData} renderItem={renderItem}
                style={{ flex: 1, paddingVertical: 20 }} keyExtractor={(item) => {item.key}}>
            </FlatList>
        </SafeAreaView>
    )
}

export default Home;