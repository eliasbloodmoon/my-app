# Front End Website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

Requirements:

- Node.js
- Node package manager (NPM)

Dependencies are defined in the `package-lock.json` file.

Simply use `npm install` in the root project directory to install them all.

## File Structure

### .env

Stores environment variables/secrets.

### /public

Contains the core index.html file that processes the root, along with text resources.

### /src

Contains the .js files that hold our routes with index and App, along with the UserContext that is used to store user email locally throughout the project.

### /src/app

Contains store.js, which is used for authentication.

### /src/components

Contains FlexBetween.jsx, which is used for layouts in the rest of the project.

### /src/features/auth

Contains authSlice.js, which holds states used for logins and the dark/light mode.

### /src/state

Contrains files relating to states related to authetication and the API.

### /src/scenes/loginPage

Contaings the index that holds the information of our login page, Form which holds our login form, and the DDF logo used on the main page.

### /src/scenes/EmployeePage

Holds the code for the employee index, the page that is linked to the everyday user. Includes the tables and API calls.

### /src/scenes/AdministratorPage

Holds the code for the Administrator index, the page that is linked to the highest level users. Along with the tables and API calls, it also includes forms and buttons for adding users and editing information.

### /src/scenes/ManagerPage

Holds the code for the Manager index, that is linked to the Manager level role. This containts all the tables, buttons and API calls of the Admin page minus the edit and delete commands.

### /src/scenes/navbar

Holds the code for the framing navbar that wraps every page, which holds buttons relating to logging out and the dark and light mode.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

