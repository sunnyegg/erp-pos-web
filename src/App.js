import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";

// Import Screens
import LoginScreen from "./Screens/Login";

const App = () => {
  return (
    <Router>
      <Route path={"/"} exact component={LoginScreen} />
    </Router>
  );
};

export default App;
