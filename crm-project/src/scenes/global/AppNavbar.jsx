import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const AppNavbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

// <AppBar>
// <Toolbar>
//   <Typography
//     variant="h5"
//     component="p"
//     color="textSecondary"
//     className={classes.title}
//   >
//     Murali
//   </Typography>
//   (
//   <div style={{ marginRight: "2rem" }}>
//     <Button variant="text" component={Link} to="/" color="default">
//       <HomeIcon />
//       Home
//     </Button>
//     <Button
//       variant="text"
//       component={Link}
//       to="/College"
//       color="default"
//     >
//       <SchoolIcon />
//       College
//     </Button>
//     <Button
//       variant="text"
//       component={Link}
//       to="/About"
//       color="default"
//     >
//       <PersonIcon />
//       About
//     </Button>
//     <Button
//       variant="text"
//       component={Link}
//       to="/Personal"
//       color="default"
//     >
//       <BookmarksIcon />
//       Personal
//     </Button>
//   </div>
//   )
// </Toolbar>
// </AppBar>

  );
};

export default AppNavbar;
