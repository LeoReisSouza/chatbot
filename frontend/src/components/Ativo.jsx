import { Typography, useTheme, Box } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "./FlexBetween";

const AtivoItem = ({ ativo }) => {

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper key={ativo.stock}>
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" mb="1rem">
          <img src={ativo.logo} alt={`${ativo.name} logo`} width={50} height={50} style={{ marginRight: '1rem' }} />
          <Typography variant="h6" color={main}>{ativo.name}</Typography>
        </Box>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Ticker: </Typography>
          <Typography color={main}>{ativo.stock}</Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Valor: </Typography>
          <Typography color={main}>R${ativo.close.toFixed(2)}</Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Variação: </Typography>
          <Typography color={main}>
            {ativo.change}
          </Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Volume: </Typography>
          <Typography color={main}>{ativo.volume}</Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Capitalização de Mercado: </Typography>
          <Typography color={main}>R${(ativo.market_cap / 1e9)}</Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Setor: </Typography>
          <Typography color={main}>{ativo.sector}</Typography>
        </FlexBetween>
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Tipo: </Typography>
          <Typography color={main}>{ativo.type}</Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default AtivoItem;