import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { taskSlice } from "./redux/taskSlice";
import { getStatusColor, getPriorityColor } from "./theme/colors";
import { FontAwesome5 } from "react-native-vector-icons";
import DatePicker from "react-native-date-picker";

const fetchTasks = async (page = 1, limit = 10) => {
  return new Promise((resolve) => {
    const tasks = Array.from({ length: limit }, (_, i) => ({
      id: `${page}-${i}`,
      title: `Task ${page}-${i}`,
      description: `Description for task ${page}-${i}`,
      priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      status: ["Completed", "Pending", "In Progress"][
        Math.floor(Math.random() * 3)
      ],
      dueDate: new Date().toISOString().split("T")[0],
    }));
    setTimeout(() => resolve(tasks), 1000);
  });
};

const { setTasks, updateTaskInStore, setSearchQuery, addTask } =
  taskSlice.actions;

const TaskListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { tasks, page, filters, darkMode, searchQuery, darkModeSettings } =
    useSelector((state) => state.tasks);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalCreateTaskVisible, setModalCreateTaskVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "",
    description: "",
    status: "",
  });

  const { contrast, brightness } = darkModeSettings;

  const dynamicStyles = {
    backgroundColor: darkMode
      ? `rgba(0, 0, 0, ${0.8 * contrast})`
      : `rgba(255, 255, 255, ${brightness})`,
    color: darkMode
      ? `rgba(255, 255, 255, ${0.8 * brightness})`
      : `rgba(0, 0, 0, ${contrast})`,
  };

  useEffect(() => {
    fetchMoreTasks(1);
  }, [filters]);

  const fetchMoreTasks = async (page) => {
    if (loading) return;
    setLoading(true);
    const newTasks = await fetchTasks(page);
    dispatch(setTasks({ tasks: newTasks, page }));
    setLoading(false);
  };

  const applyFilters = (task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedTask(null);
    setModalVisible(false);
  };

  const saveTaskChanges = () => {
    if (selectedTask) {
      dispatch(updateTaskInStore(selectedTask));
    }
    closeEditModal();
  };

  const updateTask = (field, value) => {
    setSelectedTask((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateModal = (task) => {
    setModalCreateTaskVisible(true);
  };

  const closeCreateModal = () => {
    setModalCreateTaskVisible(false);
    setNewTask({
      title: "",
      dueDate: "",
      priority: "",
      description: "",
      status: "",
    });
  };

  const saveNewTask = () => {
    dispatch(addTask(newTask));
    closeCreateModal();
  };

  const completedTasksToday = tasks.filter(
    (task) =>
      task.status === "Completed" &&
      task.dueDate === new Date().toISOString().split("T")[0]
  ).length;

  const upcomingDeadlines = tasks
    .filter((task) => new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const overdueTasksCount = tasks.filter(
    (task) => new Date(task.dueDate) < new Date() && task.status !== "Completed"
  ).length;

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setNewTask({ ...newTask, dueDate: date.toISOString().split("T")[0] });
    setDatePickerVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            style={[
              styles.searchBar,
              {
                backgroundColor: darkMode ? "#222" : "#fff",
                color: darkMode ? "#fff" : "#222",
              },
            ]}
            placeholder="Search Tasks"
            value={searchQuery}
            placeholderTextColor={darkMode ? "#aaa" : "#555"}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
          />
        </View>
        <TouchableOpacity
          style={styles.floatingButtons}
          onPress={openCreateModal}
        >
          <FontAwesome5 name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.productivityCard}>
        <Text
          style={[styles.productivityTitle, { color: dynamicStyles.color }]}
        >
          User Productivity Summary
        </Text>

        <View style={styles.productivityContainer}>
          <Text
            style={[styles.productivityText, { color: dynamicStyles.color }]}
          >
            Total Tasks Completed Today: {completedTasksToday}
          </Text>
          <Text
            style={[styles.productivityText, { color: dynamicStyles.color }]}
          >
            Tasks Overdue: {overdueTasksCount}
          </Text>
          <Text
            style={[styles.productivityText, { color: dynamicStyles.color }]}
          >
            Upcoming Deadlines:
          </Text>

          {upcomingDeadlines.map((task) => (
            <Text
              key={task.id}
              style={[styles.productivityText, { color: dynamicStyles.color }]}
            >
              {task.title} - {task.dueDate}
            </Text>
          ))}
        </View>
      </View>

      <FlatList
        data={tasks.filter(applyFilters)}
        keyExtractor={(item) => item.id}
        onEndReached={() => fetchMoreTasks(page + 1)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskCard,
              {
                borderTopWidth: 16,
                borderColor: getStatusColor(item.status),
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: dynamicStyles?.backgroundColor,
              },
              styles.shadow,
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("TaskDetails", { task: item })}
            >
              <Text style={[styles.taskTitle, { color: dynamicStyles?.color }]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  { color: dynamicStyles?.color },
                ]}
              >
                {item.description}
              </Text>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={styles.statusBadge}>
                  <Text
                    style={[
                      styles.statusText,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text
                    style={[
                      styles.statusText,
                      { backgroundColor: getPriorityColor(item.priority) },
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openModal(item)}>
              <FontAwesome5
                name="pen"
                size={16}
                color={darkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          loading && <Text style={styles.loadingText}>Loading...</Text>
        }
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("Filters")}
      >
        <View style={{ flexDirection: "row" }}>
          <FontAwesome5 name="filter" size={14} color={"#fff"} />
          <Text style={styles.floatingButtonText}>Filter</Text>
        </View>
      </TouchableOpacity>

      {/* Task Creation Modal */}
      <Modal
        visible={isModalCreateTaskVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCreateModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: darkMode ? "#222" : "#fff" },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: darkMode ? "#fff" : "#000" }]}
            >
              Create New Task
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? "#333" : "#f1f1f1",
                  color: darkMode ? "#fff" : "#000",
                  borderColor: darkMode ? "#555" : "#ccc",
                  shadowColor: darkMode ? "transparent" : "#aaa",
                },
              ]}
              placeholder="Task Name"
              placeholderTextColor={darkMode ? "#bbb" : "#666"}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: darkMode ? "#333" : "#f1f1f1",
                  color: darkMode ? "#fff" : "#000",
                  borderColor: darkMode ? "#555" : "#ccc",
                  shadowColor: darkMode ? "transparent" : "#aaa",
                },
              ]}
              placeholder="Description"
              placeholderTextColor={darkMode ? "#bbb" : "#666"}
              multiline
              value={newTask.description}
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
            />

            <TouchableOpacity onPress={openDatePicker} style={styles.input}>
              <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                Due Date: {newTask.dueDate || "Select Date"}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={datePickerVisible}
              date={selectedDate}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisible(false)}
            />

            <Text
              style={[styles.modalLabel, { color: darkMode ? "#bbb" : "#000" }]}
            >
              Priority:
            </Text>
            {["High", "Medium", "Low"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.option,
                  { backgroundColor: darkMode ? "#333" : "#f1f1f1" },
                  newTask.priority === priority && styles.selectedOption,
                ]}
                onPress={() => setNewTask({ ...newTask, priority })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: darkMode ? "#fff" : "#555" },
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}

            <Text
              style={[styles.modalLabel, { color: darkMode ? "#bbb" : "#000" }]}
            >
              Status:
            </Text>
            {["Completed", "Pending", "In Progress"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.option,
                  { backgroundColor: darkMode ? "#333" : "#f1f1f1" },
                  newTask.status === status && styles.selectedOption,
                ]}
                onPress={() => setNewTask({ ...newTask, status })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: darkMode ? "#fff" : "#555" },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveNewTask}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeCreateModal}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Task Details Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: darkMode ? "#222" : "#fff" },
            ]}
          >
            {selectedTask && (
              <>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: darkMode ? "#fff" : "#000" },
                  ]}
                >
                  Edit Task
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: darkMode ? "#bbb" : "#000" },
                  ]}
                >
                  Title:
                </Text>
                <Text
                  style={[
                    styles.modalValue,
                    { color: darkMode ? "#ddd" : "#555" },
                  ]}
                >
                  {selectedTask.title}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: darkMode ? "#bbb" : "#000" },
                  ]}
                >
                  Description:
                </Text>
                <Text
                  style={[
                    styles.modalValue,
                    { color: darkMode ? "#ddd" : "#555" },
                  ]}
                >
                  {selectedTask.description}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: darkMode ? "#bbb" : "#000" },
                  ]}
                >
                  Priority:
                </Text>
                {["High", "Medium", "Low"].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.option,
                      { backgroundColor: darkMode ? "#333" : "#f1f1f1" },
                      selectedTask.priority === priority &&
                        styles.selectedOption,
                    ]}
                    onPress={() => updateTask("priority", priority)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: darkMode ? "#fff" : "#555",
                        },
                        selectedTask.priority === priority &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}

                <Text
                  style={[
                    styles.modalLabel,
                    { color: darkMode ? "#bbb" : "#000" },
                  ]}
                >
                  Status:
                </Text>
                {["Completed", "Pending", "In Progress"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.option,
                      { backgroundColor: darkMode ? "#333" : "#f1f1f1" },
                      selectedTask.status === status && styles.selectedOption,
                    ]}
                    onPress={() => updateTask("status", status)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: darkMode ? "#fff" : "#555" },
                        selectedTask.status === status &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveTaskChanges}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeEditModal}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  productivityCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginVertical: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "linear-gradient(45deg, #f5f7fa, #c3cfe2)",
    overflow: "hidden",
  },
  input: {
    width: "100%",
    padding: 14,
    marginVertical: 10,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  productivityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    letterSpacing: 1,
    color: "#333",
  },

  // Container for aligning text vertically
  productivityContainer: {
    flexDirection: "column", // Stacks the text vertically
    marginTop: 10,
  },

  // Text style for productivity info
  productivityText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 15, // More spacing between lines
    paddingLeft: 10, // Slight indentation for a cleaner look
  },

  // Optional: Create a badge for showing stats
  statsBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "#007bff",
    color: "#fff",
    marginVertical: 5,
  },

  // Badge text style for labels
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  dark: {
    backgroundColor: "#333",
    color: "#fff",
  },
  light: {
    backgroundColor: "#fff",
    color: "#000",
  },
  taskCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: "#555",
  },
  statusBadge: {
    marginTop: 10,
    width: "40%",
    marginRight: 10,
  },
  statusText: {
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  floatingButtons: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 30,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 50,
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 5,
  },

  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#007bff",
  },
  shadow: {
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  modalLabel: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  modalValue: { fontSize: 16, color: "#555", marginBottom: 10 },
  option: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },
  selectedOption: {
    backgroundColor: "#007bff",
  },
  optionText: { fontSize: 16, color: "#555" },
  selectedOptionText: { color: "#fff" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#28a745",
    width: "45%",
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#dc3545",
    width: "45%",
  },
  buttonText: { textAlign: "center", color: "#fff", fontSize: 16 },
});

export default TaskListScreen;
