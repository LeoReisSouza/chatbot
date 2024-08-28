import { Box, Typography, useTheme, Button, useMediaQuery, DialogContent, Dialog } from "@mui/material";
import AtivoItem from "components/Ativo";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalCarteira from "components/ModalCarteiras"
import { v4 as uuidv4 } from 'uuid';

const AtivosListWidget = ({ userId }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ativoId, setAtivoId] = useState(null);
  const [ativoSigla, setAtivoSigla] = useState(null);
  const [ativoType, setAtivoType] = useState(null);
  const [ativoClose, setAtivoClose] = useState(null);
  const [ativoName, setAtivoName] = useState(null);
  const [ativoChange, setAtivoChange] = useState(null);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState(null);
  const [ativos, setAtivos] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const ativosPerPage = 5;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getAtivos = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:3001/users/${user._id}/getAtivos`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar as carteiras');
        }
        
        const data = await response.json();
        
        setAtivos(data);
      }
    } catch (error) {
        console.error('Erro ao buscar as carteiras:', error);
    }
  };

  const handleAddAtivo = async (carteiraIndex, quantidade) => {
    handleOpenModal();
    try {
      console.log(quantidade)
      let dataCompra = new Date()
      const response = await fetch(`http://localhost:3001/users/${user._id}/addAtivo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carteiraIndex: user.carteiras[carteiraIndex], ativoId, user, dataCompra, ativoType, ativoClose, ativoName, ativoChange, quantidade: quantidade , ativoSigla}),
      });

      const data = await response.json();
      if (response.ok) {
        getAtivos();
      } else {
        console.error("Erro ao adicionar a carteira:", data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar a carteira:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

  useEffect(() => {
    getUser();
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
        getAtivos();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderAtivosSection = (ativos, sectionIndex) => (
    <Box key={sectionIndex} mb={4}>
      <Typography
        color={palette.neutral.dark}
        variant="h6"
        fontWeight="500"
        sx={{ mb: "1rem" }}
      >
        Seção {sectionIndex + 1}
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {ativos.map((ativo) => (
          <Box key={ativo.stock}>
            <AtivoItem ativo={ativo} />
            <Button
              onClick={() => {
                handleOpenModal();
                setAtivoId(uuidv4());
                setAtivoType(ativo.type);
                setAtivoClose(ativo.close);
                setAtivoName(ativo.name);
                setAtivoChange(ativo.change);
                setAtivoType(ativo.type);
                setAtivoSigla(ativo.stock);
              }}
              
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Adicionar Ativo
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const sections = [];
  for (let i = 0; i < ativos.length; i += ativosPerPage) {
    const sectionAtivos = ativos.slice(i, i + ativosPerPage);
    sections.push(renderAtivosSection(sectionAtivos, sections.length));
  }

  return (
    <>
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
                Escolha a carteira
              </Typography>
              <ModalCarteira onSuccess={(carteiraId, quantidade) => handleAddAtivo(carteiraId, quantidade)} userId={userId} ativoId={ativoId} ativoSigla={ativoSigla}/>
            </Box>
        </DialogContent>
      </Dialog>
      <WidgetWrapper>
        <Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1.5rem" }}
        >
          Lista de Ativos
        </Typography>
        {sections[currentSection]}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentSection((prev) => Math.max(prev - 1, 0))}
            disabled={currentSection === 0}
          >
            Anterior
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1))}
            disabled={currentSection === sections.length - 1}
          >
            Próximo
          </Button>
        </Box>
      </WidgetWrapper>
      <Box sx={{ m: 2 }} />
    </>
  );
};

export default AtivosListWidget;
