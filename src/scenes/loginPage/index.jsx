
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import ddf from "./ddf.png"
import Navbar from "../navbar/index";
const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="red">
          Digital Dream Forge
        </Typography>
        <Typography>
          Version 3.30.1758
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
      
      <Box
        component="img"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 150,
          width: 400,
          maxHeight: { xs: 150, md: 150 },
          maxWidth: { xs: 400, md: 400 },
          margin: '0 auto'
        }}        
        alt="Digital Dream Forge Logo"
        src={ddf}
      />

        <Typography fontWeight="500" variant="h5" textAlign="center" sx={{ mb: "1.5rem" }}>
          Please enter your employee login information
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
