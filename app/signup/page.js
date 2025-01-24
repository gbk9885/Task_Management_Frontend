"use client";
import React, { useState } from "react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
 const router = useRouter();
 const [error, setError] = useState("");
 const [formData, setFormData] = useState({
   username: "",
   email: "",
   password: "",
   role: ""
 });

 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData({ ...formData, [name]: value });
 };

 const handleSignUp = async (e) => {
   e.preventDefault();
   setError("");
   
   try {
     const response = await fetch("http://localhost:8009/register", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         username: formData.username,
         email: formData.email,
         password: formData.password,
         role_name: formData.role
       }),
     });

     const data = await response.json();
     
     if (response.ok) {
       router.push("/dashboard");
     } else {
       setError(data.message || "Registration failed");
     }
   } catch (err) {
     setError("Failed to connect to server");
   }
 };

 return (
   <div className={styles.container}>
     <div className={styles.signupSection}>
       <h2 className={styles.label}>Create an Account</h2>
       <form onSubmit={handleSignUp}>
         {error && <div className={styles.error}>{error}</div>}
         
         <div className={styles.formGroup}>
           <label className={styles.label} htmlFor="username">Username</label>
           <input 
             className={styles.textFiled}
             type="text"
             id="username"
             name="username"
             placeholder="Enter your username"
             value={formData.username}
             onChange={handleInputChange}
             required
           />
         </div>

         <div className={styles.formGroup}>
           <label className={styles.label} htmlFor="email">Email</label>
           <input 
             className={styles.textFiled}
             type="email"
             id="email"
             name="email"
             placeholder="Enter your email"
             value={formData.email}
             onChange={handleInputChange}
             required
           />
         </div>

         <div className={styles.formGroup}>
           <label className={styles.label} htmlFor="password">Password</label>
           <input 
             className={styles.textFiled}
             type="password"
             id="password"
             name="password"
             placeholder="Enter your password"
             value={formData.password}
             onChange={handleInputChange}
             required
           />
         </div>

         <div className={styles.formGroup}>
           <label className={styles.label} htmlFor="role">Role</label>
           <select 
             className={styles.textFiled}
             id="role"
             name="role"
             value={formData.role}
             onChange={handleInputChange}
             required
           >
             <option value="" disabled>Select Role</option>
             <option value="Admin">Admin</option>
             <option value="Manager">Manager</option>
             <option value="User">User</option>
           </select>
         </div>

         <button type="submit" className={styles.signupButton}>
           Sign Up
         </button>
       </form>

       <div className={styles.footer}>
         Already have an account?{" "}
         <span onClick={() => router.push("/")} role="button" tabIndex="0">
           <a href="/">Sign In</a>
         </span>
       </div>
     </div>
   </div>
 );
};

export default SignUpPage;