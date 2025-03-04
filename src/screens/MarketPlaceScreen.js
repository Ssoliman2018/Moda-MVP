import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

const categories = [
  { id: "1", name: "Tops", icon: "shirt", active: true },
  { id: "2", name: "Bottoms", icon: "ios-woman", active: false },
  { id: "3", name: "One piece", icon: "ios-walk", active: false },
];

const products = [
  {
    id: "1",
    name: "Alexander McQueen",
    price: "1,505$",
    rating: 4.8,
    image: "https://www.mytheresa.com/media/1094/1238/100/0a/P00905751_b1.jpg",
    liked: false,
  },
  {
    id: "2",
    name: "Burberry",
    price: "525$",
    rating: 4.8,
    image: "https://www.mytheresa.com/media/1094/1238/100/40/P00982771.jpg",
    liked: true,
  },
  {
    id: "2",
    name: "Ansdell Hoodie",
    price: "910$",
    rating: 4.8,
    image: "https://is4.fwrdassets.com/images/p/fw/z/BURF-MK37_V1.jpg",
    liked: false,
  },
  {
    id: "2",
    name: "Side Seam Trousers",
    price: "408$",
    rating: 4.8,
    image: "https://is4.fwrdassets.com/images/p/fw/z/GIVE-MP89_V1.jpg",
    liked: true,
  },
  {
    id: "2",
    name: "Mesh Polo",
    price: "1,290$",
    rating: 4.8,
    image: "https://is4.fwrdassets.com/images/p/fw/z/AMIF-MS429_V1.jpg",
    liked: true,
  },
];

const MarketPlaceScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("Shoes");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{
              uri: "https://media.centrepointstores.com/i/centrepoint/SP_Offers_Block01MAR18.jpg",
            }}
            style={styles.bannerImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.name)}
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.categoryButtonActive,
              ]}
            >
              {/* <Ionicons name={item.icon} size={20} color="black" /> */}
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Product Grid */}
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons
                  name={item.liked ? "heart" : "heart-outline"}
                  size={22}
                  color={item.liked ? "red" : "gray"}
                />
              </TouchableOpacity>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="gold" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerText: { fontSize: 22, fontWeight: "bold" },
  banner: { position: "relative", marginBottom: 16 },
  bannerImage: { width: "100%", height: 180, borderRadius: 10 },
  bannerTextContainer: { position: "absolute", top: 20, left: 20 },
  bannerTitle: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  bannerButton: { backgroundColor: "#E85D04", marginTop: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  viewAll: { fontSize: 14, color: "#E85D04" },
  categoriesContainer: { paddingHorizontal: 16, marginBottom: 16 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryButtonActive: { backgroundColor: "#2980B9" },
  categoryText: { fontSize: 14, color: "#555", marginLeft: 5 },
  categoryTextActive: { color: "#fff" },
  productList: { paddingHorizontal: 16 },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  productImage: { width: "100%", height: 200, borderRadius: 8 },
  heartIcon: { position: "absolute", top: 10, right: 10 },
  productName: { fontSize: 14, fontWeight: "bold" },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "green" },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { fontSize: 14, marginLeft: 4, fontWeight: "bold" },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#fff",
  },
  cartButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 50,
  },
});

export default MarketPlaceScreen;
