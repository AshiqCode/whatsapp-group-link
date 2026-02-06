import { BrowserRouter, Routes, Route } from "react-router-dom";
import WhatsAppGroupPage from "./WhatsAppGroupPage"; // Your main file
import Admincode8 from "./Admincode8"; // The new admin file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public User Page */}
        <Route path="/" element={<WhatsAppGroupPage />} />

        {/* Admin Dashboard - Accessible via /admin */}
        <Route path="/Admincode8" element={<Admincode8 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
