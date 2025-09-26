import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import PastContests from "./pages/PastContests";
import Login from "./pages/Login";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Chatbot from "./components/Chatbot";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Toaster position="top-right" reverseOrder={false} />
            <Chatbot />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/past-contests" element={<PastContests />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
