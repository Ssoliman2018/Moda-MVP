import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { handleImagePick } from "../services/ImageLoader";
// import { fetchUserImages } from "../features/userImages/userImagesSlice";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { fetchUserImages } from "../features/userImages/userImagesThunks";

const ModelsScreen = () => {
  const dispatch = useDispatch();
  const [modelImages, setModelImages] = useState([]);
  const { loading, uploadedImageUrl, resultImageUrl, error } = useSelector(
    (state) => state.tryOn
  );
  const { images, loadingImages, errorImages } = useSelector(
    (state) => state.userImages
  );

  useEffect(() => {
    // Fetch user images when the component mounts
    dispatch(fetchUserImages());
  }, [dispatch]);

  // Fetch images again when a new image is uploaded
  useEffect(() => {
    if (uploadedImageUrl) {
      dispatch(fetchUserImages()); // Re-fetch user images after upload
    }
  }, [uploadedImageUrl, dispatch]);

  console.log("userImages ..###", images);
  console.log("loadingImages ..", loadingImages);
  console.log("errorImages ..", errorImages);

  const openActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Capture Image", "Choose Image"],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          // console.log("buttonIndex 1", buttonIndex);
          Alert("In Progress Feature ");
          // handleImagePick(true, dispatch);
        } else if (buttonIndex === 2) {
          handleImagePick(false, dispatch);
        }
      }
    );
  console.log("loading >>", loading);

  console.log("uploadedImageUrl >>", uploadedImageUrl);

  return (
    <View style={styles.container}>
      {loadingImages ? (
        <ActivityIndicator
          size={"large"}
          animating={true}
          color={MD2Colors.red800}
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          {/* Pinned Chats */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>My Models</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openActionSheet}
            >
              <Ionicons name="add-circle-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
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
              <View style={styles.pinnedCard}>
                {loadingImages ? (
                  <ActivityIndicator
                    size={"large"}
                    animating={true}
                    color={MD2Colors.red800}
                    style={styles.loadingIndicator}
                  />
                ) : (
                  <Image
                    source={{ uri: item }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },
  topContact: { alignItems: "center", marginRight: 16 },
  contactName: { marginTop: 4, fontSize: 12, textAlign: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  searchInput: { flex: 1, height: 40 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  pinnedCard: { width: 180, marginRight: 4 },
  cardImage: { height: 240, borderRadius: 8 },
  pinnedName: { fontWeight: "bold", fontSize: 14 },
  chatRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  chatContent: { flex: 1, marginHorizontal: 8 },
  chatName: { fontWeight: "bold", fontSize: 14 },
  chatMessage: { color: "#666", fontSize: 12 },
  chatDetails: { alignItems: "flex-end" },
  chatTime: { fontSize: 12, color: "#666" },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F8F8", // Optional: Matches light background
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000", // Dark purple text
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#000000", // Light purple background
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ModelsScreen;
