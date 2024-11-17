import React, { useState } from 'react';
import { Button, Box, Modal, TextField, Typography, Snackbar, Alert } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Footer = () => {
  const [open, setOpen] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [email, setEmail] = useState('');
  const [solicitacao, setSolicitacao] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [solicitacaoError, setSolicitacaoError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = () => {
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    if (solicitacao.length <= 20) {
      setSolicitacaoError(true);
      return;
    } else {
      setSolicitacaoError(false);
    }

    setOpen(false); 
    setSnackbarOpen(true); 
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return; 
    }
    setSnackbarOpen(false); 
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex',        
          justifyContent: 'center', 
          padding: '1rem', 
          width: '100%',          
        }}
      >
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#634B6A', 
            color: '#fff', 
            borderRadius: '25px', 
            padding: '10px 20px', 
            textTransform: 'none', 
            display: 'flex', 
            alignItems: 'center', 
          }}
          endIcon={<ArrowForwardIosIcon />} 
          onClick={handleOpen}
        >
          Acione a equipe de Dados
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Solicitação para a equipe de Dados
          </Typography>
          <TextField 
            fullWidth
            label="Email" 
            type="email" 
            variant="outlined" 
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? "Por favor, insira um e-mail válido." : ""}
          />
          <TextField 
            fullWidth
            label="Solicitação" 
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            value={solicitacao}
            onChange={(e) => setSolicitacao(e.target.value)}
            error={solicitacaoError}
            helperText={solicitacaoError ? "A solicitação deve ter mais de 20 caracteres." : ""}
          />
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          >
            <Button onClick={handleClose} sx={{ marginRight: '1rem' }}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#634B6A', color: '#fff' }}
              onClick={handleSend}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Logo a equipe de Dados irá retornar sua solicitação.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Footer;
