import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    Typography,
    useMediaQuery,
} from '@mui/material';
import CreateCarteiraForm from './CreateCarteiraForm';

const CreateCarteiraModal = ({ isOpen, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onClose();
    };

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleCloseModal}
            fullScreen={isMobile}
            fullWidth
            maxWidth="sm"
        >
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Criar Nova Carteira
                    </Typography>
                    <CreateCarteiraForm onSuccess={handleCloseModal} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCarteiraModal;