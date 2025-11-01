import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FareComparePage from "./pages/fare-compare";
import MapView from "./components/MapView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FareComparePage />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </Router>
  );
}

export default App;