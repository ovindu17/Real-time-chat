# Real-time Chat Application

A full-stack real-time chat application with a responsive frontend and backend component. This application allows users to register, login, create profiles, match with other users, and engage in real-time messaging.

## Project Structure

- **front/** - React-based frontend application
- **back/** - Express.js and Socket.io backend server

## Features

- **User Authentication**: Register, login, and JWT-based authentication
- **User Profiles**: Create and edit user profiles with age, gender, and interests
- **Real-time Messaging**: Instant messaging between users using Socket.io
- **User Matching**: Find and connect with other users based on profiles
- **Responsive Design**: Mobile-friendly interface that adapts to different screen sizes

## Technologies Used

### Frontend
- **React**: JavaScript library for building the user interface
- **React Router**: For navigation and routing within the application
- **Axios**: For making HTTP requests to the backend API
- **Socket.io Client**: For real-time communication with the server
- **JWT Decode**: For handling JSON Web Tokens
- **Font Awesome**: For icons and UI elements
- **CSS**: Custom styling for components

### Backend
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user data and messages
- **Mongoose**: MongoDB object modeling for Node.js
- **Socket.io**: For real-time, bidirectional communication
- **JSON Web Token (JWT)**: For secure authentication
- **CORS**: For handling Cross-Origin Resource Sharing
- **Body Parser**: For parsing incoming request bodies

### Database Models
- **User**: Stores user information including username, email, password, and profile details (age, gender, interests)
- **Message**: Stores chat messages with sender, recipient, content, and timestamp

## Application Flow

1. Users register or login to access the application
2. After authentication, users can view and edit their profiles
3. Users can browse other profiles and find potential matches
4. Users can initiate conversations with other users
5. Real-time messaging allows for instant communication
6. Messages are stored in the database for persistent chat history

## API Endpoints

### User Routes
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Authenticate a user and receive a JWT
- `GET /api/users/profile`: Get the current user's profile (protected)
- `PUT /api/users/profile`: Update the current user's profile (protected)
- `GET /api/users/all-users`: Get all users except the current user (protected)

### Message Routes
- `GET /api/messages/chat-users`: Get users with chat history (protected)
- `GET /api/messages/:recipientId`: Get chat messages between two users (protected)
- `POST /api/messages/send`: Send a message to another user (protected)

## Socket.io Events
- `connection`: When a user connects to the server
- `join`: When a user joins their personal room
- `new_message`: When a user sends a new message
- `receive_message`: When a user receives a message
- `disconnect`: When a user disconnects from the server

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository
   ```
   git clone https://github.com/YOUR_USERNAME/Real-time-chat.git
   cd Real-time-chat
   ```

2. Install dependencies for the backend
   ```
   cd back
   npm install
   ```

3. Configure the backend
   - Create a `.env` file in the `back` directory
   - Add your MongoDB connection string and JWT secret:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=3000
     ```

4. Install dependencies for the frontend
   ```
   cd ../front
   npm install
   ```

5. Configure the frontend
   - Create a `.env` file in the `front` directory
   - Add your backend API URL:
     ```
     REACT_APP_API_URL=http://localhost:3000/api
     REACT_APP_SOCKET_URL=http://localhost:3000
     ```

### Running the Application

1. Start the backend server
   ```
   cd back
   npm start
   ```

2. In a new terminal, start the frontend application
   ```
   cd front
   npm start
   ```

3. Access the application at `http://localhost:3000` in your browser

## Deployment

The application is configured for deployment on platforms like Render:
- Frontend is deployed at: https://frontend-fvyq.onrender.com
- Backend is configured to accept connections from the deployed frontend

## Future Enhancements

- Enhanced profile customization
- Image and file sharing in chats
- Group chat functionality
- Read receipts and typing indicators
- Push notifications for new messages
- Advanced user matching algorithms using LLM APIs


 
