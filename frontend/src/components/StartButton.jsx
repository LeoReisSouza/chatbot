import React from 'react';
import { Button, styled } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CustomButton = styled(Button)({
  backgroundColor: '#634B6A',
  color: '#fff',
  borderRadius: '25px',
  padding: '10px 30px',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  width: '200px',
  height: '45px',
  '&:hover': {
    backgroundColor: '#815f8b',
  },
  '& .MuiButton-endIcon': {
    marginLeft: '0',
  },
});

export default function StartButton({ onClick }) {
  return (
    <CustomButton variant="contained" endIcon={<ArrowForwardIosIcon />} onClick={onClick}>
      Iniciar
    </CustomButton>
  );
}
