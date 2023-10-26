import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { EVENT_STATUS, EXPERTISE, SPORT, USER_STATUS } from "../constants/data";
import {
  fetchEventById,
  fetchParticipants,
  joinNewEvent,
  removeParticipant,
} from "../services/eventService";
import { getCurrentUserData } from "../services/authService";
import { Avatar, Divider } from "@rneui/themed";
import { COLORS } from "../constants";
import { MONTHS } from "../constants/data";
import { getDateComponents } from "../utils/datetime";
import { fetchUserImage } from "../services/userService";
import DefaultProfile from "../assets/default-profile.png";

const Event = ({ route }) => {
  const { props } = route.params;
  const [eventParticipants, setEventParticipants] = useState([]);
  const [userStatus, setUserStatus] = useState(USER_STATUS.UNENROLLED);
  const [user, setUser] = useState(null);
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
    getCurrentUserData()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.log("Error getting current user ", err));
  }, []);

  useEffect(() => {
    eventParticipants.forEach((participant) => {
      if (participant.user_id == user.user_id) {
        if (participant.participant_status === true) {
          setUserStatus(USER_STATUS.ENROLLED);
        } else {
          setUserStatus(USER_STATUS.REQUESTING);
        }
      }
    });
  }, [eventParticipants, user]);

  const quitEvent = async () => {
    try {
      const res = await removeParticipant(props.event_id);
      setUserStatus(USER_STATUS.UNENROLLED);
    } catch (error) {
      console.log("Error quitting event. ", error);
    }
  };

  const joinEvent = async () => {
    try {
      await joinNewEvent(props.event_id, user?.user_id);
      setUserStatus(USER_STATUS.REQUESTING);
    } catch (error) {
      console.log(error);
    }
  };

  const renderParticipantStatusMessage = () => {
    if (props.event_status === EVENT_STATUS.FINALIZED)
      return (
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 700,
            alignSelf: "center",
          }}
        >
          Evento finalizado!
        </Text>
      );
    switch (userStatus) {
      case USER_STATUS.UNENROLLED:
        return null;
      case USER_STATUS.REQUESTING:
        return (
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              alignSelf: "center",
            }}
          >
            Esperando confirmación del creador del evento
          </Text>
        );
      case USER_STATUS.ENROLLED:
        return (
          <Text style={{ fontSize: 20, fontWeight: 700, alignSelf: "center" }}>
            Ya estás anotado al evento!
          </Text>
        );
    }
  };

  const renderEventButton = () => {
    if (props.event_status === EVENT_STATUS.FINALIZED) return null;
    switch (userStatus) {
      case USER_STATUS.UNENROLLED:
        return (
          <CustomButton title={"Anotarme"} color="green" onPress={joinEvent} />
        );
      case USER_STATUS.REQUESTING:
      case USER_STATUS.ENROLLED:
        return (
          <CustomButton
            title={"Desanotarme"}
            color={"red"}
            onPress={quitEvent}
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
          size={100}
          source={image ? { uri: image } : DefaultProfile}
          containerStyle={{ backgroundColor: COLORS.secondary }}
        />
        <View style={styles.headerData}>
          <Text style={styles.bigText}>{props.owner_firstname}</Text>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Ionicons name="star" size={18} color={COLORS.secondary} />
            <Text>
              {" "}
              {props.rating / (props.rate_count !== 0 ? props.rate_count : 1)} /
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
      <Divider width={4} style={{ width: "90%", marginBottom: 8 }} />
      <View style={styles.eventBody}>
        <View style={styles.bodySection}>
          <Text style={styles.bodyBigText}>Fecha:</Text>
          <Text style={styles.bodyMidText}>{`${day} de ${
            MONTHS[month - 1]
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
          <View style={{ width: 150 }}>
            <ScrollView>
              <Text style={styles.bodyMidText}>{props.description}</Text>
            </ScrollView>
          </View>
        </View>
        <Divider width={1} />
        {renderParticipantStatusMessage()}
      </View>
      <View style={{ alignSelf: "center" }}>{renderEventButton()}</View>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  bodySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: 130,
  },
  eventContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  eventHeader: {
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    width: "100%",
  },

  headerData: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 8,
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
    height: "55%",
    width: "100%",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },

  participantsContainer: {
    height: "35%",
  },
});
