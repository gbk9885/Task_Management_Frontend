// app/task/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import styles from "../../taskManagement/taskManagement.module.css";

const TaskDetail = ({ params }) => {
 const taskId = React.use(params).taskId;
 const router = useRouter();
 const [task, setTask] = useState(null);
 const [editMode, setEditMode] = useState(false);
 const [editedTask, setEditedTask] = useState(null);
 const [userRole, setUserRole] = useState("");
 const [userName, setUserName] = useState("");
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
   fetchTaskDetails();
 }, [taskId]);

 const fetchTaskDetails = async () => {
   try {
     const response = await fetch(`http://localhost:8009/tasks/${taskId}`, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("access_token")}`
       }
     });

     if (response.ok) {
       const data = await response.json();
       setTask(data);
       setEditedTask(data);
     } else {
       setError("Failed to fetch task details");
     }
   } catch (err) {
     setError("Error connecting to server");
   } finally {
     setIsLoading(false);
   }
 };

 const handleUserClick = () => {
   setShowDropdown(!showDropdown);
 };

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setEditedTask(prev => ({
     ...prev,
     [name]: value
   }));
 };

 const handleSave = async () => {
   try {
     const response = await fetch(`http://localhost:8009/tasks/${taskId}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${localStorage.getItem("access_token")}`
       },
       body: JSON.stringify({
         title: editedTask.title,
         description: editedTask.description,
         status: editedTask.status,
         username: editedTask.username
       })
     });

     if (response.ok) {
       setTask(editedTask);
       setEditMode(false);
       fetchTaskDetails(); // Refresh data after update
     } else {
       setError("Failed to update task");
     }
   } catch (err) {
     setError("Error connecting to server");
   }
 };

 if (isLoading) return <div className={styles.loading}>Loading task details...</div>;
 if (error) return <div className={styles.error}>{error}</div>;
 if (!task) return <div className={styles.error}>Task not found!</div>;

 return (
   <div className={styles.container}>
     <div className={styles.dashboardHeader}>
       <h1>Task Details</h1>
       <nav className={styles.navLinks}>
         <a href="/dashboard">Home</a>
         <a href="/taskManagement">Back to Tasks</a>
         {!editMode  && 
           <button className={styles.editButton} onClick={() => setEditMode(true)}>
             Edit Task 
           </button>
         }
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

     <div className={styles.taskDetails}>
       {editMode ? (
         <>
           <table className={styles.taskTable}>
          <tbody>
            <tr>
              <td className={styles.label}>Task Name:</td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.label}>Status:</td>
              <td>
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className={styles.label}>Description:</td>
              <td>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.label}>Assigned To:</td>
              <td>
                <input
                  type="text"
                  name="username"
                  value={editedTask.username}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </td>
            </tr>
          </tbody>
          </table>
          <div className={styles.buttonRow}>
          <button className={styles.saveButton} onClick={handleSave}>Save</button>
          <button className={styles.cancelButton} onClick={() => {
            setEditMode(false);
            setEditedTask(task);
          }}>Cancel</button>
          </div>
         </>
       ) : (
        <table className={styles.taskTable}>
        <tbody>
          <tr>
            <td className={styles.label}>Task Name:</td>
            <td className={styles.value}>{task.title}</td>
          </tr>
          <tr>
            <td className={styles.label}>Status:</td>
            <td className={styles.value}>{task.status}</td>
          </tr>
          <tr>
            <td className={styles.label}>Description:</td>
            <td className={styles.value}>{task.description}</td>
          </tr>
          <tr>
            <td className={styles.label}>Assigned To:</td>
            <td className={styles.value}>{task.username}</td>
          </tr>
          <tr>
            <td className={styles.label}>Created Date:</td>
            <td className={styles.value}>{task.created_at}</td>
          </tr>
        </tbody>
       </table>
       )}
     </div>
   </div>
 );
};

export default TaskDetail;