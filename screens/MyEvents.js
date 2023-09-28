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

const renderList = (data, handleRemoveParticipant) => {
    //Adding event id and event status for using it inside MyEventCard api call
    for (let i = 0; i < data.item.participants?.length; i++) {
        data.item.participants[i].event_id = data.item.event_id;
        data.item.participants[i].eventStatus = data.item.event_status
    }

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10, marginVertical: 10 }}>Partido {data.item.event_id} {data.item.location}</Text>
                <EventStatus status={data.item.event_status} />
            </View>
            <Divider width={3} style={{ width: '90%', marginBottom: 10, alignSelf: 'center' }} />
            <FlatList
                data={data.item.participants} renderItem={(listData) => renderItem(listData.item, handleRemoveParticipant)}
                style={{ flex: 1 }} keyExtractor={(item, index) => { return `${item.userid} + ${index} + ${item.event_id}}` }}
                ListEmptyComponent={<Text style={{ fontSize: 20, alignSelf: 'center' }}>Aún no hay participantes</Text>}
            >
            </FlatList>
        </>
    )
}

const renderItem = (data, handleRemoveParticipant) => {
    return <MyEventCard props={data} onDelete={handleRemoveParticipant} />
}

const renderJoinedItem = ({ item }) => {
    return <Card props={item} />
}

const FirstRoute = (myEvents, handleRemoveParticipant) => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={myEvents} renderItem={(data) => renderList(data, handleRemoveParticipant)}
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
            style={{ flex: 1 }} keyExtractor={(item, index) => `${item.event_id}-${index}`}>
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
    const [joinedEvents, setJoinedEvents] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const isFocused = useIsFocused();

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return myEvents.length > 0 ? FirstRoute(myEvents) : null
            case 'second':
                return joinedEvents.length > 0 ? SecondRoute(joinedEvents) : null
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
            setMyEvents(data.items)
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
    }, [user, isFocused])

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