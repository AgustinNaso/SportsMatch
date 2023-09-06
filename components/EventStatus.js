import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const EventStatus = ({ status }) => {
    // Define styles based on the status code
    const getStatusStyle = () => {
        switch (status) {
            case 0: // Recruiting
                return styles.recruiting;
            case 1: // In Progress
                return styles.inProgress;
            case 2: // Finalized
                return styles.finalized;
            default:
                return styles.default;
        }
    };

    // Define status text based on the status code
    const getStatusText = () => {
        switch (status) {
            case 0:
                return "Convocando";
            case 1:
                return "En progreso";
            case 2:
                return "Finalizado";
            default:
                return "Unknown";
        }
    };

    return (
        <View style={[styles.container, getStatusStyle()]}>
            <Text style={{color: 'white'}}>{getStatusText()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 6,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        marginRight: 8
    },
    recruiting: {
        backgroundColor: COLORS.secondary, // Yellow with 50% transparency
    },
    inProgress: {
        backgroundColor: "rgba(42, 222, 130, 0.8)", // Green with 50% transparency
    },
    finalized: {
        backgroundColor: "rgba(255, 0, 0, 1 )", // Red with 50% transparency
    },
    default: {
        backgroundColor: "rgba(128, 128, 128, 0.5)", // Gray with 50% transparency
    },
});

export default EventStatus;
