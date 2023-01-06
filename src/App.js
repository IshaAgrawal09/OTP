import "./App.css";

import { Route, Routes } from "react-router-dom";
import Search from "./components/Search";
import DatePicker from "./components/DatePicker";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search />} />
        {/* <Route path="/" element={<DatePicker />} /> */}
      </Routes>
    </div>
  );
}

export default App;
