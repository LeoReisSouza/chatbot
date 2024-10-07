import React from 'react';
import { Box, Button } from '@mui/material';

const UserOptions = ({ options, onSelect }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end', 
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '1rem',
        paddingRight: '1rem', 
      }}
    >
      {options.map((option, index) => (
        <Button
          key={index}
          variant="contained"
          sx={{ 
            backgroundColor: '#d92072', 
            color: '#fff',
            width: '150px', 
            borderRadius: '20px',
          }}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  );
};

export default UserOptions;
