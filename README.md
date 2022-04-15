# Teamspace
Teamspace is a project for my final year dissertation. It is designed to improve the online collaboration experience.

How to Run Code 

## Important to change URL to Network Address if using two seperate machines to test
## Localhost is fine for testing on single machine

Download or Clone repository

To Run Teamspace Front End:

```cd teamspace```

```npm install ```

```npm start```

 ```json
 "dependencies": {
    "@babel/core": "^7.17.5",
    "@babel/preset-env": "^7.16.11",
    "@fortawesome/fontawesome": "^1.1.8",
    "@fortawesome/fontawesome-free-regular": "^5.0.13",
    "@fortawesome/fontawesome-free-solid": "^5.0.13",
    "@fortawesome/fontawesome-svg-core": "^1.3.0",
    "@fortawesome/react-fontawesome": "^0.1.17",
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "bootstrap": "^5.1.3",
    "express": "^4.17.3",
    "firebase": "^9.6.5",
    "firebase-admin": "^10.0.2",
    "font-awesome": "^4.7.0",
    "moment": "^2.29.1",
    "moment-timezone": "^0.5.34",
    "quill": "^1.3.6",
    "react": "^17.0.2",
    "react-bootstrap": "^2.1.1",
    "react-dom": "^17.0.2",
    "react-firebase-hooks": "^5.0.3",
    "react-horizontal-scrolling-menu": "^2.7.1",
    "react-quill": "^1.3.5",
    "react-router": "^6.2.1",
    "react-router-dom": "^6.2.1",
    "react-scripts": "5.0.0",
    "react-tooltip": "^4.2.21",
    "socket.io": "^4.4.1",
    "socket.io-client": "^4.4.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.6",
    "jest": "^27.5.1",
    "react-test-renderer": "^18.0.0"
  } 
  ```

If page doesnt load, enter URL localhost:3000/login where you will be presented with login form.


To run Teamspace server: 

```cd server```

```npm install```

```nodemon server.js / npm run devStart```

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "devStart": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "node-fetch": "^2.6.7",
    "nodemon": "^2.0.15",
    "socket.io": "^4.4.1"
  }
}
```


