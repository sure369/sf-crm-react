import React, { useEffect, useState } from "react";
import {
  AppBar, Box, Toolbar, Typography, IconButton, Menu, Container,
  Avatar, Tooltip, MenuItem, Button, Popover, ListItemButton, useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mainLogo from "../assets/user image.png";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import "./AppNavbar.css";
import { RequestServer } from "../api/HttpReq";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled, alpha } from "@mui/material/styles";
import { PaletteTwoTone } from "@mui/icons-material";
import { GetTableNames } from "./getTableNames";
import { apiMethods } from "../api/methods";
import CircularProgress from '@mui/material/CircularProgress';
import { POST_USER_SIGNOUT } from "../api/endUrls";

const URL_postLogout = POST_USER_SIGNOUT;

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))
  (({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 8,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));


const colors = [
  { label: "Default", color: "#5C5CFF" },
  { label: "Purple", color: "purple" },
  { label: "CornBlue", color: "cornflowerblue" },
  { label: "Grey", color: "grey" },
  { label: "Gold Green", color: "#ADB73D" },
  { label: "Light Gold", color: "#D5D57D" },
  { label: "Orange", color: "#F3BA5B" },
  { label: "Blue Grey", color: "#507C85" },
];

// const colors = [{ label: "Default", color: 'light' }, { label: "Dark", color: 'dark' }, { label: "Light", color: 'light' }]

function AppNavbar({ setIsLoggedIn }) {

  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selected, setSelected] = useState("Home");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedColor, setSelectedColor] = useState("#5C5CFF");

  const [anchorElPallete, setAnchorElPallete] = useState(null);
  const PalleteOpen = Boolean(anchorElPallete);
  const navigate = useNavigate();
  const [tableNamearr, settableNameArr] = useState([]);
  const [fetchTableNamesLoading, setFetchTableNameLoading] = useState(true)
  const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetchTableNames()
  }, [])

  const fetchTableNames = () => {
    GetTableNames()
      .then(res => {
        console.log(res, "GetTableNames res in appbar")

        const updateArr = res.map(item => {
          let title = item;
          let toNav = 'list/' + item.toLowerCase().replace(' ', '');

          if (item === 'Inventory Management') {
            title = 'Inventory';
            toNav = 'list/inventory';
          }

          return { title, toNav };
        });
        console.log(updateArr, "settableNameArr")
        settableNameArr(updateArr)
        setFetchTableNameLoading(false)
      })
      .catch(err => {
        console.log(err, "GetTableNames error in appbar")
      })
  }



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setDialogOpen(!dialogOpen);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    console.log("handleCloseUserMenu");
    setAnchorElUser(null);
    // sessionStorage.removeItem('token')
    // sessionStorage.setItem('authenticated',false)
    // navigate('/')
  };

  const handleUserLogout = () => {
    console.log("handleUserLogout");
    RequestServer(apiMethods.post, URL_postLogout)
      .then((res) => {
        if (res.success) {
          sessionStorage.clear();
          navigate('/')
        } else {
          console.log(res.error.message, "then else");
        }
      })
      .catch((err) => {
        console.log(err.message, "catch error");
      });
  };

  const handleMenuItemClick = (item) => {
    setSelected(item.title);
    handleCloseNavMenu();
    handleClose();
    navigate(`${item.toNav}`);
  };

  const handleMoreClick = (event) => {
    console.log("inside handle more Click ");
    setAnchorEl(event.currentTarget);
    let selectedElem = document.getElementById("selected");
    selectedElem.classList.add("selected-app-menuItem");
  };

  const handleClose = () => {
    setAnchorEl(null);
    let selectedElem = document.getElementById("selected");
    selectedElem.classList.remove("selected-app-menuItem");
    setAnchorElPallete(null);
  };

  const handlePaletteClick = (event) => {
    setAnchorElPallete(event.currentTarget);
  };

  const changeTheme = (paletteType) => {
    theme.palette.mode = paletteType;
  };

  const handleColorChange = (colorName) => {
    console.log("color name is ", colorName);
    setSelectedColor(colorName);
  };

  const navBarStyle = {
    backgroundColor: selectedColor,
  };

  const visiblePages = tableNamearr.slice(0, 6);
  const hiddenPages = tableNamearr.slice(6);


  return (
    <>
      {fetchTableNamesLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
        // <div style={{ display: 'flex', alignItems: 'center' }}>
        // <CircularProgress size={24} />
        // <Typography variant="body1" sx={{ marginLeft: '10px' }}>
        //   Loading...
        // </Typography>
        // </div>
      ) : (
        <>
          <AppBar id="navBar" position="sticky" sx={{ backgroundColor: navBarStyle }}>
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Box className="CRM-Title-Box">
                  <Typography
                    className="CRM-Title"
                    variant="h2"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      letterSpacing: ".1rem",

                      textDecoration: "none",
                    }}
                  >
                    CLOUDDESK
                  </Typography>
                  <Typography
                    className="CRM-Title"
                    sx={{
                      display: { xs: "none", md: "flex" },
                      fontFamily: "Cambria",
                      letterSpacing: ".1rem",
                      marginLeft: "75px",
                    }}
                  >
                    CRM
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {tableNamearr.map((page, index) => (
                      <MenuItem
                        key={page.title}
                        onClick={() => handleMenuItemClick(page)}
                        active={selected === page.title}
                        sx={
                          selected === page.title
                            ? { bgcolor: "#BAD8FF", borderRadius: "5px" }
                            : {}
                        }
                      >
                        <Typography>{page.title} </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href=""
                  sx={{
                    mr: 2,
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                    fontFamily: "sans-serif",
                    textshadow: "0 0 4px silver",
                  }}
                >
                  Clouddesk
                </Typography>

                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "space-evenly",
                  }}
                >
                  {visiblePages.map((page, index) => (
                    <MenuItem
                      key={page.title}
                      onClick={() => handleMenuItemClick(page)}
                      active={selected === page.title}
                      sx={{ borderRadius: "5px" }}
                      className={
                        selected === page.title
                          ? "selected-app-menuItem"
                          : "app-nav-css"
                      }
                    >
                      <Typography variant="h6">{page.title} </Typography>
                    </MenuItem>
                  ))}

                  <MenuItem
                    id="selected"
                    onClick={handleMoreClick}
                    className="app-nav-css"
                    sx={{ borderRadius: '5px' }}
                  >
                    More
                    <ArrowDropDownIcon />
                  </MenuItem>

                  {/* <IconButton onClick={(event) => handlePaletteClick(event)}>
                    <PaletteTwoTone />
                  </IconButton> */}
                </Box>



                {/* <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorElPallete}
                  open={PalleteOpen}
                  onClose={handleClose}
                >
                  {colors.map((item) => (
                    <ListItemButton onClick={() => handleColorChange(item.color)}>
                      {item.label}
                    </ListItemButton>
                  ))}
                </StyledMenu> */}

                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {hiddenPages.map((item) => (
                    <ListItemButton
                      onClick={() => handleMenuItemClick(item)}
                      key={item.title}
                      active={selected === item.title}
                      sx={
                        selected === item.title
                          ? { bgcolor: "#BAD8FF", borderRadius: "5px" }
                          : {}
                      }
                    >
                      <Typography>{item.title}</Typography>
                    </ListItemButton>
                  ))}
                </StyledMenu>

                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src={mainLogo} />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    // id={id}
                    open={dialogOpen}
                    anchorEl={anchorElUser}
                    onClose={handleOpenUserMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <div style={{ padding: "16px" }}>
                      <Typography variant="h5">
                        <strong>Hi, {loggedInUserData?.userFullName}</strong>
                      </Typography>
                      <Typography variant="subtitle1">
                        {loggedInUserData?.userName}
                      </Typography>
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          variant="contained"
                          size="medium"
                          onClick={handleUserLogout}
                          endIcon={<PowerSettingsNewIcon />}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </Popover>
                </Box>

              </Toolbar>
            </Container>
          </AppBar>
        </>
      )
      }</>
  );

}
export default AppNavbar;
