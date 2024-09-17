import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import logo from '../images/logo.png'; 

const Header = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        backgroundColor: '#333',
        color: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src={logo} alt="Logo" sx={{ height: '40px', marginRight: '1rem' }} />
        <Typography variant="h4">ChatData</Typography>
      </Box>
      
      <Box>
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
