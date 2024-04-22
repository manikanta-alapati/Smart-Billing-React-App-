// import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
// import LogoutIcon from "@mui/icons-material/Logout";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useAuth } from "../../contexts/AuthProvider";

// const DashboardAppBar = () => {
//   const { logout } = useAuth();
//   return (
//     <AppBar
//       position="fixed"
//       sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
//     >
//       <Toolbar>
//         {/* <IconButton
//           size="large"
//           edge="start"
//           color="inherit"
//           aria-label="menu"
//           sx={{ mr: 2 }}
//         >
//           <MenuIcon />
//         </IconButton> */}
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Smart Billing
//         </Typography>
//         <IconButton color="inherit" onClick={logout}>
//           <LogoutIcon />
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

function DashboardAppBar() {
  const { logout, isLoggedIn, user } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pages = isLoggedIn
    ? [
        {
          name: "History",
          onClick: () => {
            handleCloseNavMenu();
            navigate("history");
          },
        },
        {
          name: "Products",
          onClick: () => {
            handleCloseNavMenu();
            navigate("products");
          },
        },
      ]
    : [
        {
          name: "Products",
          onClick: () => {
            handleCloseNavMenu();
            navigate("products");
          },
        },
      ];
  const settings = [
    {
      name: "Logout",
      onClick: () => {
        handleCloseUserMenu();
        logout();
      },
    },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ReceiptLongIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate("/billing")}
          >
            Smart Billing
          </Typography>

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
              {pages.map(({ name, onClick }) => (
                <MenuItem key={name} onClick={onClick}>
                  <Typography textAlign="center">{name}</Typography>
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
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={() => navigate("/")}
          >
            Smart Billing
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ name, onClick }) => (
              <Button
                key={name}
                onClick={onClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {name}
              </Button>
            ))}
          </Box>

          {isLoggedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name ?? "Profile"}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map(({ name, onClick }) => (
                  <MenuItem key={name} onClick={onClick}>
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default DashboardAppBar;
