import React, { useEffect } from 'react';
import { Text, SafeAreaView, FlatList, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Card from '../components/Card';
import MyEventCard from '../components/MyEventCard';
import { fetchJoinedEvents, fetchMyEvents, fetchNearEvents, fetchUser, removeParticipant } from '../services/eventService';
import { getCurrentUserData } from '../services/authService';
import { COLORS } from '../constants';
import { useIsFocused } from '@react-navigation/native';
import { Chip, Divider } from '@rneui/base';
import EventStatus from '../components/EventStatus';
import MyEventList from '../components/MyEventList';

const renderList = (data) => {
    return <MyEventList data={data} />
}

const renderJoinedItem = ({ item }) => {
    return <Card props={item} />
}

const FirstRoute = (myEvents) => (

    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={myEvents} renderItem={(data) => renderList(data)}
            style={{ flex: 1 }} keyExtractor={(item, index) => {
                return `${index}`
            }}>
        </FlatList>
    </SafeAreaView>
);

const SecondRoute = (joinedEvents) => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={joinedEvents} renderItem={renderJoinedItem}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }} keyExtractor={(item, index) => `${item.event_id}-${index}`}
            ListEmptyComponent={renderEmptyList}>
        </FlatList>
    </SafeAreaView>
);

const renderEmptyList = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', height: '100%'}}>
            <Text style={{ fontSize: 20, alignSelf: 'center' }}>No hay partidos por jugar</Text>
        </View>
    )
}

const MyEvents = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Creados' },
        { key: 'second', title: 'Anotado' },
    ]);
    const [myEvents, setMyEvents] = React.useState([]);
    const [joinedEvents, setJoinedEvents] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const isFocused = useIsFocused();

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return myEvents.length > 0 ? FirstRoute(myEvents) : null
            case 'second':
                return SecondRoute(joinedEvents)
            default:
                return null;
        }
    };

    useEffect(() => {
        getCurrentUserData().then((data) => {
            setUser(data);
        });

    }, [])

    useEffect(() => {
        const getMyEvents = async () => {
            const userData = await fetchUser(user.email);
            const data = await fetchMyEvents(userData.user_id);
            setMyEvents(data.items);
        }
        const getNearEvents = async () => {
            const userData = await fetchUser(user.email);
            const mockData = await fetchJoinedEvents(userData?.user_id);
            setJoinedEvents(mockData.items);
        }
        if (isFocused) {
            getMyEvents().catch(err => console.log(err));
            getNearEvents()
                .catch(err => console.log(err));
        }
    }, [user, isFocused]);

    return (
        <TabView
            renderTabBar={(props) => <TabBar {...props} style={{ backgroundColor: COLORS.primary }} indicatorStyle={{ backgroundColor: COLORS.secondary }} />}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: 100 }}
        />
    );
}

export default MyEvents;