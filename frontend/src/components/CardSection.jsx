import React from 'react';
import { Box, Typography } from '@mui/material';
import { animated } from '@react-spring/web';

const phrases = [
  "Gráficos dinâmicos para decisões em tempo real.",
  "Sua análise de dados, sempre segura e em conformidade com a LGPD.",
  "Consultas simplificadas, resultados precisos.",
  "Transforme dados em insights com inteligência.",
  "Automação que conecta você aos seus indicadores.",
  "Uma solução prática para mentalidade data driven.",
  "Descubra o poder dos seus dados de forma intuitiva.",
  "Acesso imediato a informações estratégicas.",
  "Mais autonomia, menos espera: dados ao seu alcance.",
  "Simplifique consultas complexas",
]

const CardSection = ({ animationPropsTop, animationPropsMiddle, animationPropsBottom }) => {
  const items = phrases.map((phrase, index) => (
    <Box
      key={index}
      sx={{
        padding: '1rem',
        margin: '0.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        // width: '150px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        backgroundColor: "#e2e8f0"
      }}
    >
      <Typography>
        {phrase}
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
