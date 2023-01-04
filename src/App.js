import "./App.css";

import { Route, Routes } from "react-router-dom";
import Search from "./components/Search";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
