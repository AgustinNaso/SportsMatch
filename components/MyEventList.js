import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { View } from 'react-native';
import EventStatus from './EventStatus';
import { Divider } from '@rneui/base';
import MyEventCard from './MyEventCard';

const MyEventList = ({data}) => {
    console.log(data.item);
    const [participantes, setParticipantsList] = useState(data.item.participants);

    const handleRemoveParticipant = async (eventId, participantEmail) => {
        try {
            // removeParticipantAsOwner(eventId, participantEmail)
            console.log(participantes);
            setParticipantsList(participantes.filter((participant) => participant.email !== participantEmail));

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10, marginVertical: 10 }}>Partido {data.item.event_id} {data.item.location}</Text>
                <EventStatus status={data.item.event_status} />
            </View>
            <Divider width={3} style={{ width: '90%', marginBottom: 10, alignSelf: 'center' }} />
            <FlatList
                data={participantes} renderItem={(listData) => renderItem(listData.item, data.item.event_id, handleRemoveParticipant)}
                style={{ flex: 1 }} keyExtractor={(item, index) => { return `${item.userid} + ${index} + ${item.event_id}}` }}
                ListEmptyComponent={<Text style={{ fontSize: 20, alignSelf: 'center' }}>Aún no hay participantes</Text>}
            >
            </FlatList>
        </>
    )
}


const renderItem = (data, eventId, handleRemoveParticipant) => {
    return <MyEventCard props={data} eventId={eventId} handleRemoveParticipant={handleRemoveParticipant}/>
}
export default MyEventList;