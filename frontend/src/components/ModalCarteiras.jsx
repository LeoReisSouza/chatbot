import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Formik, Form, Field } from 'formik';
import { Box, Button, Typography, useTheme, TextField } from '@mui/material';
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    quantidade: yup.number().required('A quantidade de ativos é obrigatória').positive('A quantidade deve ser positiva').integer('A quantidade deve ser um número inteiro'),
});

const ModalCarteira = ({ onSuccess, userId, ativoId, tipo, valor, nome, variacao, tipo_ativo, quantidade }) => {
    const [user, setUser] = useState(null);
    const [carteirasDetails, setCarteirasDetails] = useState([]);
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
  
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
                const data = await response.json();
                return data;
            }));
            setCarteirasDetails(details);
        }
    };

    const handleAddAtivo = async (carteiraId, quantidade) => {
        onSuccess(carteiraId, quantidade);
      };

    useEffect(() => {
        getUser();
      }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        if (user) {
            getCarteirasDetails();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            {console.log(carteirasDetails.nome)}
            {carteirasDetails.length > 0 &&
                carteirasDetails[0].map((carteira, index) => (
                    <>
                        <WidgetWrapper key={carteira._id}>
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
                            <Typography color={medium}>Rendimento Bruto:</Typography>
                            <Typography color={main}>{carteira.rendimentoBruto}</Typography>
                            </FlexBetween>
                            <Formik
                                initialValues={{ quantidade: 0 }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    console.log('Formik values:', values);
                                    handleAddAtivo(index, values.quantidade);
                                }}>
                                {({ errors, touched }) => (
                                    <Form>
                                        <Box>
                                            <Field
                                                name="quantidade"
                                                as={TextField}
                                                label="Quantidade de Ativos"
                                                error={touched.quantidade && !!errors.quantidade}
                                                helperText={touched.quantidade && errors.quantidade}
                                                fullWidth
                                                margin="normal"
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{ mt: 2 }}
                                            >
                                                Adicionar nessa carteira
                                            </Button>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </WidgetWrapper>
                </>
                ))}
        </>
    );
};

export default ModalCarteira;