import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import lifedee_logo from '/src/Icon/lifedee_no_background.png';
import { Link } from "react-router-dom";

const pages = [
  { title: "หน้าแรก", link: "/", fontWeight: 600, color: "#303c46" },
  { title: "แผนที่สุขภาพ", link: "/pm", fontWeight: 400, color: "#9e9e9e" },
  { title: "คู่มือการใช้งาน", link: "manual", fontWeight: 400, color: "#9e9e9e" },
  { title: "ติดต่อ", link: "/contactUs", fontWeight: 400, color: "#9e9e9e" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "rgba(245, 245, 247, 0.85)", backdropFilter: "blur(10px)", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <img
            src={lifedee_logo}
            alt="lifeD_Logo"
            style={{ display: { xs: "none", md: "flex" }, marginRight: 1, height: 40, paddingRight: 10 }}
          />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={pages[0].link}
            sx={{
              marginRight: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Prompt, sans-serif",
              fontWeight: 600,
              color: "#303c46",
              textDecoration: "none",
            }}
          >
            ไลฟ์ดี
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                component={Link}
                to={page.link}
                sx={{
                  my: 2,
                  mx: 2,
                  color: page.color,
                  display: "block",
                  fontFamily: "Prompt, sans-serif",
                  fontWeight: page.fontWeight,
                  fontSize: "16px"
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ display: { xs: "flex", md: "none", color: "#303c46" } }}
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
                fontFamily: "Prompt, sans-serif",
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu} component={Link} to={page.link}>
                  <Typography variant="body1" textAlign="center" sx={{ color: page.color, fontWeight: page.fontWeight, fontSize: "16px", fontFamily: "Prompt, sans-serif" }}>
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
