import { Box, Typography, Button, useTheme, useMediaQuery, Dialog, DialogContent, Grid } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import EditCarteiraForm from "components/EditCarteiraForm";
import SellAtivoForm from "components/SellAtivoForm";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateCarteiraForm from "components/CreateCarteiraForm";
import { ResponsiveBar } from "@nivo/bar";

const CarteirasWidget = ({ userId }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCarteiraIndexToSell, setCarteiraIndexToSell] = useState(false);
  const [isHistoricoAtivoIdToSell, setHistoricoAtivoIdToSell] = useState(false);
  const [isHistoricoAtivoSiglaToSell, setHistoricoAtivoSiglaToSell] = useState(false);
  const [ativoIdToSell, setAtivoIdToSell] = useState(null);
  const [user, setUser] = useState(null);
  const [carteirasDetails, setCarteirasDetails] = useState([]);
  const [sellErrorMessage, setSellErrorMessage] = useState('');
  const [carteiraIndexToEdit, setCarteiraIndexToEdit] = useState(null);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const isDarkMode = palette.mode === 'dark';

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  const getCarteirasDetails = async () => {
      if (user && user.carteiras) {
          const details = await Promise.all(user.carteiras.map(async (carteiraId) => {
              const response = await fetch(`http://localhost:3001/users/${user._id}/carteira/${carteiraId}`, {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                throw new Error('Erro ao buscar as carteiras');
              }

              const data = await response.json();
              setCarteirasDetails(data);
          }));
      }
  };

  const handleCreateCarteira = async (formData) => {
    try {
        const response = await fetch(`http://localhost:3001/users/createcarteira/${user._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...formData, userId: user._id })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Carteira criada com sucesso:", data);
            handleCloseModal();
            getCarteirasDetails();
        } else {
            console.error("Erro ao criar a carteira:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao criar a carteira:", error);
    }
  };

  const handleEditCarteira = async (formData) => {
    try {
        const response = await fetch(`http://localhost:3001/users/editcarteira/${user.carteiras[carteiraIndexToEdit]}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ ...formData, id: user.carteiras[carteiraIndexToEdit] }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            console.log("Carteira editada com sucesso.");
            handleCloseModal();
            getCarteirasDetails();
        } else {
            console.error("Erro ao editar a carteira:", data.message);
        }
    } catch (error) {
        console.error("Erro ao editar a carteira:", error);
    }
  };

  const handleDeleteCarteira = async (carteiraIndex) => {
      try {
          const response = await fetch(`http://localhost:3001/users/${userId}/removecarteira`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({carteiraIndex: carteiraIndex, userId: user._id}),
          });
          const data = await response.json();
          if (response.ok) {
              console.log("Carteira excluída com sucesso.");
              getCarteirasDetails();
          } else {
              console.error("Erro ao excluir a carteira:", data.message);
          }
      } catch (error) {
          console.error("Erro ao excluir a carteira:", error);
      }
  };

  const handleSellAtivo = async (formData) => {
    try {
        const response = await fetch(`http://localhost:3001/users/${user._id}/deleteAtivo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...formData, carteiraId: user.carteiras[isCarteiraIndexToSell], ativoId: isHistoricoAtivoIdToSell, historicoAtivoId: isHistoricoAtivoIdToSell, ativoSigla: isHistoricoAtivoSiglaToSell})
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Ativo vendido com sucesso:", data);
            handleCloseSellModal();
            getCarteirasDetails();
            setSellErrorMessage('');
        } else {
            const data = await response.json();
            console.error("Erro ao vender o ativo:", data.message);
            setSellErrorMessage(data.message);
        }
    } catch (error) {
        console.error("Erro ao vender o ativo:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (index) => {
    setCarteiraIndexToEdit(index);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setCarteiraIndexToEdit(null);
  };

  const handleOpenSellModal = (ativoId, CarteiraIndex, historicoAtivoId, ativoSigla) => {
    setAtivoIdToSell(ativoId);
    setCarteiraIndexToSell(CarteiraIndex)
    setHistoricoAtivoIdToSell(historicoAtivoId)
    setHistoricoAtivoSiglaToSell(ativoSigla)
    setIsSellModalOpen(true);
    
  };

  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
    setAtivoIdToSell(null);
  };

  useEffect(() => {
    getUser();
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
        getCarteirasDetails();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user || !carteirasDetails) {
      return null;
  }

  return (
    <>
      <Button
      variant="contained"
      color="primary"
      onClick={handleOpenCreateModal}
      >
      Criar Carteira
      </Button>
      <Dialog
        open={isCreateModalOpen}
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
                <CreateCarteiraForm onSuccess={handleCreateCarteira} user_id={user._id} />
            </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseModal}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Editar Carteira
                </Typography>
                <EditCarteiraForm onSuccess={handleEditCarteira} />
            </Box>
        </DialogContent>
      </Dialog>

    <Dialog
      open={isSellModalOpen}
      onClose={handleCloseSellModal}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
          <Box sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                  Vender Ativo
              </Typography>
              {sellErrorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {sellErrorMessage}
                </Typography>
              )}
              <SellAtivoForm onSuccess={handleSellAtivo} />
          </Box>
      </DialogContent>
    </Dialog>
      <Box sx={{m: 2}}/>
      {carteirasDetails.length > 0 &&
        carteirasDetails.map((carteira, index) => (
          <>
          {console.log(carteira)}
            <WidgetWrapper key={carteira.dataCriacao}>
              <Box p="1rem 0">
                <FlexBetween mb="0.5rem">
                  <Typography color={medium}>Nome:</Typography>
                  <Typography color={main}>{carteira.nome}</Typography>
                </FlexBetween>
                <FlexBetween mb="0.5rem">
                  <Typography color={medium}>Descrição:</Typography>
                  <Typography color={main}>{carteira.descricao}</Typography>
                </FlexBetween>
                <FlexBetween mb="0.5rem">
                  <Typography color={medium}>Risco:</Typography>
                  <Typography color={main}>{carteira.risco}</Typography>
                </FlexBetween>
                <FlexBetween mb="0.5rem">
                  <Typography color={medium}>Valor:</Typography>
                  <Typography color={main}>R${carteira.valor.toFixed(2)}</Typography>
                </FlexBetween>
                <FlexBetween mb="0.5rem">
                  <Typography color={medium}>Rendimento Bruto:</Typography>
                  <Typography color={main}>R$: {carteira.rendimentoBruto.toFixed(2)}</Typography>
                </FlexBetween>
                {carteira.historico.length > 0 && (
                  <Box sx={{m: 2, height: 400}}>
                    <ResponsiveBar
                      data={carteira.ativos.map(ativo => ({
                        ativoId: ativo.ativoId,
                        quantidade: ativo.quantidade,
                        valor: ativo.valor,
                        nome: ativo.nome,
                        _id: ativo._id
                      }))}
                      keys={["quantidade", "valor"]}
                      indexBy="nome"
                      margin={{
                        top: 50,
                        right: 130,
                        bottom: 50,
                        left: 60,
                      }}
                      padding={0.3}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Ativos',
                        legendPosition: 'middle',
                        legendOffset: 32,
                        tickColor: isDarkMode ? '#ffffff' : '#000000',
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Valor',
                        legendPosition: 'middle',
                        legendOffset: -40,
                        tickColor: isDarkMode ? '#ffffff' : '#000000',
                      }}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      labelTextColor={isDarkMode ? '#ffffff' : '#000000'}
                      legends={[
                        {
                          dataFrom: 'keys',
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 120,
                          translateY: 0,
                          itemsSpacing: 2,
                          itemWidth: 100,
                          itemHeight: 20,
                          itemDirection: 'left-to-right',
                          itemOpacity: 0.85,
                          symbolSize: 20,
                          effects: [
                            {
                              on: 'hover',
                              style: {
                                itemOpacity: 1,
                              },
                            },
                          ],
                          textColor: isDarkMode ? '#ffffff' : '#000000',
                        },
                      ]}
                      theme={{
                        textColor: isDarkMode ? '#ffffff' : '#000000',
                        tooltip: {
                          container: {
                            background: isDarkMode ? '#333333' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                          },
                        },
                      }}
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                    />
              </Box>
                    )
                  }
                
                {carteira.historico && carteira.historico.length > 0 && (
                  <Box sx={{ margin: "1rem 0" }}>
                      <Grid container spacing={2} padding={4} alignItems="center">
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Tipo</Typography>
                          </Grid>
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Data</Typography>
                          </Grid>
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Valor</Typography>
                          </Grid>
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Nome</Typography>
                          </Grid>
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Qtd</Typography>
                          </Grid>
                          <Grid item xs={2}>
                              <Typography color={medium} fontWeight="bold">Vender</Typography>
                          </Grid>
                      </Grid>
                      {carteira.historico.map((historico, index_historico) => (
                          <Grid container spacing={2} padding={2} alignItems="center" key={index_historico}>
                              <Grid item xs={2}>
                                  <Typography color={main}>{historico.tipo}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  <Typography color={main}>{historico.data.split("T")[0]}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  <Typography color={main}>{historico.valor}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  <Typography color={main}>{historico.nome}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  <Typography color={main}>{historico.quantidade}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  {historico.tipo === 'compra' && (
                                      <Button
                                          variant="outlined"
                                          color="secondary"
                                          onClick={() => {handleOpenSellModal(historico._id, index, historico.ativo, historico.ativoSigla)}}
                                      >
                                          Vender
                                      </Button>
                                  )}
                              </Grid>
                          </Grid>
                      ))}
                  </Box>
              )}
                <FlexBetween>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => { handleDeleteCarteira(index); } }
                    >
                        Excluir Carteira
                    </Button>

                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleOpenEditModal(index)}
                    >
                        Editar Carteira
                    </Button>
                </FlexBetween>
              </Box>
            </WidgetWrapper>
            <Box sx={{m: 2}}/>
          </>
      ))}
    </>
  );
};

export default CarteirasWidget;