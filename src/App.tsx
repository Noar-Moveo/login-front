import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import SignUp from "./pages/SignUp/SignUp";
import SuccessPage from "./pages/SuccessPage/SuccessPage"; 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/success" element={<SuccessPage />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
