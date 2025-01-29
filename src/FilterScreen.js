import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

import { taskSlice } from "./redux/taskSlice";

const { setFilter } = taskSlice.actions;

const FilterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { filters, darkMode, darkModeSettings } = useSelector(
    (state) => state.tasks
  );

  const pickerpPriorityRef = useRef();
  const pickerStatusRef = useRef();

  const { contrast, brightness } = darkModeSettings;
  const handleStatusChange = (value) => {
    dispatch(setFilter({ status: value }));
  };

  const handlePriorityChange = (value) => {
    dispatch(setFilter({ priority: value }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? `rgba(20, 20, 20, ${contrast})`
            : `rgba(255, 255, 255, ${brightness})`,
        },
      ]}
    >
      <View style={{ margin: 20 }}>
        <Text
          style={[
            styles.heading,
            darkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Status:
        </Text>
        <Picker
          ref={pickerStatusRef}
          selectedValue={filters?.status}
          onValueChange={handleStatusChange}
          itemStyle={darkMode ? { color: "#fff" } : { color: "#000" }}
        >
          <Picker.Item label="Completed" value={"Completed"} />
          <Picker.Item label="Pending" value={"Pending"} />
          <Picker.Item label="In Progress" value={"In Progress"} />
        </Picker>

        <View style={{ marginTop: 20 }} />
        <Text
          style={[
            styles.heading,
            darkMode ? styles.darkText : styles.lightText,
          ]}
        >
          Priority:
        </Text>

        <Picker
          ref={pickerpPriorityRef}
          selectedValue={filters?.priority}
          onValueChange={handlePriorityChange}
          itemStyle={darkMode ? { color: "#fff" } : { color: "#000" }}
        >
          <Picker.Item label="High" value={"High"} />
          <Picker.Item label="Medium" value={"Medium"} />
          <Picker.Item label="Low" value={"Low"} />
        </Picker>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              { backgroundColor: darkMode ? "#0056b3" : "#007bff" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.floatingButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontWeight: "800",
    fontSize: 16,
  },

  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },

  floatingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  applyButton: {
    padding: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },

  // Picker styles
  lightPicker: {
    backgroundColor: "#fff",
    color: "#000",
  },

  darkPicker: {
    backgroundColor: "#333",
    color: "#fff",
  },
});

export default FilterScreen;
