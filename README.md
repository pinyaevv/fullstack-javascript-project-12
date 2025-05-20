### Hexlet tests and linter status:
[![Actions Status](https://github.com/pinyaevv/fullstack-javascript-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/pinyaevv/fullstack-javascript-project-12/actions)

# Slack-Style Chat Application

A real-time chat application developed as part of the Hexlet curriculum. This project demonstrates the integration of modern interface tools and technologies to create a dynamic chat interface.

## Features

- **User Authentication** – Secure sign-up and login
- **Real-Time Messaging** – Instant message delivery via WebSockets
- **Channel Management** – Create, rename, and delete channels
- **Message Moderation** – Profanity filter using `leo-profanity`
- **Form Validation** – Forms powered by Formik and Yup
- **Error Tracking** – Integrated Rollbar for production error reporting

## Technologies Used

- **Frontend**:
  - React (with Hooks)
  - Redux Toolkit
  - React Router DOM
  - Axios
  - Formik + Yup
  - React Bootstrap
  - React Toastify
  - i18next
  - leo-profanity
- **WebSockets**: socket.io-client
- **Development Tools**:
  - Vite
  - ESLint (Airbnb config)
  - Rollbar

## Installation

### Prerequisites

- Node.js >= 14
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:pinyaevv/fullstack-javascript-project-12.git

2. Install dependencies:

   make install

3. Build for production:

   make build

4. Start server:

   make start

5. Run linter::

   make lint

Make sure the backend server is running at http://localhost:5001.
