import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
const botAvatarUrl = '/path/to/bot-avatar.png';

const BotMessage = ({ message }) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        padding: '0 1rem',  
      }}
    >
      <Avatar 
        src={botAvatarUrl} 
        alt="Bot Avatar" 
        sx={{ width: 40, height: 40, marginRight: '0.5rem' }}
      />
      
      <Box
        sx={{
          backgroundColor: '#5c496b',
          color: '#fff',
          borderRadius: '10px',
          borderTopLeftRadius: '0',
          padding: '1rem',
          maxWidth: '70%',
        }}
      >
        <Typography variant="body1">{message}</Typography>
      </Box>
    </Box>
  );
};

export default BotMessage;
