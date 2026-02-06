import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import WhatsAppGroupPage from "./WhatsAppGroupPage"; // Your main file
import Admincode8 from "./Admincode8"; // The new admin file

function App() {
  return (
    <BrowserRouter>
      <Analytics />
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
