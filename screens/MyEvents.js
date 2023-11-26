import React, { useContext, useEffect } from "react";
import { SafeAreaView, FlatList, View, StyleSheet } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Card from "../components/Card";
import {
  fetchJoinedEvents,
  fetchMyEvents,
} from "../services/eventService";
import { COLORS } from "../constants";
import { useIsFocused } from "@react-navigation/native";
import MyEventList from "../components/MyEventList";
import { NoContentMessage } from "../components/NoContentMessage";
import { UserContext } from "../contexts/UserContext";

const renderList = (data) => {
  return <MyEventList data={data} />;
};

const renderJoinedItem = ({ item }) => {
  return <Card props={item} />;
};

const FirstRoute = (myEvents) => (
  <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      data={myEvents}
      renderItem={(data) => renderList(data)}
      style={{ flex: 1 }}
      contentContainerStyle={ myEvents.length != 0 ? {flexGrow: 1} : styles.noContentContainer}
      keyExtractor={(item, index) => {
        return `${index}`;
      }}
      ListEmptyComponent={<NoContentMessage message={"Aún no creaste ningún evento"}/>}
    ></FlatList>
  </SafeAreaView>
);

const SecondRoute = (joinedEvents) => (
  <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      data={joinedEvents}
      renderItem={renderJoinedItem}
      style={{ flex: 1 }}
      contentContainerStyle={
        joinedEvents.length != 0 ? styles.contentContainer : styles.noContentContainer}
      keyExtractor={(item, index) => `${item.event_id}-${index}`}
      ListEmptyComponent={renderEmptyList}
    ></FlatList>
  </SafeAreaView>
);

const renderEmptyList = () => {
  return (
    <NoContentMessage message={"Aún no te anotaste a ningún evento"}/>
  );
};

const MyEvents = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Creados" },
    { key: "second", title: "Anotado" },
  ]);
  const {currUser } = useContext(UserContext);
  const [myEvents, setMyEvents] = React.useState([]);
  const [joinedEvents, setJoinedEvents] = React.useState([]);
  const isFocused = useIsFocused();

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return FirstRoute(myEvents);
      case "second":
        return SecondRoute(joinedEvents);
      default:
        return null;
    }
  };

  useEffect(() => {
    const getMyEvents = async () => {
      const data = await fetchMyEvents(currUser.userid);
      setMyEvents(data.items);
    };

    const getJoinedEvents = async () => {
      const mockData = await fetchJoinedEvents(currUser.userid);
      setJoinedEvents(mockData.items);
    };
    if (currUser && isFocused) {
      getMyEvents().catch((err) => console.log(err));
      getJoinedEvents().catch((err) => console.log(err));
    }
  }, [isFocused]);

  return (
    <TabView
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={{ backgroundColor: COLORS.primary }}
          indicatorStyle={{ backgroundColor: COLORS.secondary }}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: 100 }}
    />
  );
};

export default MyEvents;

const styles = StyleSheet.create({
  noContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer : {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
    paddingTop: 8,
  }
});
