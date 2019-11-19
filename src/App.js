import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Import Screens
import LoginScreen from "./Screens/Login";
import HomeScreen from "./Screens/Home";

const App = () => {
  return (
    <Router>
      <Route path={"/"} exact component={LoginScreen} />
      <Route path={"/home"} component={HomeScreen} />
    </Router>
  );
};

export default App;
