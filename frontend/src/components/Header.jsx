import React from 'react';
import { Box } from '@mui/material';

import logo from '../images/logo.png'; 

const Header = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        borderBottom: `1px solid #e2e8f0`,
        color: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src={logo} alt="Logo" sx={{ height: '40px', marginRight: '1rem' }} />
      </Box>
    </Box>
  );
};

export default Header;
