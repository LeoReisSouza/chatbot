import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useSpring } from '@react-spring/web'; 
import CardSection from '../../components/CardSection';
import StartButton from '../../components/StartButton';

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
        <div>ChatBot Screen</div>
      ) : (
        <Box>
          <CardSection
            animationPropsTop={animationPropsTop}
            animationPropsMiddle={animationPropsMiddle}
            animationPropsBottom={animationPropsBottom}
          />
          <StartButton onClick={handlePress} />
        </Box>
      )}
    </>
  );
};

export default ChatPage;
