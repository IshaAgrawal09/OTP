import "./App.css";
import OtpLayout from "./components/OtpLayout";
import Dashboard from "./components/Dashboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<OtpLayout otpDigits={4} otpTime={10} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
