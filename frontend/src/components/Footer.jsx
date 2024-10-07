import React from 'react';
import { Button, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',        
        justifyContent: 'center', 
        padding: '1rem', 
        width: '100%',          
      }}
    >
      <Button 
        variant="contained" 
        sx={{ 
          backgroundColor: '#d92072', 
          color: '#fff', 
          borderRadius: '25px', 
          padding: '10px 20px', 
          textTransform: 'none', 
          display: 'flex', 
          alignItems: 'center', 
        }}
        endIcon={<ArrowForwardIosIcon />} 
      >
        Acione a equipe de Dados
      </Button>
    </Box>
  );
};

export default Footer;
