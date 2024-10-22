import React, { useState } from 'react';
import Header from '../../components/Header';
import BotMessage from '../../components/BotMessage';
import UserOptions from '../../components/UserOptions';
import Footer from '../../components/Footer';
import { Box, TextField, Button } from '@mui/material';
import '../../style/chatbot.css';


const ChatBot = () => {
  const initialBotMessages = ["De qual área pertence o dado que deseja?"];
  const initialUserOptions = [
    { label: 'Sua Empresa', value: 'empresa' },
    { label: 'Time Financeiro', value: 'financeiro' },
    { label: 'Time Marketing', value: 'marketing' },
    { label: 'Time Comercial', value: 'comercial' },
  ];

  const [botMessages, setBotMessages] = useState(initialBotMessages);
  const [userOptions, setUserOptions] = useState(initialUserOptions);
  const [clickCount, setClickCount] = useState(0);
  const [showTextInput, setShowTextInput] = useState(false);
  const [userTextInput, setUserTextInput] = useState("");

  const updateBotMessages = (newMessage) => {
    setBotMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const updateUserOptions = (optionValue) => {
    if (optionValue === 'empresa') {
      setUserOptions([
        { label: 'Estoque', value: 'estoque' },
        { label: 'Faturamento', value: 'faturamento' },
        { label: 'Audiência', value: 'audiencia' },
        { label: 'Voltar', value: 'voltar' },
      ]);
    }
  };

  const handleOptionSelect = (optionValue) => {
    updateBotMessages(`Entendi, você selecionou ${optionValue}.`);
    updateUserOptions(optionValue);
    
    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 3) setShowTextInput(true);
      return newCount;
    });
  };

  const handleTextInputChange = (e) => setUserTextInput(e.target.value);

  const handleTextInputSubmit = () => {
    updateBotMessages(`Você digitou: ${userTextInput}`);
    setShowTextInput(false);
    setUserTextInput("");
  };

  return (
    <Box className="chat-container">
      <Header />
      <Box className="chat-content">
        {botMessages.map((msg, index) => (
          <BotMessage key={index} message={msg} />
        ))}
        <UserOptions options={userOptions} onSelect={handleOptionSelect} />
        {showTextInput && (
          <Box mt={2}>
            <TextField
              label="Digite sua mensagem"
              variant="outlined"
              fullWidth
              value={userTextInput}
              onChange={handleTextInputChange}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleTextInputSubmit} 
              sx={{ mt: 2 }}
            >
              Enviar
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default ChatBot;
