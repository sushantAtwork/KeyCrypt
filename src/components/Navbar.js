import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/joy';

function Navbar() {
  return (
    <>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: '#111518',
        height: '64px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        level="h6"
        component={Link}
        to="/"
        sx={{
          textDecoration: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.8rem'
        }}
      >
        KeyCrypt
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="soft"
          color="neutral"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          variant="soft"
          color="neutral"
          component={Link}
          to="/signup"
        >
          Signup
        </Button>
      </Box>
    </Box>
    <Divider sx={{height: '1.5px', color: 'white'}}/>
    </>
  );
}

export default Navbar;
