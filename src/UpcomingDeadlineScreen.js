import React from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getPriorityColor, getStatusColor } from "./theme/colors";
import { useSelector } from "react-redux";

const UpcomingDeadline = ({ route, navigation }) => {
  const { task: tasks } = route.params;
  const { darkMode, darkModeSettings } = useSelector((state) => state.tasks);

  console.log("task", tasks);

  const { contrast, brightness } = darkModeSettings;

  const dynamicStyles = {
    backgroundColor: darkMode
      ? `rgba(0, 0, 0, ${0.8 * contrast})`
      : `rgba(255, 255, 255, ${brightness})`,
    color: darkMode
      ? `rgba(255, 255, 255, ${0.8 * brightness})`
      : `rgba(0, 0, 0, ${contrast})`,
  };

  return (
    <SafeAreaView
      style={[
        styles.detailContainer,
        {
          backgroundColor: darkMode
            ? `rgba(20, 20, 20, ${contrast})`
            : `rgba(255, 255, 255, ${contrast})`,
        },
      ]}
    >
      {tasks?.length !== 0 ? (
        <ScrollView>
          {tasks?.map((task) => (
            <TouchableOpacity
              key={task?.id}
              style={[
                styles.taskCard,
                {
                  borderTopWidth: 16,
                  borderColor: getStatusColor(task.status),
                  backgroundColor: dynamicStyles?.backgroundColor,
                },
                styles.shadow,
              ]}
              onPress={() => navigation.navigate("TaskDetails", { task: task })}
            >
              <Text style={[styles.taskTitle, { color: dynamicStyles?.color }]}>
                {task.title}
              </Text>

              <Text
                style={[
                  styles.taskDescription,
                  { color: dynamicStyles?.color },
                ]}
              >
                {task.description}
              </Text>

              <Text
                style={[
                  styles.taskDescription,
                  { color: dynamicStyles?.color },
                ]}
              >
                Due Date: {task.dueDate}
              </Text>

              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(task.status) },
                  ]}
                >
                  <Text style={[styles.statusText]}>{task.status}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                >
                  <Text style={[styles.statusText]}>{task.priority}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            color: dynamicStyles?.color,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          No Upcoming Task
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#f7f7f7",
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },

  taskCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#ddd",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  taskTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1.2,
  },

  taskDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 24,
  },

  statusContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // width: "100%",
    marginTop: 15,
  },

  statusBadge: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    marginRight: 10,
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    borderRadius: 12,
    paddingVertical: 5,
  },

  shadow: {
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default UpcomingDeadline;
