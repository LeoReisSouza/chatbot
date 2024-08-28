import { Button } from '@mui/material';

const CreateCarteiraButton = ({ onClick }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
        >
            Criar Carteira
        </Button>
    );
};

export default CreateCarteiraButton;