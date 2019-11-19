import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Import Pages
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Home";

const App = () => {
  return (
    <Router>
      <Route path={"/"} exact component={LoginPage} />
      <Route path={"/home"} component={HomePage} />
    </Router>
  );
};

export default App;
