"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa"; // Using a user icon from react-icons
import styles from "./dashboard.module.css"; // Importing the CSS Module

const Dashboard = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState(""); // New state for tracking active section
  const [taskStats, setTaskStats] = useState({
    new: 0,
    pending: 0,
    completed: 0,
    in_progress: 0,
  }); // State for task statistics

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // Redirect to login if no user is found
      router.push("/");
      return;
    }

    setUserRole(user.role);
    setUserName(user.username);

    // Fetch task stats
    fetchTaskStats();

    setIsLoading(false);
  }, [router]);

  const fetchTaskStats = async () => {
    try {
      const response = await fetch("http://localhost:8009/tasks/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTaskStats(data); // Update task stats state
      } else {
        console.error("Failed to fetch task stats");
      }
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  const handleUserClick = () => {
    setShowDropdown((prevState) => !prevState);
  };

  // Handle redirection and setting active section
  const handleSectionClick = (section) => {
    setActiveSection(section); // Set active section
    if (section === "Task Management") {
      router.push("/taskManagement"); // Redirect to task management page
    } else if (section === "User Management") {
      router.push("/userManagement"); // Redirect to user management page for Admin
    }
  };

  // Sign out functionality
  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");

    // Redirect to login page
    router.push("/");
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Task Management</h1>
        <nav className={styles.navLinks}>
          <a href="/">Home</a>
          {/* Sign Out Button next to Home */}
          <button className={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
        {/* User Icon */}
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

      <div className={styles.dashboardContent}>
        {/* Home Screen Section */}
        <div className={styles.homeScreen}>
          <div className={styles.welcomeText}>
            Welcome, {userName}!
          </div>
          <p>Here's a quick overview of your tasks and activities:</p>

          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <h3>New Tasks</h3>
              <p>{taskStats.new} Tasks</p>
            </div>
            <div className={styles.statItem}>
              <h3>Pending</h3>
              <p>{taskStats.pending} Tasks</p>
            </div>
            <div className={styles.statItem}>
              <h3>Completed</h3>
              <p>{taskStats.completed} Tasks</p>
            </div>
            <div className={styles.statItem}>
              <h3>In Progress</h3>
              <p>{taskStats.in_progress} Tasks</p>
            </div>
          </div>
        </div>

        {/* Role-Specific Sections */}
        {userRole === "Admin" && (
          <div className={styles.dashboardSection}>
            <h2>Admin Dashboard</h2>
            <p
              className={activeSection === "Task Management" ? styles.activeLink : ""}
              onClick={() => handleSectionClick("Task Management")}
            >
              Task Management
            </p>
            <p
              className={activeSection === "User Management" ? styles.activeLink : ""}
              onClick={() => handleSectionClick("User Management")}
            >
              User Management
            </p>
          </div>
        )}
        {userRole === "Manager" && (
          <div className={styles.dashboardSection}>
            <h2>Manager Dashboard</h2>
            <p
              className={activeSection === "Task Management" ? styles.activeLink : ""}
              onClick={() => handleSectionClick("Task Management")}
            >
              Manage Tasks
            </p>
            <p
              className={activeSection === "User Management" ? styles.activeLink : ""}
              onClick={() => handleSectionClick("User Management")}
            >
              User Management
            </p>
          </div>
        )}
        {userRole === "User" && (
          <div className={styles.dashboardSection}>
            <h2>User Dashboard</h2>
            <p
              className={activeSection === "Task Management" ? styles.activeLink : ""}
              onClick={() => handleSectionClick("Task Management")}
            >
              Task Management
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
