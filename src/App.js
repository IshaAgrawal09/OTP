import "./App.css";
import Otp from "./components/Otp";
import OtpLayout from "./components/OtpLayout";
import Dashboard from "./components/Dashboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <Otp otpDigits={4} otpTime={10} /> */}
      <Routes>
        <Route path="/" element={<OtpLayout otpDigits={4} otpTime={10} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
