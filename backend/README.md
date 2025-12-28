# Life Space Backend

This is the backend for the Life Space music streaming web app. It is built with Node.js, Express, MongoDB, and uses JSON Web Tokens (JWT) for authentication.

## Features

*   **User Authentication**: Secure Sign Up & Login using JWT. Passwords are hashed using bcrypt.
*   **Music Management (Uploads)**: Users can upload their own MP3 files. Multer and Cloudinary are used to handle file storage.
*   **Playlist System**: Users can create playlists and set them as public or private. Public playlists display "Made by [Username]".
*   **Library Logic**: Users can have a "Liked Songs" collection and can add both "Global Songs" and their "Uploaded Songs" to their playlists.

## Getting Started

### Prerequisites

*   Node.js
*   npm
*   MongoDB

### Installation

1.  Clone the repo
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and add the following:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
4.  Create an `uploads` directory in the `backend` folder.
5.  Start the server
    ```sh
    npm start
    ```

## API Endpoints

*   `POST /api/auth/register`
*   `POST /api/auth/login`
*   `POST /api/songs/upload` (Protected)
*   `POST /api/playlists` (Protected)
*   `GET /api/playlists/public`
