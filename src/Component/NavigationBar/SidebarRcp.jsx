import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MasksRoundedIcon from "@mui/icons-material/MasksRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import SickRoundedIcon from "@mui/icons-material/SickRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BiotechIcon from "@mui/icons-material/Biotech";

import Logo from "/assets/Icon/logo_app.svg";
import MophLogo from "/assets/Icon/moph_logo.svg";
import GistdaLogo from "/assets/Icon/gistda_logo.svg";
import PcLogo from "/assets/Icon/pc.png";
import MeteoLogo from "/assets/Icon/meteo.png";
import Gistda from "/assets/Icon/Gistda_LOGO.png";

import "./SidebarPM.css";

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "space-between" : "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ openSidebar, toggleSidebar }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const drawerRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        if (openSidebar) {
          toggleSidebar();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebar, toggleSidebar]);

  const [activeItem, setActiveItem] = React.useState("ดัชนีความร้อน");
  const [openResearch, setOpenResearch] = React.useState(false);

  const handleNavigation = (text, path) => {
    setActiveItem(text);
    navigate(path);

    if (text === "คู่มือการใช้งาน") {
      window.open("https://lifedee-service.gistda.or.th/Files/manual.pdf", "_blank", "noopener,noreferrer");

    } else if (text === "วีดีโอสาธิตการใช้งาน") {
      window.open("https://youtu.be/JPDsKI9RjjY?si=L7i8x1LjgLuJyPy9", "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  const handleResearchClick = () => {
    setOpenResearch(!openResearch); // Toggle dropdown
  };

  return (
    <Box
      ref={drawerRef}
      sx={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={openSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            height: "500px",
            top: "2vh",
            left: "1rem",
            borderRadius: "30px",
            width: openSidebar ? drawerWidth : "60px",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
            backgroundColor: "rgba(255, 255, 255, 1.0)",
            overflowY: "hidden",
          },
        }}
      >
        <DrawerHeader>
          {openSidebar ? (
            <>
              <img
                src={Logo}
                alt="logo"
                style={{ width: "40px", marginLeft: "0px" }}
              />
              <div className="header-text">
                <h1>LifeDee</h1>
                <p>สุขภาพดีเริ่มต้นที่แอปไลฟ์ดี</p>
              </div>
            </>
          ) : (
            <></>
          )}
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: "#FFA447", width: "40px", height: "40px" }}
          >
            {openSidebar ? <ChevronLeftIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <List>
            {[
              { text: "หน้าแรก", icon: <HomeRoundedIcon />, path: "/" },
              {
                text: "โรคระบบทางเดินหายใจ",
                icon: <MasksRoundedIcon />,
                path: "/pm",
              },
              {
                text: "โรคฮีทสโตรก",
                icon: <LocalFireDepartmentRoundedIcon />,
                path: "/hid",
              },
            ].map(({ text, icon, path }) => (
              <ListItem
                key={text}
                disablePadding
                sx={{ display: "block", mb: 0.5 }}
              >
                <Tooltip
                  title={!openSidebar ? text : ""}
                  placement="right"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#FFA447",
                        fontFamily: "Prompt",
                        fontSize: "12px",
                        "& .MuiTooltip-arrow": {
                          color: "#FFA447",
                        },
                      },
                    },
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      borderRadius: "10px",
                      marginLeft: "5px",
                      marginRight: "5px",
                      justifyContent: openSidebar ? "initial" : "center",
                      px: 2.5,
                      backgroundColor:
                        activeItem === text ? "#FFA447" : "transparent",
                      "&:hover": {
                        backgroundColor: "#FFA447",
                        borderRadius: "10px",
                        "& .MuiListItemIcon-root": {
                          color: "white",
                          transform: "scale(1.3)",
                        },
                        "& .MuiListItemText-primary": {
                          color: "white",
                        },
                      },
                    }}
                    onClick={() => handleNavigation(text, path)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: openSidebar ? 3 : "auto",
                        justifyContent: "center",
                        color: activeItem === text ? "#ffffff" : "#FFA447",
                        transform: activeItem === text ? "scale(1.3)" : "none",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{
                        opacity: openSidebar ? 1 : 0,
                        transition: "font-size 0.3s ease-in-out",
                        color: activeItem === text ? "#fff" : "#FFA447",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}

            {/* Dropdown for "งานวิจัย" */}
            <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
              <Tooltip
                title={!openSidebar ? "งานวิจัย" : ""}
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#FFA447",
                      fontFamily: "Prompt",
                      fontSize: "12px",
                      "& .MuiTooltip-arrow": {
                        color: "#FFA447",
                      },
                    },
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    borderRadius: "10px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    justifyContent: openSidebar ? "initial" : "center",
                    px: 2.5,
                    backgroundColor:
                      activeItem === "งานวิจัย" ? "#FFA447" : "transparent",
                    "&:hover": {
                      backgroundColor: "#FFA447",
                      borderRadius: "10px",
                      "& .MuiListItemIcon-root": {
                        color: "white",
                        transform: "scale(1.3)",
                      },
                      "& .MuiListItemText-primary": {
                        color: "white",
                      },
                      "& .MuiSvgIcon-root": {
                        // เพิ่มตรงนี้
                        color: "white",
                      },
                    },
                  }}
                  onClick={() => {
                    if (openSidebar) {
                      handleResearchClick();
                    } else {
                      toggleSidebar();
                      // handleResearchClick();
                    }
                  }} // Toggle dropdown
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openSidebar ? 3 : "auto",
                      justifyContent: "center",
                      color: activeItem === "งานวิจัย" ? "#ffffff" : "#FFA447",
                      transform:
                        activeItem === "งานวิจัย" ? "scale(1.3)" : "none",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <BiotechIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="งานวิจัย"
                    sx={{
                      opacity: openSidebar ? 1 : 0,
                      transition: "font-size 0.3s ease-in-out",
                      color: activeItem === "งานวิจัย" ? "#fff" : "#FFA447",
                    }}
                  />
                  {openSidebar &&
                    (openResearch ? (
                      <ExpandLess
                        sx={{
                          color: "#FFA447",
                          transition: "color 0.3s ease-in-out",
                          ".MuiListItemButton:hover &": { color: "#ffffff" }, // ทำให้เปลี่ยนสีเมื่อ Hover
                        }}
                      />
                    ) : (
                      <ExpandMore
                        sx={{
                          color: "#FFA447",
                          transition: "color 0.3s ease-in-out",
                          ".MuiListItemButton:hover &": { color: "#ffffff" }, // ทำให้เปลี่ยนสีเมื่อ Hover
                        }}
                      />
                    ))}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Dropdown Items */}
            <Collapse
              in={openResearch && openSidebar}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {[
                  { text: "ดัชนีความร้อน", path: "/rcp" },
                  { text: "โรคไข้เลือดออก", path: "/dng" },
                  { text: "Drowning", path: "/drowning" },
                  // { text: "ฝุ่น", path: "/research/pm" },
                ].map(({ text, path }) => (
                  <ListItem
                    key={text}
                    disablePadding
                    sx={{ display: "block", pl: 4 }}
                  >
                    <ListItemButton
                        onClick={() => handleNavigation(text, path)}
                        sx={{
                          minHeight: 48,
                          borderRadius: "10px",
                          marginLeft: "5px",
                          marginRight: "5px",
                          justifyContent: openSidebar ? "initial" : "center",
                          px: 2.5,
                          backgroundColor: activeItem === text ? "#FFA447" : "transparent",
                          "&:hover": {
                            backgroundColor: "#FFA447",
                            borderRadius: "10px",
                            "& .MuiListItemText-primary": {
                              color: "white",
                            },
                          },
                        }}
                      >
                        <ListItemText
                          primary={text}
                          sx={{
                            color: activeItem === text ? "#ffffff" : "#FFA447",
                            fontWeight: activeItem === text ? "bold" : "normal",
                          }}
                        />
                      </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>

        <Divider />

        <List sx={{ top: "0.25rem" }}>
          {[
            {
              text: "ข้อมูลติดต่อ",
              icon: <ContactsRoundedIcon />,
              path: "/ContactUs",
            },
            {
              text: "คู่มือการใช้งาน",
              icon: <PictureAsPdfRoundedIcon />,
              path: "",
            },
            {
              text: "วีดีโอสาธิตการใช้งาน",
              icon: <SmartDisplayRoundedIcon />,
              path: "",
            },
          ].map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!openSidebar ? text : ""}
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#FFA447",
                      fontFamily: "Prompt",
                      fontSize: "12px",
                      "& .MuiTooltip-arrow": {
                        color: "#FFA447",
                      },
                    },
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    borderRadius: "10px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    justifyContent: openSidebar ? "initial" : "center",
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: "#FFA447",
                      borderRadius: "10px",
                      "& .MuiListItemIcon-root": {
                        color: "white",
                        transform: "scale(1.3)",
                      },
                      "& .MuiListItemText-primary": {
                        color: "white",
                      },
                    },
                  }}
                  onClick={() => handleNavigation(text, path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openSidebar ? 3 : "auto",
                      justifyContent: "center",
                      color: "#FFA447",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      fontSize: "14px",
                      opacity: openSidebar ? 1 : 0,
                      transition: "font-size 0.3s ease-in-out",
                      color: "#FFA447",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* <div
          className="nav-footer-content"
          style={{
            opacity: openSidebar ? 1 : 0,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <span>สนับสนุนข้อมูลโดย</span>

          <div className="logo-container">
            <img
              src={MophLogo}
              alt="icon"
              className="MophLogo"
              style={{ width: "35px", verticalAlign: "middle" }}
            />
            <img
              src={Gistda}
              alt="icon"
              className="Gistda"
              style={{ width: "60px", verticalAlign: "middle" }}
            />
            <img
              src={PcLogo}
              alt="icon"
              className="Logo"
              style={{ width: "42px", verticalAlign: "middle" }}
            />
            <img
              src={MeteoLogo}
              alt="icon"
              className="Logo"
              style={{ width: "42px", verticalAlign: "middle" }}
            />
          </div>
        </div> */}
      </Drawer>
    </Box>
  );
}
