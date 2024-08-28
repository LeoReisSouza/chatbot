import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const AdvertWidget = ({ userId }) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const [advertData, setAdvertData] = useState(null);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  
        const fetchAdvertData = async () => {
          try {
            const response = await fetch(`http://localhost:3001/users/${user._id}/getAnuncio`,{
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            });
            const data = await response.json();
            setAdvertData(data); // Atualiza o estado com os dados recebidos da API
            console.log(data)
          } catch (error) {
            console.error('Error fetching advert data:', error);
          }
        };
  

  useEffect(() => {
    if (user) {
      fetchAdvertData();
    }
  }, [user]);

  if (!user || !advertData) {
    return null; // ou pode retornar um spinner de carregamento enquanto os dados são buscados
  }

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={advertData.image}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>{advertData.title}</Typography>
        <Typography color={medium}>R$: {advertData.price}</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        {advertData.description}
      </Typography>
    </WidgetWrapper>
  );
};


export default AdvertWidget;