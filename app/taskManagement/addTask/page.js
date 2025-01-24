"use client";

import React, { useState, useEffect } from "react";
import styles from "./addTask.module.css"; // Add your CSS module
import { useRouter } from "next/navigation";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the list of users when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8009/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createTask = async () => {
    const requestBody = {
      title,
      description,
    };

    try {
      const response = await fetch("http://localhost:8009/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Add token
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Token:", localStorage.getItem("access_token"));
        const data = await response.json();
        console.log("Task created successfully:", data);

        // If assignedTo is provided, call the assign endpoint
        if (assignedTo) {
          console.log("Assigning task to:", assignedTo);
          console.log("Task ID:", data.task.id);
          await assignTask(data.task.id, assignedTo);
        }

        alert("Task created successfully!");
        router.push("/taskManagement");
      } else {
        console.error("Failed to create task:", response.status, response.statusText);
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task.");
    }
  };

  const assignTask = async (taskId, userId) => {
    try {
      const response = await fetch(`http://localhost:8009/tasks/${taskId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`

        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        console.log("Task assigned successfully");
      } else {
        console.error("Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add Task</h1>
      <table>
        <tbody>
          <tr>
            <td><label>Task Name:</label></td>
            <td>
              <input
                className={styles.input}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td><label>Description:</label></td>
            <td>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td><label>Status:</label></td>
            <td>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><label>Assigned To:</label></td>
            <td>
              <select
                className={styles.select}
                value={assignedTo}
                onClick={fetchUsers}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button className={styles.button} onClick={createTask}>
        Add Task
      </button>
    </div>
  );
};

export default AddTask;
