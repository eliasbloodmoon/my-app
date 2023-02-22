import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
//import Form from "./Form";
//import ddf from "./ddf.png"
import Navbar from "../navbar/index";
const Underconstruction = () => {
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
      </Box>

      <Typography font Weight="bold" fontSize="69px" color="red" textAlign="center">
      Admin Page Is Under Construction
      </Typography>

      <Typography font Weight="bold" fontSize="32px" color="red" textAlign="center">
      We're sorry, this page is currently under construction. Please check back soon!
      </Typography>

    </Box>


  );
};

export default Underconstruction;