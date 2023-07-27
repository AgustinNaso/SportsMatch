import React, { useEffect } from 'react';
import { Text, SafeAreaView, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Card from '../components/Card';
import MyEventCard from '../components/MyEventCard';
import { fetchJoinedEvents, fetchMyEvents, fetchNearEvents } from '../services/eventService';

const renderList = ({ item }) => {
    return (
        <>
            <Text style={{ fontSize: 35, fontWeight: 600, marginLeft: 10, marginVertical: 10 }}>{item.eventName}</Text>
            <FlatList
                data={item.myEvent} renderItem={renderItem}
                style={{ flex: 1 }} keyExtractor={(item) => item.key.toString()}>
            </FlatList>
        </>
    )
}

const renderItem = ({ item }) => {
    return <MyEventCard userData={item} />

}

const renderJoinedItem = ({ item }) => {
    return <Card props={item} />
}

const mockData = [
    { key: 1, name: 'Pedro', sport: 'Futbol', time: "12 20:00hs" },
    { key: 2, name: 'Juan', sport: 'Basquet', time: "12 16:00hs" },
];

const createdEventMockData = [
    {
        myEvent: [
            { key: 1, name: 'Gaston', sport: 'Futbol', expertise: 'Principiante', time: '20:00hs' },
            { key: 2, name: 'John', sport: 'Futbol', expertise: 'Intermedio', time: '20:00hs' },
        ],
        eventName: "Partido 1",
        key: 1,
        time: '20:00hs'
    },
    {
        myEvent:
            [
                { key: 1, name: 'Gaston', sport: 'Futbol', expertise: 'Principiante', time: '20:00hs' },
                { key: 2, name: 'John', sport: 'Futbol', expertise: 'Intermedio', time: '20:00hs' },
                { key: 3, name: 'Brittany', sport: 'Futbol', expertise: 'Intermedio', time: '20:00hs' },
                { key: 4, name: 'Agustin', sport: 'Futbol', expertise: 'Avanzado', time: '20:00hs' },
            ],
        eventName: "Partido 2",
        key: 2,
        time: '20:00hs'
    }
];


const FirstRoute = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={createdEventMockData} renderItem={renderList}
            style={{ flex: 1 }} keyExtractor={(item) => { 
                console.log(item.key);
                return item.key }}>
        </FlatList>
    </SafeAreaView>
);

const SecondRoute = (myEvents) => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={myEvents} renderItem={renderJoinedItem}
            style={{ flex: 1 }} keyExtractor={(item) => { item.event_id }}>
        </FlatList>
    </SafeAreaView>
);



const MyEvents = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Creados' },
        { key: 'second', title: 'Anotado' },
    ]);
    const [myEvents, setMyEvents] = React.useState([]);

    const renderScene = ({ route }) => {
        switch (route.key) {
          case 'first':
            return FirstRoute();
          case 'second':
            return myEvents.length > 0 ? SecondRoute(myEvents) : null
          default:
            return null;
        }
      };

    useEffect(() => {
        const getNearEvents = async () => {
            const mockData = await fetchMyEvents();
            mockData.json().then(data => {
                console.log(data);
                setMyEvents(data);
            });
        }
        getNearEvents()
            .catch(err => console.log(err));
    }, [])

    return (
        <TabView
            renderTabBar={(props) => <TabBar {...props} style={{ backgroundColor: 'grey' }} />}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: 100 }}
        />
    );
}

export default MyEvents;