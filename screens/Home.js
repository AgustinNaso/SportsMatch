import React from "react"
import { FlatList, SafeAreaView } from "react-native";
import Card from "../components/Card";
import Pill from "../components/Pill";

const mockData = [
    { key: 1, name: 'Juan', sport: 'Futbol', time: '20:00hs' },
    { key: 2, name: 'Pedro', sport: 'Voley', time: '21:00hs' },
    { key: 3, name: 'Gaston', sport: 'Tenis', time: '10:00hs' },
    { key: 4, name: 'Brittany', sport: 'Futbol', time: '22:00hs' },
    { key: 5, name: 'Agustin', sport: 'Tenis', time: '08:00hs' },
    { key: 6, name: 'John', sport: 'Futbol', time: '11:00hs' },
    { key: 7, name: 'Esteban', sport: 'Tenis', time: '20:00hs' },
    { key: 8, name: 'Juana', sport: 'Basquet', time: '21:00hs' },
    { key: 9, name: 'Marta', sport: 'Basquet', time: '22:00hs' },
];

const filterData = [
    { key: 1, cardName: 'Card 1', sport: 'Futbol', time: '20:00hs' },
    { key: 2, cardName: 'Card 2', sport: 'Tenis', time: '20:00hs' },
    { key: 3, cardName: 'Card 3', sport: 'Basquet', time: '20:00hs' },
    { key: 4, cardName: 'Card 4', sport: 'Voley', time: '20:00hs' },
    { key: 5, cardName: 'Card 5', sport: 'Paddle', time: '20:00hs' },

];

const Home = () => {
    const [eventsList, setEventList] = React.useState(mockData)
    const [selectedFilter, setSelectedFilter] = React.useState("");

    React.useEffect(() => {
        console.log("Selected Filter: " + selectedFilter)
    })

    const renderItem = ({ item }) => {
        return <Card props={item} />
    }

    const renderItemPill = ({ item }) => {
        return <Pill props={item} handlePress={handleFilter} currentFilter={selectedFilter} />
    }

    const handleFilter = (sport) => {
        if (selectedFilter == sport) {
            console.log("ACA")
            setSelectedFilter("")
            setEventList(mockData)
        }
        else {
            setSelectedFilter(sport)
            setEventList(mockData.filter(e => e.sport == sport))
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, maxHeight: '100%' }}>
            <FlatList data={filterData} renderItem={renderItemPill}
                keyExtractor={(item) => { item.key }} horizontal showsHorizontalScrollIndicator={false}
                style={{ flex: 1, paddingTop: 20, paddingBottom: 10, maxHeight: 70 }} />
            <FlatList
                data={eventsList} renderItem={renderItem}
                style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
            </FlatList>
        </SafeAreaView>
    )
}

export default Home;