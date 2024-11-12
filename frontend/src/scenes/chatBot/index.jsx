import React, { useState, useEffect } from 'react';
import BotMessage from '../../components/BotMessage';
import UserMessage from '../../components/UserMessage';
import Footer from '../../components/Footer';
import { Box, TextField, Button } from '@mui/material';
import DOMPurify from 'dompurify';
import '../../style/chatbot.css';
import Header from 'components/Header';
import ChartComponent from 'components/Chart';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Olá, eu sou a Eva, seu BOT. E quero te ajudar a coletar o dado que deseja." }
  ]);

  const [userOptions, setUserOptions] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showTextInput, setShowTextInput] = useState(false);
  const [chartData, setChartData] = useState("");
  const [userTextInput, setUserTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [startClicked, setStartClicked] = useState(false);

  useEffect(() => {
    handleStart()
  }, [])
  
  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const handleOptionSelect = async (optionValue) => {
    addMessage('user', optionValue);
    addMessage('bot', `Você selecionou: ${optionValue}`);

    if (clickCount === 0) {
      await fetchSchemas(optionValue);
    } else if (clickCount === 1) {
      await fetchTables(messages[1]?.text, optionValue);
    } else if (clickCount === 2) {
      setShowTextInput(true);
    }

    console.log(clickCount)
    console.log(messages)

    setClickCount((prevCount) => prevCount + 1);
  };

  const handleGoBack = async () => {
    setMessages((prevMessages) => prevMessages.slice(0, -2));
    
    setClickCount((prevCount) => prevCount - 1);
  
    if (clickCount === 1) {
      await fetchDatabases(); 
    } else if (clickCount === 2) {
      await fetchSchemas(messages[3]?.text); 
    } else if (clickCount === 3) {
      await fetchTables(messages[3]?.text, messages[5]?.text);
    }
    console.log(clickCount)
    console.log(messages)
  };

  const handleStart = async () => {
    addMessage('bot', "Vamos iniciar a nossa conversa?");
    setStartClicked(true);
    await fetchDatabases();
  };

  const handleTextInputSubmit = async () => {
    const sanitizedInput = DOMPurify.sanitize(userTextInput);
    if (!sanitizedInput.trim()) {
      addMessage('bot', "Por favor, digite uma pergunta antes de enviar.");
      return;
    }
    console.log(messages)
    addMessage('user', sanitizedInput);
    await callApi(messages[3]?.text, messages[5]?.text, messages[7]?.text, sanitizedInput);

    setShowTextInput(false);
    setUserTextInput("");
  };

  const UserOptions = ({ options, onSelect }) => {
    const chunkArray = (array, chunkSize) => {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    };

    const buttonGroups = chunkArray(options, 6);
    return (
      <>
        {buttonGroups.map((group, groupIndex) => (
          <Box key={groupIndex} display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
            {group.map((option, index) => (
              <Button
                key={index}
                variant="contained"
                color="primary"
                onClick={() => onSelect(option.value)}
                sx={{ margin: '5px', textTransform: 'none' }}
                disabled={loading}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        ))}
      </>
    );
  };

  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/databases');
      if (!response.ok) throw new Error("Erro ao buscar bases de dados");

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Formato inesperado da resposta ao buscar bases de dados");

      const options = data.map(dbname => ({ label: dbname, value: dbname }));
      setUserOptions(options);
    } catch (error) {
      console.error("Detalhes do erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemas = async (dbname) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/schemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbname }),
      });
      if (!response.ok) throw new Error(`Erro ao buscar schemas para a base ${dbname}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error(`Formato inesperado da resposta para schemas da base ${dbname}`);

      const options = data.map(schema => ({ label: schema, value: schema }));
      setUserOptions(options);
    } catch (error) {
      console.error("Detalhes do erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async (dbname, schema) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbname, schema }),
      });
      if (!response.ok) throw new Error(`Erro ao buscar tabelas para o schema ${schema}`);

      const data = await response.json();

      const options = data.map(table => ({ label: table, value: table }));
      setUserOptions(options);
    } catch (error) {
      console.error("Detalhes do erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const restartConversation = async () => {
    setClickCount(0); 
    setUserOptions([]);
    setStartClicked(false); 

    await fetchDatabases();
    addMessage('bot', "Vamos começar novamente. Selecione uma base de dados.");
  };

  const callApi = async (dbname, schema, table, question) => {
    try {
      const formattedInput = `${dbname}, ${schema}, ${table}, ${question}`;
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: formattedInput }),
      });
  
      if (!response.ok) throw new Error('Erro ao chamar a API do chatbot.');
  
      const data = await response.json();
      setChartData(data); 
      addMessage('bot', "Aqui está o gráfico com as informações solicitadas:"); 

      await restartConversation();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" height="75vh">
        <Box className="chat-content" justifyContent="flex-start" alignItems="center" mb={1}>
          {messages.map((msg, index) =>
            msg.sender === 'bot' ? (
              <BotMessage key={index} message={msg.text} />
            ) : (
              <Box key={index} display="flex" flexDirection="row-reverse" alignItems="center" mb={1}>
                <UserMessage message={msg.text} />
              </Box>
            )
          )}
          {!showTextInput && chartData.length > 0 && (
            <ChartComponent data={chartData} />
          )}
        </Box>
      </Box>

        {showTextInput && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <TextField
              label="Digite sua pergunta"
              variant="outlined"
              value={userTextInput}
              onChange={(e) => setUserTextInput(e.target.value)}
              fullWidth
            />
            <Button
              onClick={handleTextInputSubmit}
              variant="contained"
              color="primary"
              sx={{ marginLeft: '10px' }}
              disabled={loading}
            >
              Enviar
            </Button>
          </Box>
        )}

      {(!showTextInput && chartData.length === 0) && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <UserOptions options={userOptions} onSelect={handleOptionSelect} />
          {clickCount > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGoBack}
              sx={{ marginLeft: '10px' }}
              disabled={loading}
            >
              Voltar
            </Button>
          )}
        </Box>
      )}

      <Footer />
    </>
  );
};

export default ChatBot;
