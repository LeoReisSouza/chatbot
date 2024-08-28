import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserWidget = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [carteirasDetails, setCarteirasDetails] = useState([]);
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
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

    useEffect(() => {
        getUser();
    }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getCarteirasDetails();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user || !carteirasDetails) {
        return null;
    }

    const {
        nome,
        dataNascimento,
        cpf,
        rg,
        email,
        telefone,
        endereco,
        cep,
        uf,
        municipio,
    } = user;

    return (

        <>
            <WidgetWrapper>
                <Typography
                    variant="h4"
                    color={dark}
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                        },
                    }}
                >
                    {nome}
                </Typography>
                <Divider />
                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Data de Nascimento:</Typography>
                        <Typography color={main}>{dataNascimento.split("T")[0]}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>CPF:</Typography>
                        <Typography color={main}>{cpf}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>RG:</Typography>
                        <Typography color={main}>{rg}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Email:</Typography>
                        <Typography color={main}>{email}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Telefone:</Typography>
                        <Typography color={main}>{telefone}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Endereço:</Typography>
                        <Typography color={main}>{endereco}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>CEP:</Typography>
                        <Typography color={main}>{cep}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>UF:</Typography>
                        <Typography color={main}>{uf}</Typography>
                    </FlexBetween>
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Município:</Typography>
                        <Typography color={main}>{municipio}</Typography>
                    </FlexBetween>
                    <Divider />
                </Box>
            </WidgetWrapper></>
    );
};

export default UserWidget;