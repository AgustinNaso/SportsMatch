import React from 'react';
import { View, SafeAreaView, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Card from '../Components/Card/Card';

const renderItem = ({ item }) => {
    return <Card props={item} />
}


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


const FirstRoute = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={mockData} renderItem={renderItem}
            style={{ flex: 1 }} keyExtractor={(item) => { item.key }}>
        </FlatList>
    </SafeAreaView>
);

const SecondRoute = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={mockData} renderItem={renderItem}
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
        { key: 'first', title: 'Created' },
        { key: 'second', title: 'Joined' },
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

export default MyEvents