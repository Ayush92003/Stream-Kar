import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnBoardingPage from "./pages/OnBoardingPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-screen" data-theme="night">
      <button onClick={() => toast.success("Hello world!")} className="btn">
        Create a toast
      </button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnBoardingPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
