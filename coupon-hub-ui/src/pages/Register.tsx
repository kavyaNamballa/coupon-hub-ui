import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useState } from "react";
import { UserService } from "../service/UserService";
import { UserData } from "../models/UserData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthImage } from "../components/AuthImage";

const Register = () => {
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    UserService.registerUser(formData)
      .then((data) => {
        toast.success("Registration successful! Please login to continue.", {
          position: "top-center",
        });
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((errorMessage) => {
        toast.error(errorMessage, {
          position: "top-center",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-container">
      {/* Left Side - Coupon Image */}
      <AuthImage />

      {/* Right Side - Registration Form */}
      <div className="auth-form">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              required
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              name="lastName"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            Register
          </button>
        </form>
        <p className="auth-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
