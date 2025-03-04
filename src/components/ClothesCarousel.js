import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import Carousel from "react-native-snap-carousel";
// import Carousel from "react-native-snap-carousel";

const ClothesCarousel = ({ clothingItems, handleCardClick }) => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Card style={styles.cardClothes}>
        <Card.Cover source={{ uri: item.uri }} style={styles.clothesImg} />
        <Card.Content>
          <Text style={styles.itemName}>{item.name}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <Carousel
      data={clothingItems}
      renderItem={renderItem}
      sliderWidth={300} // Width of the whole slider
      itemWidth={200} // Width of each item
      loop={true} // Infinite scrolling
      autoplay={true} // Auto-scroll
      onSnapToItem={(index) => console.log("Current index:", index)}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    alignItems: "center",
  },
  cardClothes: {
    borderRadius: 10,
    overflow: "hidden",
  },
  clothesImg: {
    height: 150,
    resizeMode: "cover",
  },
  itemName: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default ClothesCarousel;
