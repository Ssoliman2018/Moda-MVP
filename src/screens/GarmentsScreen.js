import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";

// import {
//   deleteImage,
//   fetchGarmentImages,
//   uploadImageToGarmentCategory,
//   uploadMultipleImages,
// } from "../features/garments/garmentsSlice";
import { ActivityIndicator, MD2Colors, MD3Colors, ProgressBar } from "react-native-paper";
import { selectGarments, selectGarmentsByCategory, selectGarmentsLoading } from "../features/garments/garmentsSelectors";
import { deleteGarmentImage, deleteGarmentImg, fetchGarmentImages, uploadMultipleImages } from "../features/garments/garmentsThunks";
import { handleMultipleImagePick } from "../services/ImagePicker";
import { resetDeleteState } from "../features/garments/garmentsSlice";
import { onePiece } from "../constants/clothes";

const GarmentsScreen = () => {
  const dispatch = useDispatch();
  // const topGarments = useSelector(selectGarmentsByCategory("Tops"));
  // const bottomsGarments = useSelector(selectGarmentsByCategory("Bottoms"));
  // const onePeaceGarments = useSelector(selectGarmentsByCategory("one-peace"));

  // const loading = useSelector(selectGarmentsLoading);

    const {
      garments,
      garmentsLoading,
      garmentsError,
      deleteSuccess,
      deleteError,
    } = useSelector((state) => state.garments);

  
  // Function to select and upload multiple images
  const selectAndUploadImages = async (category) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      dispatch(uploadMultipleImages({ localUris: selectedUris, category }));
    }
  };


  useEffect(() => {
    dispatch(fetchGarmentImages("tops")); // Fetch garment images on component mount
    dispatch(fetchGarmentImages("bottoms")); // Fetch garment images on component mount
    dispatch(fetchGarmentImages("one-pieces")); // Fetch garment images on component mount
  }, [dispatch]);

    console.log("garments >>", garments);

  // console.log("topGarments >>", topGarments);
  const handleDelete = (category, imageUrl) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteGarmentImg({ category, imageUrl })),
      },
    ]);
  };

  // Watch for delete success or error and display alerts
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert("Success", deleteSuccess, [
        { text: "OK", onPress: () => dispatch(resetDeleteState()) },
      ]);
    }
    if (deleteError) {
      Alert.alert("Error", deleteError, [
        { text: "OK", onPress: () => dispatch(resetDeleteState()) },
      ]);
    }
  }, [deleteSuccess, deleteError, dispatch]);


  return (
    <View style={styles.container}>
      {garmentsLoading ? (
        <ActivityIndicator
          size={"large"}
          animating={true}
          color={MD2Colors.red800}
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Tops</Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectAndUploadImages("tops")}
            >
              <Ionicons name="add-circle-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.category}>Tops</Text> */}
          <FlatList
            data={garments.tops}
            horizontal
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete("tops", item)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={28}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Bottoms</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectAndUploadImages("bottoms")}
            >
              <Ionicons name="add-circle-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={garments.bottoms}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete("bottoms", item)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={28}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>One Piece</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectAndUploadImages("one-pieces")}
            >
              <Ionicons name="add-circle-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={garments["one-pieces"] || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete("one-pieces", item)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={28}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  category: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  image: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  addButton: { position: "absolute", bottom: 20, right: 20 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // Dark purple text
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#000000", // Light purple background
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    // backgroundColor: '#dedede',
    margin: 4,
    width: 100,
    height: 150,
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    left: 0 ,
    backgroundColor: "#dedede",
    padding: 4,
    borderRadius: 4,
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
});

export default GarmentsScreen;
