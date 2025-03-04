import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

import { Provider, useDispatch } from "react-redux";
import HomeScreen from "./src/screens/HomeScreen";
import { store } from "./src/redux/store";
import ModelsScreen from "./src/screens/ModelScreen";
import GarmentsScreen from "./src/screens/GarmentsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import TryOnScreen from "./src/screens/TryOnScreen";
import { useEffect } from "react";
import TryScreen from "./src/screens/TryScreen";
import MarketPlaceScreen from "./src/screens/MarketPlaceScreen";
// import { fetchOrCreateUserId } from "./src/features/user/userIdSlice";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // const dispatch = useDispatch();
  // const { userId, loading, error } = useSelector((state) => state.user);
  // useEffect(() => {
  //   dispatch(fetchOrCreateUserId());
  // }, [dispatch]);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Models") {
                  iconName = focused
                    ? "person-circle"
                    : "person-circle-outline";
                } else if (route.name === "Closet") {
                  iconName = focused ? "shirt" : "shirt-outline";
                } else if (route.name === "Home") {
                  iconName = focused ? "eye" : "eye-outline";
                } else if (route.name === "Marketplace") {
                  iconName = focused ? "cart" : "cart-outline";
                }
                return <Ionicons name={iconName} size={30} color={color} />;
              },
              tabBarActiveTintColor: "#000000",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Models" component={ModelsScreen} />
            <Tab.Screen name="Closet" component={GarmentsScreen} />
            <Tab.Screen name="Marketplace" component={MarketPlaceScreen} />

            <Tab.Screen name="Home" component={TryScreen} />
            {/* <Tab.Screen name="TryOn" component={TryScreen} /> */}
          </Tab.Navigator>
        </NavigationContainer>
        {/* <ScrollView>
          <HomeScreen />
        </ScrollView> */}
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
