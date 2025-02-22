# Track My Tasks (Client & Server Side)

Track My Tasks is a task management application where users can add, edit, and update their tasks. It supports **drag-and-drop** functionality and real-time synchronization.

## 🔗 Live Links

- **Live site:** [https://track-my-tasks.web.app](https://track-my-tasks.web.app)
- **Client Repo:** [https://github.com/Sushanto171/track-tasks](https://github.com/Sushanto171/track-tasks)
- **Server Repo:** [https://github.com/Sushanto171/track-task-server](https://github.com/Sushanto171/track-task-server)

---

## 🎯 Features

✅ **Task Management:** Add, edit, delete, and update tasks.  
✅ **Drag & Drop Support:** Easily move tasks between categories.  
✅ **Real-time Updates:** Instantly see changes via **Socket.io**.  
✅ **Authentication:** Secure user login/signup with **Firebase Auth**.  
✅ **Dark Mode:** Supports both dark and light themes.  
✅ **REST API:** Fully functional backend API with database connectivity.

---

## 🚀 Installation & Setup

### **Client Setup**

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/track-my-tasks.git
   cd track-my-tasks/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### **Server Setup**

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/track-my-tasks.git
   cd track-my-tasks/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure environment variables:
   ```sh
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the server:
   ```sh
   npm start
   ```

---

## 📦 Dependencies

### **Client**

- `@dnd-kit/core` - For drag-and-drop task management.
- `@tanstack/react-query` - For efficient data fetching and caching.
- `axios` - For API requests.
- `firebase` - For authentication and hosting.
- `socket.io-client` - For **real-time** updates.
- `react-router` - For client-side routing.
- `tailwindcss` - For styling.

### **Server**

- `express` - Backend framework.
- `mongodb` & `mongoose` - Database and ODM.
- `cors` - To handle cross-origin requests.
- `dotenv` - To manage environment variables.
- `socket.io` - For **real-time** updates.

---

## 🛠 Technologies Used

- **Frontend:** React.js, TailwindCSS, Firebase
- **Backend:** Node.js, Express.js, MongoDB
- **Real-time Updates:** Socket.io
- **State Management:** React Query

---

## 👨‍💻 Contribution

Feel free to contribute! If you have a new feature idea, submit a **Pull Request**. 😊

---
