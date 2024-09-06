import { Box, Button, Checkbox, Container, Typography } from '@mui/joy';
import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import '../assets/css/pages/Signup.css';
import { signupUser } from '../service/SignupApi';
import { useNavigate, Link } from "react-router-dom";
import CustomSnackBar from '../components/CustomSnackBar';
import Navbar from '../components/Navbar';

export default function Signup() {

  const [token, setToken] = useState('');

  const navigate = useNavigate();

  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone_number: '',
    hashed_password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    username: '',
    phone_number: '',
    hashed_password: '',
    confirmPassword: '',
    termsAccepted: '',
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
      termsAccepted: e.target.checked ? '' : 'You must accept the terms.',
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: value.length < 2 ? 'Name is too short.' : '',
        }));
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !emailRegex.test(value) ? 'Invalid email address.' : '',
        }));
        break;
      case 'hashed_password':
        setErrors((prevErrors) => ({
          ...prevErrors,
          hashed_password: value.length < 6 ? 'hashed_password is too short.' : '',
        }));
        break;
      case 'confirmPassword':
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: value !== formData.hashed_password ? 'hashed_passwords do not match.' : '',
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).every((error) => error === '') && formData.termsAccepted) {
      try {
        console.log(formData)
        const result = await signupUser(formData);
        if (result) {
          console.log('Signup successful', result);
          const newName = result.token;
          setToken(newName);
          localStorage.setItem('token', newName);
          setSnackBar({
            open: true,
            message: result.message || `Welcome ${result.username}!!!`,
            color: "success",
          });
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      } catch (error) {
        console.error('Signup failed:', error);
      }
    } else {
      alert('Please fix the errors before submitting.');
    }
  };


  return (
    <div>
      <Navbar />
      <Container className="container">
        <form onSubmit={handleSubmit}>
          <CustomInput
            title={'Name'}
            name={'name'}
            type={'text'}
            size={'lg'}
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <CustomInput
            title={'Email'}
            name={'email'}
            type={'email'}
            size={'lg'}
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <CustomInput
            title={'User Name'}
            name={'username'}
            type={'text'}
            size={'lg'}
            value={formData.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <CustomInput
            title={'Phone Number'}
            name={'phone_number'}
            type={'text'}
            size={'lg'}
            value={formData.phone_number}
            onChange={handleInputChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          <CustomInput
            title={'hashed_password'}
            name={'hashed_password'}
            type={'hashed_password'}
            size={'lg'}
            value={formData.hashed_password}
            onChange={handleInputChange}
            error={!!errors.hashed_password}
            helperText={errors.hashed_password}
          />
          <CustomInput
            title={'Confirm hashed_password'}
            name={'confirmPassword'}
            type={'hashed_password'}
            size={'lg'}
            hint={'Min. 8'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', margin: '5px 20px' }}>
            <Checkbox
              name={'termsAccepted'}
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
            />
            <Typography sx={{ marginLeft: '8px' }}>
              Accept terms and conditions
            </Typography>
            {errors.termsAccepted && <Typography color="error">{errors.termsAccepted}</Typography>}
          </Box>

          <Box width={'50%'}>
            <Button
              variant='soft'
              sx={{ margin: '3rem 10px' }}
              fullWidth
              type='submit'
              disabled={!formData.termsAccepted || Object.values(errors).some(Boolean)}
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
      </Container>
    </div>
  );
}
