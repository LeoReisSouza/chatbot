import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Title() {
  return (
    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '4rem' }}>
        <span style={{ color: '#fff' }}>Chat</span>
        <span style={{ color: '#a11657', fontWeight: 'bold' }}>Data</span>
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', fontSize: '1rem' }}>
        A platform for data-driven chats
      </Typography>
    </Box>
  );
}
