import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // Now using the shared Auth.css file
import { useState } from "react";
import { toast } from "react-toastify";
import { UserData } from "../models/UserData";
import { UserService } from "../service/UserService";
import { AuthImage } from "../components/AuthImage";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState<UserData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    UserService.loginUser(formData)
      .then((data) => {
        login(data.token, data.user);
        toast.success("Login successful!", {
          position: "top-center",
        });
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((errorMessage: string) => {
        toast.error(errorMessage, {
          position: "top-center",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-container">
      <AuthImage />
      <div className="auth-form">
        <h2>Login to Coupon Hub</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              name="password"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            Login
          </button>
        </form>
        <p className="auth-text">
          New here?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
