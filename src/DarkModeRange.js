import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useDispatch, useSelector } from "react-redux";
import { taskSlice } from "./redux/taskSlice";

const { toggleDarkMode, setDarkModeSettings } = taskSlice.actions;

const DarkModeCustomization = ({ navigation }) => {
  const dispatch = useDispatch();
  const { darkMode, darkModeSettings, setTasks, setSearchQuery, setFilter } =
    useSelector((state) => state.tasks);
  const { contrast, brightness } = darkModeSettings;

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    dispatch(toggleDarkMode(newTheme));
    await AsyncStorage.setItem("darkMode", JSON.stringify(newTheme));
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    dispatch(setTasks({ tasks: [], page: 1 }));
    dispatch(setSearchQuery(""));
    dispatch(setFilter({}));
    dispatch(setDarkModeSettings({ contrast: 1, brightness: 1 }));
    navigation.navigate("Tasks");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        darkMode
          ? { backgroundColor: `rgba(20, 20, 20, ${contrast})` }
          : { backgroundColor: `rgba(255, 255, 255, ${contrast})` },
      ]}
    >
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text
          style={[
            styles.heading,
            darkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Dark Mode Customization
        </Text>

        <View style={styles.toggleContainer}>
          <Text
            style={[
              styles.label,
              darkMode ? styles.darkText : styles.lightText,
            ]}
          >
            Enable Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            thumbColor={darkMode ? "#fff" : "#000"}
            trackColor={{ false: "#ccc", true: "#555" }}
          />
        </View>

        <Text
          style={[styles.label, darkMode ? styles.darkText : styles.lightText]}
        >
          Contrast
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          value={contrast}
          onValueChange={(value) =>
            dispatch(setDarkModeSettings({ contrast: value }))
          }
          minimumTrackTintColor={darkMode ? "#0ff" : "#007bff"}
          maximumTrackTintColor="#ccc"
        />

        {/* Brightness Slider */}
        <Text
          style={[styles.label, darkMode ? styles.darkText : styles.lightText]}
        >
          Brightness
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          value={brightness}
          onValueChange={(value) =>
            dispatch(setDarkModeSettings({ brightness: value }))
          }
          minimumTrackTintColor={darkMode ? "#ff0" : "#ffa500"}
          maximumTrackTintColor="#ccc"
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text
            style={[
              styles.logoutButtonText,
              { color: darkMode ? "#0ff" : "#007bff" },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
});

export default DarkModeCustomization;
