import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { EVENT_STATUS, EXPERTISE, SPORT, USER_STATUS } from "../constants/data";
import {
  fetchParticipants,
  joinNewEvent,
  removeParticipant,
} from "../services/eventService";
import { Avatar, Divider } from "@rneui/themed";
import { COLORS } from "../constants";
import { MONTHS } from "../constants/data";
import { getDateComponents } from "../utils/datetime";
import { fetchUserImage } from "../services/userService";
import DefaultProfile from "../assets/default-profile.png";
import { UserContext } from "../contexts/UserContext";

const Event = ({ route }) => {
  const { props } = route.params;
  const [loading, setLoading] = useState(false);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [userStatus, setUserStatus] = useState(USER_STATUS.UNENROLLED);
  const { currUser, setCurrUser } = useContext(UserContext);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetchUserImage(props.owner_id);
      if (response.status == 200) {
        setImage(response.imageURL);
      }
    };
    try {
      fetchImage();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
    fetchParticipants(props.event_id).then((data) => {
      setEventParticipants(data);
    });
  }, []);

  useEffect(() => {
    eventParticipants.forEach((participant) => {
      if (participant.user_id == currUser.userid) {
        if (participant.participant_status === true) {
          setUserStatus(USER_STATUS.ENROLLED);
        } else {
          setUserStatus(USER_STATUS.REQUESTING);
        }
      }
    });
  }, [eventParticipants, currUser]);

  const quitEvent = async () => {
    try {
      const res = await removeParticipant(props.event_id);
      setUserStatus(USER_STATUS.UNENROLLED);
    } catch (error) {
      console.log("Error quitting event. ", error);
    }
  };

  const joinEvent = async () => {
    console.log("Joining event", currUser);
    try {
      setLoading(true);
      await joinNewEvent(props.event_id, currUser.userid);
      setUserStatus(USER_STATUS.REQUESTING);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const renderParticipantStatusMessage = () => {
    if (props.event_status === EVENT_STATUS.FINALIZED)
      return (
        <Text style={styles.participantStatusText}>
          Evento finalizado!
        </Text>
      );
    switch (userStatus) {
      case USER_STATUS.UNENROLLED:
        return null;
      case USER_STATUS.REQUESTING:
        return (
          <Text style={styles.participantStatusText}>
            Esperando confirmación del creador del evento
          </Text>
        );
      case USER_STATUS.ENROLLED:
        return (
          <Text style={styles.participantStatusText}>
            Ya estás anotado al evento!
          </Text>
        );
    }
  };

  const renderEventButton = (loading) => {
    if (props.event_status === EVENT_STATUS.FINALIZED) return null;
    switch (userStatus) {
      case USER_STATUS.UNENROLLED:
        return (
          <CustomButton
            title={"Anotarme"} 
            onPress={joinEvent}
            isLoading={loading} />
        );
      case USER_STATUS.REQUESTING:
      case USER_STATUS.ENROLLED:
        return (
          <CustomButton
            title={"Desanotarme"}
            color={"red"}
            onPress={quitEvent}
            isLoading={loading}
          />
        );
    }
  };

  const { day, month, hours, minutes } = getDateComponents(props?.schedule);

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventHeader}>
        <Avatar
          rounded
          size={110}
          source={image ? { uri: image } : DefaultProfile}
          containerStyle={{ backgroundColor: COLORS.secondary }}
        />
        <View style={styles.headerData}>
          <Text style={styles.bigText}>{props.owner_firstname}</Text>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Ionicons name="star" size={18} color={COLORS.secondary} />
            <Text>
              {" "}
              {Number(props.rating).toFixed(1)} /
              5{" "}
            </Text>
            <Text>
              {" "}
              | {props.rate_count}{" "}
              {props.rate_count !== 1 ? "partidos" : "partido"}
            </Text>
          </View>
          <Text style={{ ...styles.mediumText, alignSelf: "center" }}>
            {" "}
            {SPORT[props.sport_id - 1]}
          </Text>
        </View>
      </View>
      <Divider width={4} style={{ width: "100%", marginBottom: -24}} />
      <View style={styles.eventBody}>
        <View style={styles.bodySection}>
          <Text style={styles.bodyBigText}>Fecha:</Text>
          <Text style={styles.bodyMidText}>{`${day} de ${MONTHS[month - 1]
            } ${hours}:${minutes} hs`}</Text>
        </View>
        <Divider width={1} />
        <View style={styles.bodySection}>
          <Text style={styles.bodyBigText}>Nivel:</Text>
          <Text style={styles.bodyMidText}>
            {EXPERTISE[props.expertise - 1]}
          </Text>
        </View>
        <Divider width={1} />
        <View style={styles.bodySection}>
          <Text style={styles.bodyBigText}>Ubicacion:</Text>
          <Text style={styles.bodyMidText}>{props.location}</Text>
        </View>
        <Divider width={1} />
        <View style={{ ...styles.bodySection }}>
          <Text style={styles.bodyBigText}>Descripcion:</Text>
          <View style={{ width: 160 }}>
            <ScrollView style={{maxHeight: 110}}>
              <Text style={styles.bodyMidText}>{props.description}</Text>
            </ScrollView>
          </View>
        </View>
        <Divider width={1} />
        {renderParticipantStatusMessage()}
      </View>
      <View style={{ alignSelf: "stretch" }}>{renderEventButton(loading)}</View>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  bodySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24
  },
  eventContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-evenly'
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
  },

  headerData: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  bigText: {
    fontSize: 36,
    fontWeight: "bold",
    alignSelf: "center",
  },

  mediumText: {
    fontSize: 18,
  },

  bodyBigText: {
    fontSize: 25,
    fontWeight: "bold",
    marginRight: 16,
  },

  bodyMidText: {
    fontSize: 18,
    paddingTop: 4,
  },

  eventBody: {
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "space-evenly",
  },

  participantStatusText: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 16,
    textAlign: 'center'
  },
});
