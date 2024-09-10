import React from 'react';
import { Button } from '@mui/material';

const StartButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        backgroundColor: '#007bff',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#0056b3',
        },
      }}
    >
      Iniciar
    </Button>
  );
};

export default StartButton;
