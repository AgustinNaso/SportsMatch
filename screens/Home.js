import React from "react"
import { ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import Card from "../components/Card";
import Pill from "../components/Pill";
import { fetchNearEvents } from "../services/eventService";
import { COLORS } from "../constants";

const filterData = [
    { key: 1, cardName: 'Card 1', sport: 'Futbol', time: '20:00hs' },
    { key: 2, cardName: 'Card 2', sport: 'Tenis', time: '20:00hs' },
    { key: 3, cardName: 'Card 3', sport: 'Basquet', time: '20:00hs' },
    { key: 4, cardName: 'Card 4', sport: 'Voley', time: '20:00hs' },
    { key: 5, cardName: 'Card 5', sport: 'Paddle', time: '20:00hs' },

];

const Home = () => {
    const [eventsList, setEventList] = React.useState(null);
    const [filteredEventsList, setFilteredEventList] = React.useState(null);
    const [selectedFilter, setSelectedFilter] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const getNearEvents = async () => {
            const mockData = await fetchNearEvents();
            mockData.json().then(data => {
                setEventList(data);
                setFilteredEventList(data);
                setLoading(false);
            });
        }
        console.log('asda');
        getNearEvents()
            .catch(err => console.log(err));

    }, [])

    const renderItem = ({ item }) => {
        return <Card props={item} />
    }

    const renderItemPill = ({ item }) => {
        return <Pill props={item} handlePress={handleFilter} currentFilter={selectedFilter} />
    }

    const handleFilter = (sport) => {
        if (selectedFilter == sport) {
            setSelectedFilter("")
            setFilteredEventList(eventsList)
        }
        else {
            setSelectedFilter(sport)
            setFilteredEventList(eventsList.filter(e => e.sport == sport))
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, maxHeight: '100%' }}>
            <FlatList data={filterData} renderItem={renderItemPill}
                keyExtractor={(item) => { item.key }} horizontal showsHorizontalScrollIndicator={false}
                style={{ flex: 1, paddingTop: 20, paddingBottom: 10, maxHeight: 70 }} />
            {loading ? <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ alignSelf: "center", marginTop: "50%" }}
            /> :
                <FlatList
                    data={filteredEventsList} renderItem={renderItem}
                    style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
                </FlatList>
            }
        </SafeAreaView>
    )
}

export default Home;