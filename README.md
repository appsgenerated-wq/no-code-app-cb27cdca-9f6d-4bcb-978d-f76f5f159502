# MonkeyLog: A Manifest-Powered Application

MonkeyLog is a web application for enthusiasts and researchers to document and share monkey sightings. Users can create an account, log new sightings with details and photos, and browse a public gallery of all submissions.

This project is built entirely with a React frontend and a **Manifest** backend, demonstrating a complete full-stack solution using only the Manifest platform and its SDK.

## Features

- **User Authentication**: Secure user signup and login handled by Manifest.
- **Sighting Management**: Create, Read, Update, and Delete (CRUD) monkey sightings.
- **Image Uploads**: Attach photos to sightings using Manifest's built-in file storage.
- **Role-Based Access**: Simple roles (Researcher, Enthusiast) managed through Manifest policies.
- **Ownership Control**: Users can only edit or delete their own submissions.
- **Dynamic Frontend**: A responsive and interactive UI built with React and Tailwind CSS.
- **Auto-Generated Admin Panel**: Comes with a complete admin interface for managing users and data.

## Tech Stack

- **Backend**: Manifest (handling database, API, authentication, file storage, and business logic).
- **Frontend**: React, Vite.
- **Styling**: Tailwind CSS.
- **SDK**: `@mnfst/sdk` for all frontend-backend communication.
