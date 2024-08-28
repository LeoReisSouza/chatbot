import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const SellAtivoForm = ({ onSuccess }) => {
    const [valorVenda, setValorVenda] = useState('');
    const [dataVenda, setDataVenda] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSuccess({ valorVenda, dataVenda });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Quantidade a vender"
                    value={valorVenda}
                    onChange={(e) => setValorVenda(e.target.value)}
                    fullWidth
                    required
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Data da Venda"
                    type="date"
                    value={dataVenda}
                    onChange={(e) => setDataVenda(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Vender Ativo
            </Button>
        </form>
    );
};

export default SellAtivoForm;