import { Box, Button, Modal, Typography } from '@mui/material';

const ErrorModal = ({ open, onClose, message }) => {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '10px',
            p: 4,
          }}
        >
          <Typography id="error-modal-title" variant="h6" sx={{ mb: 2, color: 'error.main' }}>
            Erro
          </Typography>
          <Typography id="error-modal-description" variant="body1" sx={{ mb: 2 }}>
            {message || "Não foi possível processar sua solicitação. Por favor, tente novamente."}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
          >
            Fechar
          </Button>
        </Box>
      </Modal>
    );
  };


export default ErrorModal;