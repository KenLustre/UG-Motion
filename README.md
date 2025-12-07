# UGMotion - Fitness & Wellness Tracker

<p align="center">
  <img src="UGMotion/assets/images/LoginLogo.png" alt="UGMotion Logo" width="200"/>
</p>

<p align="center">
  Your all-in-one mobile companion for tracking workouts, nutrition, and overall wellness. Built with React Native and Expo.
</p>

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
  - [For Users](#for-users)
  - [For Admins](#for-admins)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [User Login](#user-login)
  - [Admin Login](#admin-login)
- [Built With](#built-with)

---

## About The Project

UGMotion is An all-in-one Fitness mobile application called UG Motion using react-native framework. It is designed to help users take control of their health and wellness journey. It provides a suite of tools for tracking daily nutritional intake, planning and executing workout routines, and monitoring key health metrics like BMI.

The application features a dark-themed, user-friendly interface that makes it easy to log data and visualize progress over time. It also includes a secure admin panel for user management.

---

## Key Features

### For Users

- **Dashboard Summary:** A centralized view of daily progress for water intake, protein, calories, steps, and sleep.
- **Nutrient Tracking:** Dedicated screens to log and monitor daily Water, Calorie, and Protein intake against set targets.
- **Workout Planner:** Create custom weekly workout plans based on split types (PPL, Upper/Lower) and available equipment.
- **Interactive Calendar:** View and manage daily workout activities, marking them as complete.
- **BMI Calculator:** Calculate and track Body Mass Index based on user profile data.
- **User Profile Management:** Edit personal details like name, age, height, weight, and profile picture.
- **Secure Authentication:** A robust login system to keep user data private.

### For Admins

- **Admin Dashboard:** A separate, secure interface for managing all users in the database.
- **User Management:** View a table of all registered users with their User ID.
- **CRUD Operations:**
  - **Add:** Create new user accounts with a username and password.
  - **Delete:** Securely delete user accounts with a confirmation prompt.
  - **Undo:** Restore the most recently deleted user. This action is temporary and resets on logout.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and the Expo Go app on your mobile device.
- **Node.js:** [https://nodejs.org/](https://nodejs.org/)
- **Expo Go (iOS/Android):** Available on the App Store and Google Play Store.

You will also need the Expo CLI installed globally on your machine:
```sh
npm install -g expo-cli
```

### Installation

1.  Clone the repository to your local machine.
    ```sh
    git clone https://github.com/your-username/UGMotion.git
    ```
2.  Navigate to the project directory.
    ```sh
    cd UGMotion
    ```
3.  Install NPM packages.
    ```sh
    npm install
    ```
4.  Start the development server.
    ```sh
    npx expo start
    ```
5.  Scan the QR code with the Expo Go app on your phone.
---

## Usage

The application serves two primary roles: a regular user and an administrator.

### User Login

Regular users can log in with the credentials created for them by an administrator. Upon logging in, they will be directed to their personal dashboard.

### Admin Login

To access the administrative panel, use the following credentials on the main login screen:
- **Username:** `Admin`
- **Password:** `Admin123`

---

## Built With

- React Native
- Expo
- Expo Router
- Expo SQLite
