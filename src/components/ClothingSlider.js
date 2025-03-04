import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchGarmentImages } from "../features/garments/garmentsThunks";
import { selectGarment } from "../features/garments/garmentsSlice";
import { tryOnFashionAI } from "../features/tryOn/tryOnThunks";

const ClothingSlider = ({ title, category }) => {
  const dispatch = useDispatch();
  const { garments } = useSelector((state) => state.garments);
  const { selectedImage } = useSelector((state) => state.userImages);
  const { resultImageUrl } = useSelector((state) => state.tryOn);

  useEffect(() => {
    dispatch(fetchGarmentImages(category)); // Fetch garment images on component mount
  }, [dispatch]);

  const clothingItems = garments[category];
  // console.log("garments !!!!", clothingItems);
  const handleCardClick = async (clothingItemUri) => {
    dispatch(selectGarment({ url: clothingItemUri, category: category }));
    console.log("before tryon ..", {
      userImage: selectedImage,
      clothingImage: clothingItemUri,
      category: category,
    });
    try {
      // Reset state before processing
      dispatch(
        tryOnFashionAI({
          userImage: selectedImage,
          clothingImage: clothingItemUri,
          category: category,
        })
      );
      // Fetch try-on result with the uploaded image and clothing item
      // const result = await dispatch(
      //   fetchFashionAIResult({
      //     userImageUrl: uploadedImageResult,
      //     clothingImage: clothingItemUri.uri,
      //     category: clothingItemUri.category,
      //   })
      // ).unwrap();
      // console.log("try on result image =>", result);
    } catch (error) {
      console.error("Error during try-on process:", error);
    }
  };
  const ITEM_WIDTH = 100; // Width of each card
  const SPACING = 10; // Spacing between cards
  const VISIBLE_ITEMS = 4; // Number of visible items

  return (
    <Card style={styles.container}>
      <Card.Title title={title} />
      <FlatList
        data={clothingItems}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCardClick(item)}
            style={[styles.itemContainer, { width: ITEM_WIDTH + SPACING }]}
          >
            <View style={[styles.cardClothes]}>
              <Image source={{ uri: item }} style={styles.clothesImg} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, i) => i}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true} // Enables snapping between "pages" of items
        snapToInterval={ITEM_WIDTH + SPACING} // Defines the size of each "snap"
        decelerationRate="fast" // Makes the sliding more responsive
        contentContainerStyle={{
          paddingHorizontal: SPACING / 2,
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 180, // Adjust height as needed
    // backgroundColor: "#dedede",
    padding: 4,
  },
  itemContainer: {
    alignItems: "center",
    // backgroundColor: "#dedede",
  },
  cardClothes: {
    //   backgroundColor: "#000000",
    borderRadius: 10,
    overflow: "hidden",
    width: 120,
  },
  clothesImg: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  itemName: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default ClothingSlider;
