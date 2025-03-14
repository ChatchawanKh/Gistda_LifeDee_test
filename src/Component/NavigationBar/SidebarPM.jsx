import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MasksRoundedIcon from '@mui/icons-material/MasksRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import SickRoundedIcon from '@mui/icons-material/SickRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import SmartDisplayRoundedIcon from '@mui/icons-material/SmartDisplayRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import Logo from '/src/Icon/logo_app.svg';
import MophLogo from '/src/Icon/moph_logo.svg';
import GistdaLogo from '/src/Icon/gistda_logo.svg';
import PcLogo from '/src/Icon/pc.png';
import MeteoLogo from '/src/Icon/meteo.png';
import Gistda from '/src/Icon/Gistda_LOGO.png';

import './SidebarPM.css';

const drawerWidth = 280;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme, open }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: open ? 'space-between' : 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        display: 'flex',
        flexDirection: 'column',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openSidebar, toggleSidebar]);

    const [activeItem, setActiveItem] = React.useState('โรคระบบทางเดินหายใจ');

    const handleNavigation = (text, path) => {
        setActiveItem(text);
        navigate(path);
    };

    return (
        <Box ref={drawerRef} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CssBaseline />
            <Drawer variant="permanent" open={openSidebar} sx={{
                '& .MuiDrawer-paper': {
                    height: !openSidebar ? '530px' : '85%',
                    maxHeight: '625px',
                    top: '2vh',
                    left: '1rem',
                    borderRadius: '30px',
                    width: openSidebar ? drawerWidth : '60px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)',
                    backgroundColor: 'rgba(255, 255, 255, 1.0)',
                },
            }}>
                <DrawerHeader>
                    {openSidebar ? (
                        <>
                            <img src={Logo} alt="logo" style={{ width: '40px', marginLeft: '0px' }} />
                            <div className="header-text">
                                <h1>LifeDee</h1>
                                <p>สุขภาพดีเริ่มต้นที่แอปไลฟ์ดี</p>
                            </div>
                        </>) : (<></>)}
                    <IconButton onClick={toggleSidebar} sx={{ color: '#8DBAFF', width: '40px', height: '40px' }}>
                        {openSidebar ? <ChevronLeftIcon /> : <MenuRoundedIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {[
                        { text: 'หน้าแรก', icon: <HomeRoundedIcon />, path: '/' },
                        { text: 'โรคระบบทางเดินหายใจ', icon: <MasksRoundedIcon />, path: '/pm' },
                        { text: 'โรคฮีทสโตรก', icon: <LocalFireDepartmentRoundedIcon />, path: '/hid' },
                        { text: 'โรคไข้เลือดออก', icon: <SickRoundedIcon />, path: '/dng' },
                    ].map(({ text, icon, path }) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                            <Tooltip title={!openSidebar ? text : ''} placement="right" arrow
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#8DBAFF',
                                            fontFamily: 'Prompt',
                                            fontSize: '12px',
                                            '& .MuiTooltip-arrow': {
                                                color: '#8DBAFF',
                                            },
                                        },
                                    },
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        borderRadius: '10px',
                                        marginLeft: '5px',
                                        marginRight: '5px',
                                        justifyContent: openSidebar ? 'initial' : 'center',
                                        px: 2.5,
                                        backgroundColor: activeItem === text ? '#8DBAFF' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: '#8DBAFF',
                                            borderRadius: '10px',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                                transform: 'scale(1.3)',
                                            },
                                            '& .MuiListItemText-primary': {
                                                color: 'white',
                                            },
                                        },
                                    }}
                                    onClick={() => handleNavigation(text, path)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openSidebar ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: activeItem === text ? '#ffffff' : '#8DBAFF',
                                            transform: activeItem === text ? 'scale(1.3)' : 'none',
                                            transition: 'transform 0.3s ease-in-out',
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            opacity: openSidebar ? 1 : 0,
                                            transition: 'font-size 0.3s ease-in-out',
                                            color: activeItem === text ? '#fff' : '#8DBAFF',
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                <List sx={{ top: '0.25rem' }}>
                    {[
                        { text: 'ข้อมูลติดต่อ', icon: <ContactsRoundedIcon />, path: '/ContactUs' },
                        { text: 'เกี่ยวกับแอปพลิเคชัน', icon: <InfoRoundedIcon />, path: '/about' },
                        { text: 'คู่มือการใช้งาน', icon: <PictureAsPdfRoundedIcon />, path: 'https://lifedee-service.gistda.or.th/Files/manual.pdf' },
                        { text: 'วีดีโอสาธิตการใช้งาน', icon: <SmartDisplayRoundedIcon />, path: 'https://youtu.be/JPDsKI9RjjY?si=NWR22e0_hHydOZGv' },
                    ].map(({ text, icon, path }) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={!openSidebar ? text : ''} placement="right" arrow
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#8DBAFF',
                                            fontFamily: 'Prompt',
                                            fontSize: '12px',
                                            '& .MuiTooltip-arrow': {
                                                color: '#8DBAFF',
                                            },
                                        },
                                    },
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        borderRadius: '10px',
                                        marginLeft: '5px',
                                        marginRight: '5px',
                                        justifyContent: openSidebar ? 'initial' : 'center',
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: '#8DBAFF',
                                            borderRadius: '10px',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                                transform: 'scale(1.3)',
                                            },
                                            '& .MuiListItemText-primary': {
                                                color: 'white',
                                            },
                                        },
                                    }}
                                    onClick={() => {
                                        if (path.startsWith('http')) {
                                          window.open(path, '_blank');
                                        } else {
                                          handleNavigation(text, path);
                                        }
                                      }}
                                    >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: openSidebar ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: '#8DBAFF',
                                            transition: 'all 0.3s ease-in-out',
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={{
                                            fontSize: '14px',
                                            opacity: openSidebar ? 1 : 0,
                                            transition: 'font-size 0.3s ease-in-out',
                                            color: '#8DBAFF',
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>

                <div className="nav-footer-content" style={{ opacity: openSidebar ? 1 : 0, transition: 'all 0.3s ease-in-out' }}>
                    <span>สนับสนุนข้อมูลโดย</span>

                    <div className="logo-container">
                        <img
                            src={MophLogo}
                            alt="icon"
                            className="MophLogo"
                            style={{ width: '35px', verticalAlign: 'middle' }}
                        />
                        <img
                            src={Gistda}
                            alt="icon"
                            className="Gistda"
                            style={{ width: '60px', verticalAlign: 'middle' }}
                        />
                        <img
                            src={PcLogo}
                            alt="icon"
                            className="Logo"
                            style={{ width: '42px', verticalAlign: 'middle' }}
                        />
                        <img
                            src={MeteoLogo}
                            alt="icon"
                            className="Logo"
                            style={{ width: '42px', verticalAlign: 'middle' }}
                        />
                    </div>
                </div>
            </Drawer>
        </Box>
    );
}
