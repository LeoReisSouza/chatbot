import React from 'react';
import { Box, Typography } from '@mui/material';
import { animated } from '@react-spring/web';

const CardSection = ({ animationPropsTop, animationPropsMiddle, animationPropsBottom }) => {
  const items = Array.from({ length: 12 }).map((_, index) => (
    <Box
      key={index}
      sx={{
        padding: '1rem',
        margin: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '150px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <Typography>
        Lorem ipsum dolor.
      </Typography>
    </Box>
  ));

  return (
    <Box>
      {/* Primeira fileira */}
      <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
        <animated.div style={{ display: 'flex', ...animationPropsTop }}>
          {items}
          {items}
        </animated.div>
      </Box>

      {/* Segunda fileira - animação inversa */}
      <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
        <animated.div style={{ display: 'flex', ...animationPropsMiddle }}>
          {items}
          {items}
        </animated.div>
      </Box>

      {/* Terceira fileira */}
      <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
        <animated.div style={{ display: 'flex', ...animationPropsBottom }}>
          {items}
          {items}
        </animated.div>
      </Box>
    </Box>
  );
};

export default CardSection;
