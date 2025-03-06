import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { doSignUp } from "../../service/loginService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Visibility,
  VisibilityOff,
  CalendarToday,
  PersonOutline,
  MailOutlined,
  LockOutlined,
  SensorOccupiedOutlined,
  Transgender,
} from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import dayjs from "dayjs";
import Navbar from "../NavBar";
import "./style.scss";

interface SignUpFormInputs {
  full_name: string;
  email: string;
  designation: string;
  gender: string;
  date_of_birth: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      data.date_of_birth = dayjs(data.date_of_birth).format("YYYY-MM-DD");
      const response = await doSignUp(data);
      if (response) {
        navigate("/otp", { state: { email: data.email } });
      }
    } catch (error) {
      console.error("Sign up Error:", error);
    }
  };

  return (
    <div className="h-screen bg-[#1E1B3A] text-white flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center lg:px-16 px-10 h-screen">
        <div className="w-[500px] bg-[var(--primary)] rounded-lg border border-[#555597]">
          <div className="py-14 px-8 shadow-lg rounded-lg w-full">
            <h4 className="relative text-center text-3xl font-bold text-white mb-4 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-5 after:w-48 after:h-[3px] after:bg-[#F85E00]">
              Create Account
            </h4>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-8 w-full">

              {/* Full Name */}
              <div className="relative w-full">
                <PersonOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("full_name", { required: "Full name is required" })}
                  className="w-full text-white rounded-md py-3 pl-12 px-5 focus:outline-none focus:ring-1 focus:ring-[#F85E00]"
                />
                {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
              </div>

              {/* Email */}
              <div className="relative w-full">
                <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full text-white rounded-md py-3 pl-12 px-5 focus:outline-none focus:ring-1 focus:ring-[#F85E00]"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Designation */}
              <div className="relative w-full">
                <SensorOccupiedOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="text"
                  placeholder="Designation"
                  {...register("designation", { required: "Designation is required" })}
                  className="w-full text-white rounded-md py-3 pl-12 px-5 focus:outline-none focus:ring-1 focus:ring-[#F85E00]"
                />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-2 w-full space-x-3">
                <div className="relative w-full">
                  <Controller
                    name="date_of_birth"
                    control={control}
                    rules={{ required: "Date of Birth is required" }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...field}
                          format="YYYY-MM-DD"
                          slotProps={{
                            textField: {
                              className: "w-full text-white rounded-md py-3 pl-12 px-5",
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarToday className="text-white" />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
                </div>

                <div className="relative w-full">
                  <Transgender className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                  <Select
                    {...register("gender", { required: "Gender is required" })}
                    displayEmpty
                    className="w-full text-white bg-[var(--input)] rounded-md py-3 pl-12 px-5 focus:outline-none focus:ring-1 focus:ring-[#F85E00]"
                  >
                    <MenuItem value="" disabled>
                      Gender
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText className="text-red-500">{errors.gender.message}</FormHelperText>}
                </div>
              </div>

              {/* Password */}
              <div className="relative w-full">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" },
                  })}
                  className="w-full text-white rounded-md py-3 pl-12 pr-10 focus:outline-none focus:ring-1 focus:ring-[#F85E00]"
                />
                <IconButton className="absolute right-5 top-1/2 transform -translate-y-1/2" onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff className="text-white" /> : <Visibility className="text-white" />}
                </IconButton>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <button type="submit" className="w-full bg-[var(--weight)] p-2 rounded-lg font-medium text-lg">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
