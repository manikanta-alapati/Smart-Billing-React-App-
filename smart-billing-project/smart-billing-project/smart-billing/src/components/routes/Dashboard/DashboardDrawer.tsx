import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

const drawerWidth = 240;

const DashboardDrawer = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const section = [
    {
      name: "Billing",
      icon: <ReceiptLongIcon />,
      onClick: () => navigate("billing"),
    },
    {
      name: "History",
      icon: <HistoryIcon />,
      onClick: () => navigate("history"),
    },
    {
      name: "Profile",
      icon: <AccountCircleIcon />,
      onClick: () => navigate("profile"),
    },
    {
      name: "Products",
      icon: <InventoryIcon />,
      onClick: () => navigate("products"),
    },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {section.map(({ name, icon, onClick }) => (
            <ListItem key={name} onClick={onClick} disablePadding>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="Logout" onClick={logout} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default DashboardDrawer;
