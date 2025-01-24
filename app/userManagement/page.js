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
    const mockUsers = [
      { id: 1, name: "Alice Johnson", role: "Admin", email: "alice@example.com" },
      { id: 2, name: "Bob Smith", role: "Manager", email: "bob@example.com" },
      { id: 3, name: "Charlie Brown", role: "User", email: "charlie@example.com" },
      { id: 4, name: "Diana Prince", role: "User", email: "diana@example.com" },
    ];
    setUsers(mockUsers);
    setIsLoading(false);
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
