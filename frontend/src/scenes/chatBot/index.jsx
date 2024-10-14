import React, { useState } from 'react';
import Header from '../../components/Header';
import BotMessage from '../../components/BotMessage';
import UserOptions from '../../components/UserOptions';
import Footer from '../../components/Footer';
import { Box } from '@mui/material';

const ChatBot = () => {
  const [botMessages, setBotMessages] = useState([
    "De qual área pertence o dado que deseja?",
  ]);
  
  const [userOptions, setUserOptions] = useState([
    { label: 'Sua Empresa', value: 'empresa' },
    { label: 'Time Financeiro', value: 'financeiro' },
    { label: 'Time Marketing', value: 'marketing' },
    { label: 'Time Comercial', value: 'comercial' },
  ]);

  const handleOptionSelect = (optionValue) => {
    setBotMessages(prevMessages => [
      ...prevMessages,
      `Entendi, você selecionou ${optionValue}.`,
    ]);

    if (optionValue === 'empresa') {
      setUserOptions([
        { label: 'Estoque', value: 'estoque' },
        { label: 'Faturamento', value: 'faturamento' },
        { label: 'Audiência', value: 'audiencia' },
        { label: 'Voltar', value: 'voltar' },
      ]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        {botMessages.map((msg, index) => (
          <BotMessage key={index} message={msg} />
        ))}

        <UserOptions options={userOptions} onSelect={handleOptionSelect} />
      </Box>
      <Footer />
    </Box>
  );
};

export default ChatBot;
