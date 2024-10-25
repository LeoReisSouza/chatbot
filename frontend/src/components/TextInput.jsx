import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const TextInput = ({ value, onChange, onSubmit }) => {
  return (
    <Box mt={2}>
      <TextField 
        label="Digite sua mensagem"
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onSubmit}
        sx={{ mt: 2 }}
      >
        Enviar
      </Button>
    </Box>
  );
};

export default TextInput;
