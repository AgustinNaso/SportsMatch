import React, { useEffect } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  acceptParticipant,
  fetchUser,
  rateUser,
  removeParticipantAsOwner,
} from "../services/eventService";
import { AirbnbRating, Avatar, Button, color } from "@rneui/base";
import { COLORS } from "../constants";
import { EVENT_STATUS } from "../constants/data";
import DefaultProfile from "../assets/default-profile.png";
import { fetchUserImage } from "../services/userService";

const MyEventCard = ({ props, eventId, handleRemoveParticipant, eventStatus }) => {
  const currUser = { id: 1 };
  console.log("Props: ", props);
  const [userAccepted, setUserAccepted] = React.useState(
    props.participant_status
  );
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userRate, setUserRate] = React.useState(3);
  const [image, setImage] = React.useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetchUserImage(props.user_id);
      if (response.status == 200) {
        setImage(response.imageURL);
      }
    };
    try {
      fetchImage();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, []);

  const postUserRating = async () => {
    try {
      console.log("A " + eventId + " " + userRate + " " + props.user_id);
      await rateUser(eventId, userRate, props.user_id);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      //TODO: send user feedback of this error
    }
  };

  const acceptUser = async () => {
    try {
      await acceptParticipant(eventId, props.email);
      setUserAccepted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    Linking.openURL(
      `whatsapp://send?phone=${+props.phone_number}&text=Hola ${props.firstname
      }. Nos vemos en el partido!`
    );
  };

  const renderButton = () => {
    if (eventStatus !== EVENT_STATUS.FINALIZED)
      return <Button
        color={COLORS.primary}
        mode="contained"
        title="Contactar"
        onPress={sendMessage}
      />
    if (eventStatus === EVENT_STATUS.FINALIZED && props.is_rated === 0)
      return <Button
        color={COLORS.primary}
        mode="contained"
        title="Puntuar"
        onPress={() => setModalVisible(true)}
      />
    return <Text style={{fontSize: 18, fontWeight: 600}}>Calificado</Text>
  }

  return (
    <View style={styles.card}>
      {/* TODO: componenthize this Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Cómo fue jugar con este participante?
            </Text>
            <View style={{ marginBottom: 20 }}>
              <AirbnbRating
                size={30}
                reviewSize={25}
                reviews={["Muy malo", "Malo", "Normal", "Bueno", "Muy bueno"]}
                onFinishRating={setUserRate}
              />
            </View>
            <Button
              color={COLORS.primary}
              mode="contained"
              title="Enviar puntuación"
              onPress={postUserRating}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.userMetadataContainer}>
        <Avatar
          rounded
          size={62}
          source={image ? { uri: image } : DefaultProfile}
          containerStyle={{ backgroundColor: COLORS.secondary }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.userText}>{props.firstname}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginLeft: -6,
            }}
          >
            <Ionicons name="star" size={16} color={COLORS.secondary} />
            <Text style={styles.profileTextAge}> {Number(props.rating).toFixed(1)} / 5</Text>
          </View>
        </View>
      </View>
      {!userAccepted ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Ionicons
              name="close"
              size={40}
              color="red"
              onPress={() => handleRemoveParticipant(eventId, props.email)}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="checkmark"
              size={40}
              color="green"
              onPress={acceptUser}
            />
          </TouchableOpacity>
        </View>
      ) :
        renderButton()
      }
    </View>
  );
};

export default MyEventCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "85%",
    alignSelf: "center",
    height: 110,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  userMetadataContainer: {
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "65%",
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 8
  },
  buttonContainer: {
    flexDirection: "row",
    width: "35%",
    justifyContent: "space-between",
  },
  userText: {
    fontSize: 30,
    fontWeight: 600,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 20,
  },
  container: {
    flex: 1,
  },
  headingContainer: {
    paddingTop: 50,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    fontFamily: Platform.OS === "ios" ? "Menlo-Bold" : "",
    color: "#27ae60",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Trebuchet MS" : "",
    color: "#34495e",
  },
  viewContainer: {
    flex: 1,
  },
  rating: {
    paddingVertical: 10,
  },
});
