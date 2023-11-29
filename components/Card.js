import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EXPERTISE, SPORT, MONTHS, EVENT_STATUS } from "../constants/data";
import { COLORS, FONTS } from "../constants";
import { Avatar } from "@rneui/themed";
import { getDateComponents } from "../utils/datetime";
import { AirbnbRating, Button } from "@rneui/base";
import { rateUser } from "../services/eventService";
import DefaultProfile from "../assets/default-profile.png";
import { fetchUserImage } from "../services/userService";
import CustomButton from "./CustomButton";

const Card = ({ props }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userRate, setUserRate] = React.useState(3);
  const [loading, setLoading] = React.useState(true);

  const handlePress = () => {
    navigation.navigate("Evento", { props: props });
  };

  const postUserRating = async () => {
    try {
      await rateUser(props.event_id, userRate, props.owner_id);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      //TODO: send user feedback of this error
    }
  };
  const { day, month, hours, minutes } = getDateComponents(props?.schedule);

  const [image, setImage] = React.useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetchUserImage(props.owner_id);
      if (response.status == 200) {
        setImage(response.imageURL);
      }
      setLoading(false);
    };
    try {
      fetchImage();
    } catch (err) {
      console.error("ERROR fetching user data", err);
    }
  }, []);

  const renderRating = () => {
    return (
      <AirbnbRating
        size={30}
        reviewSize={25}
        reviews={[
          "Muy malo",
          "Malo",
          "Normal",
          "Bueno",
          "Muy bueno",
        ]}
        onFinishRating={setUserRate}
      />);
  }

  return (
    <>
      {!loading && (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Pressable
              style={styles.centeredView}
              onPress={(e) =>
                e.target == e.currentTarget && setModalVisible(false)
              }
            >
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  ¿Cómo fue jugar con este participante?
                </Text>
                <View style={{ marginBottom: 20 }}>
                  {renderRating()}
                </View>
                <CustomButton
                  title="Enviar puntuación"
                  onPress={postUserRating}
                />
              </View>
            </Pressable>
          </Modal>
          <View style={styles.section}>
            <View style={styles.userSection}>
              <Avatar
                rounded
                size={100}
                source={image ? { uri: image } : DefaultProfile}
                containerStyle={{ backgroundColor: COLORS.secondary }}
              />
              <Text style={styles.cardMidText}>{props.owner_firstname}</Text>
            </View>
            <View style={styles.verticalSection}>
              <View>
              <Text style={styles.cardBigText}>
                {SPORT[props.sport_id - 1]}
              </Text>
              <Text style={[FONTS.body2, {fontWeight: 700, color: COLORS.darkgray}]}>
                {EXPERTISE[props.expertise]}
              </Text>
              </View>
              {props.event_status === EVENT_STATUS.FINALIZED ? (
                props.is_rated === 0 ? (
                  <Text style={{ ...styles.cardMidText, marginBottom: 2 }}>
                    Finalizado
                  </Text>
                ) : (
                  <View style={{width: '80%'}}>
                    <CustomButton
                      title="Puntuar"
                      onPress={() => setModalVisible(true)}
                    />
                  </View>
                )
              ) : (
                <Text style={{ ...styles.cardMidText, marginBottom: 2 }}>
                  {props.remaining > 0
                    ? "Faltan: " + props.remaining
                    : "Completo"}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.bottomSection}>
            <Text style={[styles.cardSmText, { color: COLORS.white }]}>
              {day} de {MONTHS[month - 1]} {hours}:{minutes} hs
            </Text>
            <Text style={[styles.cardSmText, { color: COLORS.white }]}>
              {props.location}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "100%",
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: "column",
    padding: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
    maxHeight: 180,
    minHeight: 180,
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: COLORS.white,
  },

  userSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    },

  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    margin: -10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardBigText: {
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.primary,
  },
  cardMidText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardSmText: {
    fontSize: 14,
    fontWeight: 500,
  },
  section: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verticalSection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-between',
    paddingVertical: 6,
    maxWidth: '45%',
    height: '100%',
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
});

export default Card;
