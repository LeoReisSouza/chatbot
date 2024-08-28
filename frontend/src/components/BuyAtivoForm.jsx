import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const BuyAtivoForm = ({ onSuccess }) => {
    const [quantidadeCompra, setQuantidadeCompra] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSuccess({ quantidadeCompra });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Quantidade de Compra"
                    value={quantidadeCompra}
                    onChange={(e) => setQuantidadeCompra(e.target.value)}
                    fullWidth
                    required
                    type="number"
                />
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Comprar Ativo
            </Button>
        </form>
    );
};

export default BuyAtivoForm;
