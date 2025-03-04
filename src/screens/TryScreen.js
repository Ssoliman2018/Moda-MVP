import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedImage,
  selectImage,
  undoLastTryOn,
} from "../features/userImages/userImagesSlice";
import { ActivityIndicator, Button, Card, MD2Colors } from "react-native-paper";
import { fetchUserImages } from "../features/userImages/userImagesThunks";
import ClothingSlider from "../components/ClothingSlider";

const TryScreen = ({ navigation }) => {
  const [scale, setScale] = useState(1); // Scale for zooming

  const userImage = useSelector((state) => state.imagePicker.imageUri);
  const [loadingResult, setloadingResult] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isColthModalVisible, setClothModalVisible] = useState(false);

  const { images, loadingImages, errorImages, selectedImage } = useSelector(
    (state) => state.userImages
  );
  const { loading, resultImageUrls, error } = useSelector(
    (state) => state.tryOn
  );

  const dispatch = useDispatch();
  useEffect(() => {
    setClothModalVisible(false);
    console.log("tryon loading ..", loading);
    setloadingResult(loading);
  }, [loading, dispatch]);
  useEffect(() => {
    if (resultImageUrls?.[0]) {
      dispatch(selectImage(resultImageUrls[0]));
    } else {
      dispatch(selectImage(images[0]))
    }
  }, [resultImageUrls, dispatch]);

  useEffect(() => {
    // Fetch user images when the component mounts
    dispatch(fetchUserImages());
  }, [dispatch]);

  const openUserImages = () => {
    setModalVisible(true);
  };

  console.log("images user ..", images);
  console.log("tryon Result ..", resultImageUrls);

  const selectModelImage = (item) => {
    dispatch(clearSelectedImage());
    dispatch(selectImage(item));
    setModalVisible(false);
  };

  console.log("selected image >>", selectedImage);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size={"large"}
          animating={true}
          color={MD2Colors.red800}
          style={
            (styles.loadingIndicator)
          }
        />
      )}

      {/* Edit Image Button */}
      <TouchableOpacity style={styles.editButton} onPress={openUserImages}>
        <Ionicons name="create-outline" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Model Image (Full-Screen) */}
      <Image
        source={{ uri: selectedImage ? selectedImage : images[0] }}
        style={[styles.modelImage, { transform: [{ scale }] }]}
        resizeMode="contain"
      />

      {/* undo button  */}
      <TouchableOpacity
        style={styles.zoomButtonLeft}
        onPress={() => dispatch(undoLastTryOn())} // Prevents too much zoom out
      >
        <Ionicons name="remove-circle-outline" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.zoomButtonRight}
        onPress={() => setClothModalVisible(true)} // Prevents too much zoom in
      >
        <Ionicons name="add-circle-outline" size={40} color="white" />
      </TouchableOpacity>

      {/* user images modal  */}
      <Modal
        visible={isModalVisible}
        presentationStyle={"pageSheet"}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#F8F8F8",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#3E055D",
              }}
            >
              My Models
            </Text>
          </View>
          <FlatList
            data={images}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            numColumns={2} // Set number of columns
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }} // Optional: Style for spacing between columns
            renderItem={({ item }) => (
              <View style={{ width: 180, marginRight: 4 }}>
                {loadingImages ? (
                  <ActivityIndicator
                    size={"large"}
                    animating={true}
                    color={MD2Colors.red800}
                    style={styles.loadingIndicator}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => selectModelImage(item)}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{ height: 240, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
      </Modal>

      {/* Garment Images Modal */}
      <Modal
        visible={isColthModalVisible}
        presentationStyle={"pageSheet"}
        animationType="slide"
        onRequestClose={() => setClothModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#F8F8F8",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#3E055D",
              }}
            >
              My Clothes
            </Text>
          </View>
          <ClothingSlider title={"Pants & shorts"} category={"bottoms"} />
          <ClothingSlider title={"T-shirts"} category={"tops"} />
          <ClothingSlider title={"one-pieces"} category={"one-pieces"} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },

  editButton: {
    position: "absolute",

    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#000000",
  },

  modelImage: {
    width: "150%",
    height: "100%",
  },

  zoomButtonLeft: {
    position: "absolute",
    left: 20,
    bottom: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#000000",
  },

  zoomButtonRight: {
    position: "absolute",
    right: 20,
    bottom: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#000000",
  },
});

export default TryScreen;
