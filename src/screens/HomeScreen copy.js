import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActionSheetIOS,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, Button, Card, MD2Colors } from "react-native-paper";
import { handleImagePick } from "../services/ImageLoader";
import { onePiece, pants, Tshirts } from "../constants/clothes";
import ClothingSlider from "../components/ClothingSlider";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserImages } from "../features/userImages/userImagesThunks";
import {
  clearSelectedImage,
  selectImage,
} from "../features/userImages/userImagesSlice";

const HomeScreen = () => {
  const userImage = useSelector((state) => state.imagePicker.imageUri);
  const [loadingResult, setloadingResult] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const { images, loadingImages, errorImages, selectedImage } = useSelector(
    (state) => state.userImages
  );
  const { loading, resultImageUrls, error } = useSelector(
    (state) => state.tryOn
  );

  const dispatch = useDispatch();
  useEffect(() => {
    console.log('tryon loading ..', loading)
    setloadingResult(loading)
  }, [loading, dispatch])
    useEffect(() => {
      // Automatically select the first result from resultImageUrls
      if (resultImageUrls?.[0]) {
        dispatch(selectImage(resultImageUrls[0]));
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading && (
        <ActivityIndicator
          size={"large"}
          animating={true}
          color={MD2Colors.red800}
          style={styles.loadingIndicator}
        />
      )}

      

      <View style={styles.container}>
        {selectedImage ? (
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Cover
                source={{ uri: selectedImage }}
                style={styles.cardImage}
              />
              <Button
                icon="camera"
                mode="contained"
                onPress={() => openUserImages()}
                style={styles.overlayButton}
              >
                Edit Image
              </Button>
            </Card>

            <ClothingSlider title={"Pants & shorts"} category={"bottoms"} />
            <ClothingSlider
              title={"T-shirts"}
              category={"tops"}
            />
            <ClothingSlider title={"one-pieces"} category={"one-pieces"} />
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No image selected</Text>
          </View>
        )}
        {!selectedImage && (
          <Button
            icon="camera"
            mode="contained"
            onPress={() => openUserImages()}
            style={styles.bottomButton}
          >
            Choose Model
          </Button>
        )}
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
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }], // Center the indicator
    zIndex: 10, // Ensure it appears above other elements
  },
  cardContainer: {
    width: "100%",
    marginTop: 20,
  },
  card: {
    width: "100%", // Card spans the full width of the screen
    height: 400, // Set a fixed height for the card
    position: "relative",
    overflow: "hidden", // Prevent content from spilling outside the card
  },
  cardClothes: {
    width: "100%", // Card spans the full width of the screen
    height: 150, // Set a fixed height for the card
    position: "relative",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%", // Image takes up full width of the card
    height: "100%", // Image takes up full height of the card
    resizeMode: "cover", // Adjust image scaling to cover the card area
  },
  clothesImg: {
    width: "100%", // Image takes up full width of the card
    height: "100%", // Image takes up full height of the card
    resizeMode: "cover", // Adjust image scaling to cover the card area
  },
  overlayButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10, // Ensure the button is on top of the image
    backgroundColor: "#6200ee", // Optional: Customize button background
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    marginVertical: 20,
  },
  noImageText: {
    fontSize: 16,
    color: "#999",
  },
  bottomButton: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Add space between the two cards
    marginVertical: 4,
  },
  column: {
    flex: 1,
    marginHorizontal: 8, // Add horizontal spacing between columns
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
  placeholderImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: "#C4C4C4",
  },
  placeholderText: {
    fontSize: 12,
    color: "#C4C4C4",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  dropdown: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  dropdownText: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
export default HomeScreen;
