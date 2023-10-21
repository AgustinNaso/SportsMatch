import React from "react"
import { ActivityIndicator, FlatList, SafeAreaView, RefreshControl, Modal, View, Text, Pressable } from "react-native";
import Card from "../components/Card";
import Pill from "../components/Pill";
import { fetchNearEvents } from "../services/eventService";
import { COLORS } from "../constants";
import { StatusBar } from "expo-status-bar";
import { SPORT } from "../constants/data";
import { StyleSheet } from "react-native";
const filterData = [
    { key: 1, sportId: 1, sport: SPORT[0] },
    { key: 2, sportId: 2, sport: SPORT[1] },
    { key: 3, sportId: 3, sport: SPORT[2] },
    { key: 4, sportId: 4, sport: SPORT[3] },
    { key: 5, sportId: 5, sport: SPORT[4] },

];

const Home = ({ navigation, route }) => {
    const [eventsList, setEventList] = React.useState(null);
    const [filteredEventsList, setFilteredEventList] = React.useState(null);
    const [selectedFilter, setSelectedFilter] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [showFilters, setShowFilters] = React.useState(false);

    React.useEffect(() => {
        console.log("Rerender " + route.params?.filters)
        const getNearEvents = async () => {
            const mockData = await fetchNearEvents(JSON.parse(route.params?.filters));
            setEventList(mockData.items);
            setFilteredEventList(mockData.items);
            setLoading(false);
        }
        getNearEvents()
            .catch(err => console.log(err));

    }, [route.params?.filters])

    React.useEffect(() => {
        const getNearEvents = async () => {
            const data = await fetchNearEvents();
            setEventList(data.items);
            setFilteredEventList(data.items);
            setLoading(false);
        }
        getNearEvents()
            .catch(err => console.log(err));
    }, [])


    const renderItem = ({ item }) => {
        return <Card props={item} />
    }

    const renderItemPill = ({ item }) => {
        return <Pill props={item} handlePress={handleFilter} currentFilter={selectedFilter} />
    }

    const renderEmptyList = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay partidos disponibles</Text>
            </View>
        );
    };

    const handleFilter = (sport) => {
        if (selectedFilter == sport) {
            setSelectedFilter("")
            setFilteredEventList(eventsList)
        }
        else {
            setSelectedFilter(sport)
            //TODO: FIX this should be done in the backend
            setFilteredEventList(eventsList.filter(e => SPORT[e.sport_id - 1] == sport))
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const jsonData = await fetchNearEvents();
            setEventList(jsonData.items);
            setFilteredEventList(jsonData.items);
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, maxHeight: '100%' }}>
            <StatusBar />
            <FlatList data={filterData} renderItem={renderItemPill}
                keyExtractor={(item) => { return item.key.toString() }} horizontal showsHorizontalScrollIndicator={false}
                style={{ flex: 1, paddingTop: 20, paddingBottom: 10, maxHeight: 70 }} />
            {loading ? <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ alignSelf: "center", marginTop: "50%" }}
            /> :
                <FlatList
                    data={filteredEventsList} renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    style={{ flex: 1 }} keyExtractor={(item) => { return item.event_id.toString() }}
                    ListEmptyComponent={renderEmptyList}>
                </FlatList>
            }
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});