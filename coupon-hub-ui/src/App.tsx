import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CouponsPage } from "./pages/CouponsPage";
import Profile from "./pages/Profile";
import WishlistPage from "./pages/WishlistPage";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-center" autoClose={3000} />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
