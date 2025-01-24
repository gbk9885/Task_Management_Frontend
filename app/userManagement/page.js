"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa"; // Importing the user icon
import styles from "../taskManagement/taskManagement.module.css"; // Reusing the same CSS

const UserManagement = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/");
      return;
    }

    setUserRole(user.role);
    setUserName(user.username);

    // Fetch users
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8009/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
   
      if (response.ok) {
        const data = await response.json();
        // Access the users array from the response
        setUsers(data.users); 
      } else {
        setError("Failed to fetch users");
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

  const handleRowClick = (userId) => {
    router.push(`/user/${userId}`);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h1>User Management</h1>
        <nav>
          <a href="/dashboard">Home</a>
          {/* <a href="/profile">Profile</a> */}
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

      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleRowClick(user.id)}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
