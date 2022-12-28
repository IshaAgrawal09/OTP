import "./App.css";
import Otp from "./components/Otp";

function App() {
  return (
    <div className="App">
      <Otp otpDigits={5} otpTime={10} />
    </div>
  );
}

export default App;
