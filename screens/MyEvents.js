import React, { useEffect } from 'react';
import { Text, SafeAreaView, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Card from '../components/Card';
import MyEventCard from '../components/MyEventCard';
import { fetchJoinedEvents, fetchMyEvents, fetchNearEvents } from '../services/eventService';
import { getCurrentUserData } from '../services/authService';

const renderList = ({ item }) => {

    //Adding event id for using it inside MyEventCard api call
    for( let i = 0 ; i < item.participants.length; i++)
        item.participants[i].event_id = item.event_id;
    
    return (
        <>
            <Text style={{ fontSize: 35, fontWeight: 600, marginLeft: 10, marginVertical: 10 }}>Partido {item.event_id} {item.location}</Text>
            <FlatList
                data={item.participants} renderItem={renderItem}
                style={{ flex: 1 }} keyExtractor={(item, index) => {return `${item.userid} + ${index} + ${item.event_id}}`}}
                ListEmptyComponent={<Text style={{fontSize: 20, alignSelf: 'center'}}>Aún no hay participantes</Text>}
                >
            </FlatList>
        </>
    )
}

const renderItem = ({ item }) => {
    return <MyEventCard userData={item}/>

}

const renderJoinedItem = ({ item }) => {
    return <Card props={item} />
}

const FirstRoute = (myEvents) => (
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={myEvents} renderItem={renderList}
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

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return  myEvents.length > 0 ?  FirstRoute(myEvents) : null
            case 'second':
                return joinedEvents.length > 0 ? SecondRoute(joinedEvents) : null
            default:
                return null;
        }
    };

    useEffect(() => {
        getCurrentUserData().then((data) => {
            setUser(JSON.parse(data));
        });

    }, [])

    useEffect(() => {
        const getMyEvents = async () => {
            const data = await fetchMyEvents(user.uid);
            setMyEvents(data)
        }
        getMyEvents().catch(err => console.log(err));

        const getNearEvents = async () => {
            const mockData = await fetchJoinedEvents(user.uid);
            mockData.json().then(data => {
                console.log('JOINED ' + JSON.stringify(data))
                setJoinedEvents(data);
            });
        }
        getNearEvents()
            .catch(err => console.log(err));
    }, [user])

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