import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Bookmarks from "./pages/Bookmarks";
import Reminders from "./pages/Reminders";
import PastContests from "./pages/PastContests";
import Login from "./pages/Login";
import About from "./pages/About";
import ContestPage from "./pages/ContestPage";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            {/* Add Toaster here */}
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/past-contests" element={<PastContests />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contest/:id" element={<ContestPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
