import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { View } from 'react-native';
import EventStatus from './EventStatus';
import { Divider } from '@rneui/base';
import MyEventCard from './MyEventCard';
import { EXPERTISE, SPORT } from '../constants/data';
import { getDateComponents } from '../utils/datetime';
import { removeParticipantAsOwner } from '../services/eventService';

const MyEventList = ({ data }) => {
    const [participantList, setParticipantsList] = useState(data.item.participants);
    const handleRemoveParticipant = async (eventId, participantEmail) => {
        try {
            removeParticipantAsOwner(eventId, participantEmail)
            console.log("Removing participant: ", participantEmail, " from event: ", eventId);
            setParticipantsList(participantList.filter((participant) => participant.email !== participantEmail));
        } catch (error) {
            console.log(error)
        }
    }

    const { hours, day, month, minutes } = getDateComponents(data.item.schedule);


    return (
        <View style={{marginTop: 8}}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 10, marginVertical: 8, gap: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{ fontSize: 22, fontWeight: 600, marginLeft: 10 }}>{SPORT[data.item.sport_id - 1]} en {data.item.location}</Text>
                    <EventStatus status={data.item.event_status} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#828282'}}>{EXPERTISE[data.item.expertise - 1]}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#828282'}}>{`${day}/${month} ${hours}:${minutes} hs`}</Text>
                </View>
            </View>
            <Divider width={3} style={{ width: '90%', marginBottom: 10, alignSelf: 'center' }} />
            <FlatList
                data={participantList} renderItem={(listData) => renderItem(listData.item, data.item.event_id, handleRemoveParticipant)}
                style={{ flex: 1 }} keyExtractor={(item, index) => { return `${item.userid} + ${index} + ${item.event_id}}` }}
                ListEmptyComponent={<Text style={{ fontSize: 20, alignSelf: 'center', marginVertical: 8 }}>Aún no hay participantes</Text>}
            >
            </FlatList>
            {/* <Divider width={3} style={{ width: '90%', marginTop: 10, alignSelf: 'center' }} /> */}
        </View>
    )
}


const renderItem = (data, eventId, handleRemoveParticipant) => {
    return <MyEventCard props={data} eventId={eventId} handleRemoveParticipant={handleRemoveParticipant} />
}
export default MyEventList;