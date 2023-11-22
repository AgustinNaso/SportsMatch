import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Modal,
  View,
  Text,
  Pressable,
} from "react-native";
import Card from "../components/Card";
import Pill from "../components/Pill";
import { fetchNearEvents, fetchUser } from "../services/eventService";
import { COLORS } from "../constants";
import { SPORT } from "../constants/data";
import { StyleSheet } from "react-native";
import { getCurrentUserData } from "../services/authService";
import { NoContentMessage } from "../components/NoContentMessage";

const filterData = [
  { key: 1, sportId: 1, sport: SPORT[0] },
  { key: 2, sportId: 2, sport: SPORT[1] },
  { key: 3, sportId: 3, sport: SPORT[2] },
  { key: 4, sportId: 4, sport: SPORT[3] },
  { key: 5, sportId: 5, sport: SPORT[4] },
];

const Home = ({ navigation, route }) => {
  const [user, setUser] = useState();
  const [eventsList, setEventList] = useState(null);
  const [filteredEventsList, setFilteredEventList] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCurrentUserData().then(async (userData) => {
      setUser(userData);
    });
  }, []);

  useEffect(() => {
    console.log("Rerender " + route.params?.filters);
    const getNearEvents = async () => {
      const mockData = await fetchNearEvents(user.user_id, JSON.parse(route.params?.filters));
      setEventList(mockData.items);
      setFilteredEventList(mockData.items);
      setLoading(false);
    };
    getNearEvents().catch((err) => console.log(err));
  }, [route.params?.filters]);

  useEffect(() => {
    const getNearEvents = async () => {
      const data = await fetchNearEvents(user.user_id);
      setEventList(data.items);
      setFilteredEventList(data.items);
      setLoading(false);
    };
    if (user) {
      getNearEvents().catch((err) => console.log(err));
    }
  }, [user]);

  const renderItem = ({ item }) => {
    return <Card props={item} />;
  };

  const renderItemPill = ({ item }) => {
    item.title = item.sport;
    return (
      <Pill
        props={item}
        handlePress={handleFilter}
        currentFilter={selectedFilter}
      />
    );
  };

  const renderEmptyList = () => {
    return (<>
        <NoContentMessage message="No hay eventos disponibles en este momento."/>
        <View style={{height: 40}}/>
    </>
    );
  };

  const handleFilter = (sport) => {
    if (selectedFilter == sport) {
      setSelectedFilter("");
      setFilteredEventList(eventsList);
    } else {
      setSelectedFilter(sport);
      //TODO: FIX this should be done in the backend
      setFilteredEventList(
        eventsList.filter((e) => SPORT[e.sport_id - 1] == sport)
      );
    }
  };

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
  };

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <FlatList
        data={filterData}
        renderItem={renderItemPill}
        keyExtractor={(item) => {
          return item.key.toString();
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, paddingTop: 20, paddingBottom: 10, maxHeight: 70 }}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ alignSelf: "center", marginTop: "50%" }}
        />
      ) : (
        <FlatList
          data={filteredEventsList}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8}}
          keyExtractor={(item) => {
            return item.event_id.toString();
          }}
          ListEmptyComponent={renderEmptyList}
        ></FlatList>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
  }
});
