import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useSpring } from '@react-spring/web'; 
import CardSection from '../../components/CardSection';
import StartButton from '../../components/StartButton';
import Header from '../../components/Header';
import Title from '../../components/Title'; 
import ChatBot from '../chatBot';

const ChatPage = () => {
  const [showChatBotScreen, setShowChatBotScreen] = useState(false);

  const animationPropsTop = useSpring({
    from: { x: 0 },
    to: { x: -1200 },
    config: { duration: 30000 },
    reset: true,
    loop: true,
  });

  const animationPropsMiddle = useSpring({
    from: { x: -1200 },
    to: { x: 0 },
    config: { duration: 30000 },
    reset: true,
    loop: true,
  });

  const animationPropsBottom = useSpring({
    from: { x: 0 },
    to: { x: -1200 },
    config: { duration: 30000 },
    reset: true,
    loop: true,
  });

  const handlePress = () => {
    setShowChatBotScreen(true);
  };

  return (
    <>
      {showChatBotScreen ? (
        <ChatBot /> 
      ) : (
        <Box>
          <Header />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
            <Title /> 
            <CardSection
              animationPropsTop={animationPropsTop}
              animationPropsMiddle={animationPropsMiddle}
              animationPropsBottom={animationPropsBottom}
            />
            <StartButton onClick={handlePress} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatPage;
