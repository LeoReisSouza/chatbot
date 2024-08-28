import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCarteiras } from "state";
import FlexBetween from "./FlexBetween";

const Carteiras = ({ _id, carteiraId, nome, descricao, ativos, dataCriacao, risco, valor, rendimentoBruto, rendimentoLiquido, impostos }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const carteiras = useSelector((state) => state.user.carteira) || [];
  
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isCarteira = carteiras.find((carteira) => carteira._id === carteiraId);

  const patchCarteira = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/${_id}/${carteiraId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Falha ao atualizar carteira");
      }
      const data = await response.json();
      dispatch(setCarteiras({ carteiras: data }));
    } catch (error) {
      console.error("Erro ao atualizar carteira:", error.message);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <Box
          onClick={() => {
            navigate(`/carteira/${carteiraId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
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
          <Typography color={medium} fontSize="0.75rem">
            {descricao}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchCarteira()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isCarteira ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Carteiras;