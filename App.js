import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  StatusBar,
  Platform,
} from "react-native";
import { configureStore } from "@reduxjs/toolkit";
import { taskSlice } from "./src/redux/taskSlice";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import TaskListScreen from "./src/TaskListScreen";
import FilterScreen from "./src/FilterScreen";
import TaskDetailsScreen from "./src/TaskDetailsScreen";
import DarkModeCustomization from "./src/DarkModeRange";
import { Ionicons } from "react-native-vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UpcomingDeadline from "./src/UpcomingDeadlineScreen";

const store = configureStore({ reducer: { tasks: taskSlice.reducer } });

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { toggleDarkMode } = taskSlice.actions;

const CustomHeader = ({ navigation, title }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.tasks.darkMode);


  const toggleTheme = async () => {
    const newTheme = !darkMode;
    dispatch(toggleDarkMode(newTheme));
    await AsyncStorage.setItem("darkMode", JSON.stringify(newTheme));
  };

  return (
    <View
      style={[
        styles.headerContainer,
        darkMode ? styles.darkHeader : styles.lightHeader,
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#222" : "#fff"}
      />
      {navigation.canGoBack() && (
        <Ionicons
          name="arrow-back"
          size={24}
          color={darkMode ? "#fff" : "#000"}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      )}

      <Text
        style={[
          styles.headerTitle,
          darkMode ? styles.darkText : styles.lightText,
        ]}
      >
        {title}
      </Text>

      <Switch
        value={darkMode}
        onValueChange={toggleTheme}
        thumbColor={darkMode ? "#fff" : "#000"}
        trackColor={{ false: "#ccc", true: "#555" }}
      />
    </View>
  );
};

const TaskStack = () => (
  <Stack.Navigator
    screenOptions={{
      header: ({ navigation, route }) => (
        <CustomHeader title={route.name} navigation={navigation} />
      ),
    }}
  >
    <Stack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{ title: "Tasks" }}
    />
    <Stack.Screen
      name="Filters"
      component={FilterScreen}
      options={{ title: "Filters" }}
    />
    <Stack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={{ title: "Task Details" }}
    />
    <Stack.Screen
      name="UpcomingDeadline"
      component={UpcomingDeadline}
      options={{ title: "Upcoming Deadlines Task" }}
    />
  </Stack.Navigator>
);

const AppTabs = () => {
  const darkMode = useSelector((state) => state.tasks.darkMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: darkMode ? "#222" : "#fff",
          borderTopColor: darkMode ? "#444" : "#ccc",
        },
        tabBarActiveTintColor: darkMode ? "#00c3ff" : "#007bff",
        tabBarInactiveTintColor: darkMode ? "#bbb" : "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === "Tasks" ? "list" : "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={DarkModeCustomization}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    // flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 10,
    paddingBottom: 10,
  },
  lightHeader: {
    backgroundColor: "#fff",
  },
  darkHeader: {
    backgroundColor: "#222",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },

  backButton: {
    // position: "absolute",
    // left: 10,
    // top: 60,
    padding: 10,
  },
});

export default App;
