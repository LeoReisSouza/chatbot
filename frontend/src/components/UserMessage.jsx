import React from 'react';
import { Box, Typography, Avatar} from '@mui/material';
const botAvatarUrl = '/path/to/bot-avatar.png';

const UserMessage = ({ message }) => {
  return (
    <Box justifyContent="flex-end" alignItems="center" mb={1}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: '1rem',
        padding: '0 1rem',  
      }}
    >
      
      <Box
        sx={{
          backgroundColor: '#5c496b',
          color: '#fff',
          borderRadius: '10px',
          borderTopRightRadius: '0',
          padding: '1rem',
          maxWidth: '80%',
        }}
      >
        <Typography variant="body1">{message}</Typography>
      </Box>
        <Avatar 
          src={botAvatarUrl} 
          alt="User Avatar" 
          sx={{ width: 40, height: 40, marginLeft: '0.5rem' }}
        />
    </Box>
  );
};

export default UserMessage;