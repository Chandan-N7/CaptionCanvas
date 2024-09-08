import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./components/Main/Main";
import Caption from "./components/Caption/Caption";

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="header">
            <h1>Edit Images</h1>
          <div className="contact">
            <p>Chandan Singh Nagarkoti</p>
            <p>nagarkoti.dev7@gmail.com </p>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add-caption" element={<Caption />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
