import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import ChartComponent from 'components/Chart';
import { useTheme } from '@emotion/react';

import bot from "../images/robo.png"

const BotMessage = ({ message, isChart, chartData }) => {
  const { palette } = useTheme();

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
        src={bot}
        alt="Bot Avatar"
        sx={{ width: 40, height: 40, marginRight: '0.5rem' }}
      />
      
      <Box
        sx={{
          backgroundColor: '#e2e8f0',
          borderRadius: '10px',
          borderTopLeftRadius: '0',
          padding: '1rem',
          maxWidth: '70%',
        }}
      >
        {isChart ? (
          <ChartComponent data={chartData} />
        ) : (
          <Typography variant="body1">{message}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default BotMessage;
