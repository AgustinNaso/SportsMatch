import React from 'react';
import { Text, SafeAreaView, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Card from '../components/Card';
import MyEventCard from '../components/MyEventCard';

const renderList = ({ item }) => {
    return (
        <>
        <Text style={{fontSize: 35, fontWeight: 600, marginLeft: 10, marginVertical: 10}}>{item.eventName}</Text>
        <FlatList
            data={item.myEvent} renderItem={renderItem}
            style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
        </FlatList>
        </>
    )
}

const renderItem = ({ item }) => {
    return  <MyEventCard userData={item} />

}

const renderJoinedItem = ({ item }) => {
    return <Card props={item} />
}

const mockData = [
    { key: 1, name: 'Pedro', sport: 'Futbol', time: '20:00hs' },
    { key: 2, name: 'Juan', sport: 'Basquet', time: '16:00hs' },
];

const createdEventMockData = [
    {
        myEvent : [
            { key: 1, name: 'Gaston', sport: 'Futbol', expertise: 'Principiante' },
            { key: 2, name: 'John', sport: 'Futbol', expertise: 'Intermedio' },
        ],
        eventName : "Partido 1",
        key : 1
    },
    {
        myEvent: 
            [
                { key: 1, name: 'Gaston', sport: 'Futbol',expertise: 'Principiante' },
                { key: 2, name: 'John', sport: 'Futbol',expertise: 'Intermedio' },
                { key: 3, name: 'Brittany', sport: 'Futbol',expertise: 'Intermedio' },
                { key: 4, name: 'Agustin', sport: 'Futbol',expertise: 'Avanzado' },
            ],
            eventName : "Partido 2",
            key : 2
    }
];


const FirstRoute = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={createdEventMockData} renderItem={renderList}
            style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
        </FlatList>
    </SafeAreaView>
);

const SecondRoute = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={mockData} renderItem={renderJoinedItem}
            style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
        </FlatList>
    </SafeAreaView>
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

const MyEvents = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Creados' },
        { key: 'second', title: 'Anotado' },
    ]);

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