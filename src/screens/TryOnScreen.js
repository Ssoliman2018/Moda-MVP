import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import {  ToggleButton } from "react-native-paper";
// import GarmentModal from "../components/GarmentModal";
import GarmentModal from '../components/GarmentModal';

const TryOnScreen = () => {
  const handleModelUpload = () => {};
  const [value, setValue] = useState("left");
    const [modalVisible, setModalVisible] = useState(false);
      const handleGarmentUpload = () => {
        // Open the modal
        setModalVisible(true);
      };

      const closeModal = () => {
        // Close the modal
        setModalVisible(false);
      };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#F5F5F5",
        }}
      >
        <View style={styles.uploadContainer}>
          <View style={styles.uploadBox}>
            <TouchableOpacity onPress={handleModelUpload} style={styles.button}>
              <Ionicons name="person-add-outline" size={28} color="#000000" />
              {/* <Image
              source={require("../assets/image-placeholder.png")} // Placeholder image path
              style={styles.placeholderImage}
            /> */}
              <Text style={styles.placeholderText}>
                Input Model will be displayed here.
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.label}>Please upload or select a model:</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Filter model</Text>
        </TouchableOpacity> */}
        </View>

        <View style={styles.uploadContainer}>
          <View style={styles.uploadBox}>
            <TouchableOpacity
              onPress={handleGarmentUpload}
              style={styles.button}
            >
              <Ionicons name="add-circle-outline" size={28} color="#000000" />
              <Text style={styles.placeholderText}>
                Input Garment will be displayed here.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <View
          style={{
            width: 200,
            height: 300,
            borderWidth: 1,
            borderColor: "#C4C4C4",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity onPress={handleGarmentUpload} style={styles.button}>
            <Ionicons name="add-circle-outline" size={28} color="#000000" />
            <Text style={styles.placeholderText}>
              Input Garment will be displayed here.
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.label}>Please upload or select a garment:</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Please select a garment type</Text>
        </TouchableOpacity> */}
      </View>
      {/* Modal */}
      <GarmentModal
            {...{
              modalVisible,
              closeModal,
            }}
          />
          
      {/* <GarmentModal closeModal={closeModal} modalVisible={modalVisible}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  uploadContainer: {
    alignItems: "center",
    flex: 1,
    // marginHorizontal: 4,
  },
  uploadBox: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 12,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default TryOnScreen;
