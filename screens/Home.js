import React from "react"
import { ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import Card from "../components/Card";
import Pill from "../components/Pill";
import { fetchNearEvents } from "../services/eventService";
import { COLORS } from "../constants";

const SPORT = ['Futbol', 'Basquet', 'Paddle', 'Voley', 'Tenis','Ping Pong']


const filterData = [
    { key: 1, sportId: 1, sport: SPORT[0] },
    { key: 2, sportId: 2, sport: SPORT[1] },
    { key: 3, sportId: 3, sport: SPORT[2] },
    { key: 4, sportId: 4, sport: SPORT[3] },
    { key: 5, sportId: 5, sport: SPORT[4] },

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
            console.log(sport)
            //TODO: FIX esto
            setFilteredEventList(eventsList.filter(e => SPORT[e.sport_id - 1] == sport))
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