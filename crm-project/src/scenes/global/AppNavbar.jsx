import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Button,
  Popover,
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mainLogo from "../assets/user image.png";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import "./AppNavbar.css";
import { RequestServer } from "../api/HttpReq";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled, alpha } from "@mui/material/styles";

const logouturl = `/signout`;

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
))(({ theme }) => ({
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

const pages = [
  { title: "Home", toNav: "/Home" },
  { title: "Inventories", toNav: "/inventories" },
  { title: "Leads", toNav: "/leads" },
  { title: "Accounts", toNav: "/accounts" },
  { title: "Contacts", toNav: "/contacts" },
  { title: "Opportunities", toNav: "/opportunities" },
  { title: "Task", toNav: "/task" },
  { title: "Users", toNav: "/users" },
  { title: "File Upload", toNav: "/file" },
  // { title: 'Data Loader', toNav: '/dataLoader' },
  // { title: "Test", toNav: "/test" },
  // { title: 'Junction Object', toNav: '/oppInventory' },
];

const settings = ["Logout"];

function AppNavbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selected, setSelected] = useState("Home");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));

  console.log(loggedInUserData, "loggedInUserData");

  const navigate = useNavigate();

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
    RequestServer(logouturl)
      .then((res) => {
        if (res.success) {
          console.log(res.data, "then if");
          sessionStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(res.error.message, "then else");
        }
      })
      .catch((err) => {
        console.log(err.message, "catch error");
      });
  };

  const handleMenuItemClick = (title) => {
    setSelected(title);
    handleCloseNavMenu();
    handleClose();
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
  };

  const visiblePages = pages.slice(0, 6);
  const hiddenPages = pages.slice(6);

  console.log(window.location.href, "ggg");

  return (
    // 5C5CFF
    // fixed //static //sticky
    <AppBar position="sticky" sx={{ backgroundColor: "#5C5CFF" }}>
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
              {pages.map((page, index) => (
                <MenuItem
                  key={page.title}
                  onClick={() => handleMenuItemClick(page.title)}
                  active={selected === page.title}
                  sx={
                    selected === page.title
                      ? { bgcolor: "#BAD8FF", borderRadius: "5px" }
                      : {}
                  }
                >
                  <Link
                    to={page.toNav}
                    style={{ textDecoration: "none", color: "unset" }}
                  >
                    <Typography>{page.title} </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
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
                onClick={() => handleMenuItemClick(page.title)}
                active={selected === page.title}
                sx={{ borderRadius: "5px" }}
                className={
                  selected === page.title
                    ? "selected-app-menuItem"
                    : "app-nav-css"
                }
              >
                <Link
                  to={page.toNav}
                  style={{ textDecoration: "none", color: "unset" }}
                >
                  <Typography>{page.title} </Typography>
                </Link>
              </MenuItem>
            ))}

            <MenuItem
              id="selected"
              onClick={handleMoreClick}
              className="app-nav-css"
            >
              More
              <ArrowDropDownIcon />
            </MenuItem>
          </Box>

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
              <MenuItem
                onClick={() => handleMenuItemClick(item.title)}
                key={item.title}
                active={selected === item.title}
                sx={
                  selected === item.title
                    ? { bgcolor: "#BAD8FF", borderRadius: "5px" }
                    : {}
                }
              >
                {/* {item.title} */}
                <Link
                  to={item.toNav}
                  style={{ textDecoration: "none", color: "unset" }}
                >
                  <Typography>{item.title}</Typography>
                </Link>
              </MenuItem>
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
                  <strong>Hi, {loggedInUserData.userFullName}</strong>
                </Typography>
                <Typography variant="subtitle1">
                  {loggedInUserData.userName}
                </Typography>
                {/* <Typography variant="body2">{loggedInUserData.userName}</Typography> */}
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

            {/* <Dialog open={dialogOpen} onClose={handleOpenUserMenu}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <DialogContentText>{loggedInUserData.userFullName}</DialogContentText>
            <DialogContentText>{loggedInUserData._id}</DialogContentText>
            <DialogContentText>{loggedInUserData.userName}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserLogout}>Logout</Button>
            <Button onClick={handleOpenUserMenu}>Close</Button>
          </DialogActions>
        </Dialog> */}

            {/* <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleUserLogout}>
                  {setting}
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppNavbar;
