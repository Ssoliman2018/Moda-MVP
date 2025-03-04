import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

// Function to split the array into chunks
const chunkArray = (array, chunkSize) => {
    // console.log("clothingItems ....", array);

  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const ClothingGrid = ({ clothingItems, handleCardClick }) => {
    // console.log("clothingItems", clothingItems);
    // console.log("handleCardClick", handleCardClick);

  // Split the clothingItems array into rows of 3
  const rows = chunkArray(clothingItems, 3);

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.column}
              onPress={() => handleCardClick(item.uri)}
            >
              <Card style={styles.cardClothes}>
                <Card.Cover
                  source={{ uri: item.uri }}
                  style={styles.clothesImg}
                />
                {/* <Card.Content>
                  <Text style={styles.itemName}>{item.name}</Text>
                </Card.Content> */}
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#000000",
    // height: 500,
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
      // justifyContent: "space-between",
      padding: 0,
    marginBottom: 15,
    height: 180
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
    maxWidth: "30%", // To ensure proper spacing for 3 columns
  },
  cardClothes: {
    flex: 1,
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

export default ClothingGrid;
