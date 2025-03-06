import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { doLogin } from "../../service/loginService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import {
  Button,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "./styles.scss";
import Navbar from "../NavBar";

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await doLogin(data);
      if (response) {
        navigate("/home");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[#1E1B3A] text-white flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center lg:px-16 px-10 h-screen">
        <div className="w-[500px] bg-[var(--primary)] rounded-lg border border-[#555597] shadow-lg">
          <div className="py-14 px-8 w-full">
            <h4 className="relative text-center text-3xl font-bold text-white mb-6">
              Sign In
              <span className="block w-48 h-[3px] bg-[#F85E00] mx-auto mt-2"></span>
            </h4>

            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div className="relative">
                <MailOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="email"
                  placeholder="Email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full text-white bg-transparent border border-gray-400 rounded-md py-3 pl-12 px-5 focus:outline-none focus:ring-2 focus:ring-[#F85E00]"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div className="relative">
                <LockOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
                  className="w-full text-white bg-transparent border border-gray-400 rounded-md py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F85E00]"
                />
                <IconButton
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <Visibility className="text-gray-200" fontSize="small" />
                  ) : (
                    <VisibilityOff className="text-white" fontSize="small" />
                  )}
                </IconButton>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center px-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("rememberMe")}
                      size="small"
                      sx={{ color: "white", "&.Mui-checked": { color: "#F85E00" } }}
                    />
                  }
                  label="Remember Me"
                />
                <button
                  type="button"
                  className="text-[#F16A23] hover:underline text-sm"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#F85E00] p-3 rounded-lg font-medium text-lg text-white hover:bg-[#d95b00]"
              >
                Login
              </button>

              {/* Sign Up Link */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Typography variant="body2">Don't have an account?</Typography>
                <Button
                  variant="text"
                  sx={{ color: "#F85E00" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
