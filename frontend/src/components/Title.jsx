import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';

export default function Title() {
  const { palette } = useTheme();

  return (
    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
      <Typography variant="h2" sx={{ fontSize: '4rem' }}>
        <span>Chat</span>
        <span style={{ color: palette.primary.light, fontWeight: 'bold' }}>Data</span>
      </Typography>

      <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem', maxWidth: "920px", marginTop: "1rem" }}>
        Uma plataforma inovadora de Self-Service BI que empodera usuários com autonomia para transformar dados em decisões estratégicas por meio de visualizações dinâmicas e acessíveis.
      </Typography>
    </Box>
  );
}
