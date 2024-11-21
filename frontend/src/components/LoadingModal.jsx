import CircularProgress from '@mui/material/CircularProgress';
import { Box, Modal, Typography } from '@mui/material';

const LoadingModal = ({ loading }) => {
  return (
    <Modal
      open={loading}
      aria-labelledby="loading-modal-title"
      aria-describedby="loading-modal-description"
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
        <CircularProgress />
        <Typography id="loading-modal-title" variant="h6" sx={{ mt: 2 }}>
          Carregando...
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoadingModal;