import { Box, Button, Checkbox, Container, Typography } from '@mui/joy';
import React, { useState } from 'react';
import CustomInput from '../components/CustomInput';
import '../assets/css/pages/Signup.css';
import { loginUser } from '../service/LoginApi';
import { useNavigate } from "react-router-dom";
import CustomSnackBar from '../components/CustomSnackBar';


export default function Login() {
  const [token, setToken] = useState('');
  const [response, setReponse] = useState();
  const [snackBar, setSnackBar] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
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
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !emailRegex.test(value) ? 'Invalid email address.' : '',
        }));
        break;
      case 'password':  // Changed to `password`
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: value.length < 6 ? 'Password is too short.' : '',
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
        const result = await loginUser(formData);
        setReponse(result);
        if (result.status === 200) {
          const newName = result.token;
          setToken(newName);
          localStorage.setItem('token', newName);
          navigate("/home");
          setSnackBar(true);
        }else{
          setSnackBar(true);
        }
      } catch (error) {
        console.error('Signup failed:', error);
      }
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  return (
    <Container className="container">
      <form onSubmit={handleSubmit}>
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
          title={'Password'}  // Changed to `Password`
          name={'password'}   // Changed to `password`
          type={'password'}   // Changed to `password` input type
          size={'lg'}
          value={formData.password}  // Changed to `password`
          onChange={handleInputChange}
          error={!!errors.password}  // Changed to `password`
          helperText={errors.password}  // Changed to `password`
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
      { response ?  <CustomSnackBar message={response.message} open={snackBar} onClose={() => setSnackBar(false)}/> : <></>}
    </Container>
  );
}
