import { Box, Button, Checkbox, Container, Typography } from "@mui/joy";
import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import "../assets/css/pages/Signup.css";
import { loginUser } from "../service/LoginApi";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "../components/CustomSnackBar";
import Navbar from "../components/Navbar";
import { BarLoader, BeatLoader, BounceLoader, CircleLoader, ClimbingBoxLoader, ClipLoader, ClockLoader, DotLoader, FadeLoader, GridLoader, MoonLoader, PulseLoader, RiseLoader, ScaleLoader, SyncLoader } from 'react-spinners';

//['primary', 'neutral', 'danger', 'success', 'warning']

export default function Login() {
  const [token, setToken] = useState("");
  const [loading, isLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    color: "",
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked,
    });
    setErrors({
      ...errors,
      termsAccepted: e.target.checked ? "" : "You must accept the terms.",
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !emailRegex.test(value) ? "Invalid email address." : "",
        }));
        break;
      case "password":
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: value.length < 6 ? "Password is too short." : "",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    isLoading(true);
    e.preventDefault();
    if (
      Object.values(errors).some((error) => error !== "") ||
      !formData.termsAccepted
    ) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const result = await loginUser(formData);
      if (result.token !== undefined) {
        const token = result.token;
        setToken(token);
        localStorage.setItem("token", token);
        setSnackBar({
          open: true,
          message: result.message || `Welcome ${result.response.username}!!!`,
          color: "success",
        });
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setSnackBar({
          open: true,
          message: result.message || "Login failed!",
          color: "danger",
        });
      }
    } catch (error) {
      setSnackBar({
        open: true,
        message: "Login failed!",
        color: "danger",
      });
    } finally {
      isLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {loading ?
        <Box sx={{display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          width: '100%',
          opacity: 1}}>
          <CircleLoader size={150} color="#9C75FE" />
        </Box>
        :
        <Container className="container">
          <form onSubmit={handleSubmit}>
            <CustomInput
              title={"Email"}
              name={"email"}
              type={"email"}
              size={"lg"}
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <CustomInput
              title={"Password"}
              name={"password"}
              type={"password"}
              size={"lg"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Box mt={2}>
              <Checkbox
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                label="I accept the terms and conditions"
              />
              {errors.termsAccepted && (
                <Typography color="error">{errors.termsAccepted}</Typography>
              )}
            </Box>
            <Box width={"50%"}>
              <Button
                variant="soft"
                sx={{ margin: "3rem 10px" }}
                fullWidth
                type="submit"
                disabled={
                  !formData.termsAccepted || Object.values(errors).some(Boolean)
                }
              >
                Sign Up
              </Button>
            </Box>
          </form>

          {snackBar.open && (
            <CustomSnackBar
              message={snackBar.message}
              open={snackBar.open}
              color={snackBar.severity}
              onClose={() => setSnackBar({ ...snackBar, open: false })}
            />
          )}
        </Container>}
    </div>
  );
}
