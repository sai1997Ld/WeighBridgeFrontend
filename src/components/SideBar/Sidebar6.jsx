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
  Assignment,
  Build,
  PowerSettingsNewOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const SideBar6 = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:600px)");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
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

  const handleSignOut2 = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to sign out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
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
      }
    });
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
          <IconButton onClick={toggleSideBar}>
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
        open={isSideBarOpen}
        onClose={toggleSideBar}
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
        <List sx={{ marginTop: "65px;" }}>
          <ListItemButton
            component={Link}
            to="/sales-dashboard"
            onClick={() => handleItemClick("dashboard")}
            selected={selectedItem === "dashboard"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1", // Update the hover color for the selected state
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
            to="/SalesOrder"
            onClick={() => handleItemClick("SalesOrder")}
            selected={selectedItem === "SalesOrder"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1", // Update the hover color for the selected state
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Sales Order" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/ProcessOrder"
            onClick={() => handleItemClick("ProcessOrder")}
            selected={selectedItem === "ProcessOrder"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&:hover": {
                backgroundColor: "#3e8ee6",
                color: "white",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1", // Update the hover color for the selected state
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary="Sales Pass" />
          </ListItemButton>
          <ListItemButton
            onClick={handleSignOut2}
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
          flexGrow: 1,
          // marginLeft: isSideBarOpen ? "240px" : "0px",
          padding: "16px",
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </div>
    </>
  );
};
export default SideBar6;
