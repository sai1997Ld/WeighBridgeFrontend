import { useState } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,

  IconButton,
  ListItemButton,
  Typography,
  Box,
  useMediaQuery,
  Popover,
  Divider,
  Avatar,
} from "@mui/material";
import {

  Person,

  Dashboard as DashboardIcon,
  Menu as MenuIcon,

  ExitToApp,

  PowerSettingsNewOutlined ,
} from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const SideBar5 = ({ children }) => {
  // const [openDashboard, setOpenDashboard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:600px)");

  // const handleDasboardClick = () => {
  //   setOpenDashboard(!openDashboard);
  //   setSelectedItem(openDashboard ? null : "dashboard");
  // };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userName = sessionStorage.getItem("userName");
  const roles = JSON.parse(sessionStorage.getItem("roles"));
  const userId = sessionStorage.getItem("userId");
  console.log(userName, roles, userId);

  const open = Boolean(anchorEl);

  const handleSignOut = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear browser history and redirect
    window.location.href = "/";

    // Additional history manipulation to prevent users from navigating back
    if (window.history && window.history.pushState) {
      // Use replaceState to clear the existing history
      window.history.replaceState(null, null, "/");

      // Add a dummy entry to the history to replace current entry
      window.history.pushState(null, null, "/");

      // Prevent users from navigating back to the previous state
      window.onpopstate = function (event) {
        window.history.go(1);
      };
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgb(14, 23, 38)",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          {isLargeScreen && (
            <Typography
              variant={isLargeScreen ? "h6" : "h5"}
              sx={{ color: "white" }}
            >
              Weighbridge Management System
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                marginRight: "8px",
                fontFamily: "monospace", // Adjust the spacing between roles and Avatar
              }}
            >
              {userName.split(" ")[0]}
            </Typography>
            <Avatar
              onClick={handleUserProfileClick}
              sx={{
                backgroundColor: "#3e8ee6",
                color: "white",
              }}
            >
              {/* Display user's initials */}
              {userName
                ? `${userName.split(" ")[0][0]}${
                    userName.split(" ")[1] ? userName.split(" ")[1][0] : ""
                  }`
                : ""}
            </Avatar>
          </Box>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#394253",
                overflow: "visible",
                marginTop: "10px",
                marginX: "10px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "#394253",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  color: "black",
                  width: 56,
                  height: 56,
                  margin: "auto",
                  mb: 2,
                }}
              >
                <Person />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ color: "white", textAlign: "center", mb: 1 }}
              >
                {userName}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  textAlign: "center",
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                User ID: {userId}
              </Typography>
              <Divider sx={{ backgroundColor: "white", mb: 1 }} />
              <Typography
                sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}
              >
                Roles: {roles.join(", ")}
              </Typography>
              <IconButton color="error" onClick={handleSignOut} sx={{ mt: 2 }}>
                <PowerSettingsNewOutlined />
              </IconButton>
            </Box>
          </Popover>
        </Box>
      </Box>
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: 240,
          flexShrink: 0,
          zIndex: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            position: "fixed",
            boxSizing: "border-box",
            backgroundColor: "rgb(229, 232, 237)",
          },
        }}
      >
        <List sx={{ marginTop: "65px" }}>
           <ListItemButton
            component={Link}
            to="/OperatorTransaction"
            onClick={() => handleItemClick("Transactions")}
            selected={selectedItem === "Transactions"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
            

          <ListItemButton
            component={Link}
            to="/OperatorTransactionComp"
            onClick={() => handleItemClick("Transactions")}
            selected={selectedItem === "Transactions"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Completed Dashboard" />
          </ListItemButton> 

         

          {/* <ListItemButton
            component={Link}
            // to="/print"
            onClick={() => handleItemClick("Print")}
            selected={selectedItem === "Print"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <PrintIcon />
            </ListItemIcon>
            <ListItemText primary="Print" />
          </ListItemButton> */}
          <ListItemButton
            component={Link}
            to="/OperatorReport"
            onClick={() => handleItemClick("Reports")}
            selected={selectedItem === "Reports"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <SummarizeIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>

          <ListItemButton
            onClick={handleSignOut}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </List>
      </Drawer>
      <div
        style={{
          transition: "margin-left 0.3s ease",
          // marginLeft: isSidebarOpen ? "240px" : "0",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
};
export default SideBar5;
