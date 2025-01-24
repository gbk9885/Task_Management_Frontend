"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import styles from "./taskManagement.module.css";

const TaskManagement = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/");
      return;
    }

    setUserRole(user.role);
    setUserName(user.username);
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8009/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleTaskClick = (taskId) => {
    router.push(`/task/${taskId}`);
  };

  const handleAddTask = () => {
    router.push("/taskManagement/addTask");
  };

  if (isLoading) return <div className={styles.loading}>Loading tasks...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h1>Task Management</h1>
        <nav>
          <a href="/dashboard">Home</a>
        </nav>
        <div className={styles.userIconContainer}>
          <FaUserCircle
            className={styles.userIcon}
            onClick={handleUserClick}
          />
          {showDropdown && (
            <div className={styles.userDropdown}>
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Role:</strong> {userRole}</p>
            </div>
          )}
        </div>
      </div>

      {userRole !== "User" && (
        <div className={styles.actions}>
          <button className={styles.addTaskButton} onClick={handleAddTask}>
            Add New Task
          </button>
        </div>
      )}

      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            {userRole === "Admin" && <th>Assigned To</th>}
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} onClick={() => handleTaskClick(task.id)}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              {userRole === "Admin" && <td>{task.assignedTo}</td>}
              <td>{task.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagement;