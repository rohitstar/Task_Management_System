export const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#28a745"; // Green
      case "Pending":
        return "#ffc107"; // Yellow
      case "In Progress":
        return "#007bff"; // Blue
      default:
        return "#6c757d"; // Grey
    }
  };
  
  export const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#28a745"; // Green
      case "Medium":
        return "#ffc107"; // Yellow
      case "Low":
        return "#e82102"; // Red
      default:
        return "#6c757d"; // Grey
    }
  };