import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/joy';

function Navbar() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        backgroundColor: 'blue',
        color: 'white',
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
  );
}

export default Navbar;
