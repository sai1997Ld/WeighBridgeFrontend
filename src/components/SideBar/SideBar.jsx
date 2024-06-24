import { useState } from "react";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Sidebar.css";

import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
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
  ExpandLess,
  ExpandMore,
  Person,
  DirectionsCar,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Build,
  BusinessCenter,
  Store,
  VideoCallRounded,
  Commute,
  Group,
  ExitToApp,
  Home,
  Handyman,
  ProductionQuantityLimits,
  PowerSettingsNewOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const SideBar = ({ children }) => {
  const [openUser, setOpenUser] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openTransport, setOpenTransport] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);

  const [openCustomer, setOpenCustomer] = useState(false);
  const [openMaterial, setOpenMaterial] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLargeScreen = useMediaQuery("(min-width:768px)");

  const handleUserClick = () => {
    setOpenUser(!openUser);
    setSelectedItem(openUser ? null : "user");
  };

  const handleCompanyClick = () => {
    setOpenCompany(!openCompany);
    setSelectedItem(openCompany ? null : "company");
  };

  const handleTransportClick = () => {
    setOpenTransport(!openTransport);
    setSelectedItem(openTransport ? null : "transport");
  };

  const handleVehicleClick = () => {
    setOpenVehicle(!openVehicle);
    setSelectedItem(openVehicle ? null : "vehicle");
  };

  const handleSupplierClick = () => {
    setOpenSupplier(!openSupplier);
    setSelectedItem(openSupplier ? null : "supplier");
  };

  const handleCustomerClick = () => {
    setOpenCustomer(!openCustomer);
    setSelectedItem(openCustomer ? null : "customer");
  };

  const handleMaterialClick = () => {
    setOpenMaterial(!openMaterial);
    setSelectedItem(openMaterial ? null : "material");
  };

  const handleProductClick = () => {
    setOpenProduct(!openProduct);
    setSelectedItem(openProduct ? null : "product");
  };

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
            backgroundColor: "rgb(228, 232, 237)",
          },
        }}
      >
        <List sx={{ marginTop: "65px;" }}>
          <ListItemButton
            component={Link}
            to="/home1"
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
            onClick={handleUserClick}
            selected={selectedItem === "user"}
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
              <Person />
            </ListItemIcon>
            <ListItemText primary="User Management" />
            {openUser ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUser} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/create-user"
                onClick={() => handleItemClick("createUser")}
                selected={selectedItem === "createUser"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add User" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/manage-user"
                onClick={() => handleItemClick("maintainUser")}
                selected={selectedItem === "maintainUser"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage User" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/role-management"
            selected={selectedItem === "role"}
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
            <ListItemText primary="Role Management" />
          </ListItemButton>

          <ListItemButton
            onClick={handleCompanyClick}
            selected={selectedItem === "company"}
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
              <BusinessCenter />
            </ListItemIcon>
            <ListItemText primary="Company Management" />
            {openCompany ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCompany} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/company-management"
                onClick={() => handleItemClick("createCompany")}
                selected={selectedItem === "createCompany"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Company" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-company"
                onClick={() => handleItemClick("maintainCompany")}
                selected={selectedItem === "maintainCompany"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Company" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/site-management"
            onClick={() => handleItemClick("siteManagement")}
            selected={selectedItem === "siteManagement"}
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
              <Home />
            </ListItemIcon>
            <ListItemText primary="Site Management" />
          </ListItemButton>

          <ListItemButton
            onClick={handleTransportClick}
            selected={selectedItem === "transport"}
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
              <Commute />
            </ListItemIcon>
            <ListItemText primary="Transporter Management" />
            {openTransport ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openTransport} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/transporter"
                onClick={() => handleItemClick("createTransport")}
                selected={selectedItem === "createTransport"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Transporter" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-transporter"
                onClick={() => handleItemClick("maintainTransport")}
                selected={selectedItem === "maintainTransport"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Transporter" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleVehicleClick}
            selected={selectedItem === "vehicle"}
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
              <DirectionsCar />
            </ListItemIcon>
            <ListItemText primary="Vehicle Management" />
            {openVehicle ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openVehicle} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/vehicle"
                onClick={() => handleItemClick("createVehicle")}
                selected={selectedItem === "createVehicle"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Vehicle" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-vehicle"
                onClick={() => handleItemClick("maintainVehicle")}
                selected={selectedItem === "maintainVehicle"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Vehicle" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleSupplierClick}
            selected={selectedItem === "supplier"}
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
              <Store />
            </ListItemIcon>
            <ListItemText primary="Supplier Management" />
            {openSupplier ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSupplier} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/Supplier"
                onClick={() => handleItemClick("createSupplier")}
                selected={selectedItem === "createSupplier"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Supplier" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-supplier"
                onClick={() => handleItemClick("maintainSupplier")}
                selected={selectedItem === "maintainSupplier"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Supplier" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleCustomerClick}
            selected={selectedItem === "customer"}
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
              <Group />
            </ListItemIcon>
            <ListItemText primary="Customer Management" />
            {openCustomer ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCustomer} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/Customer"
                onClick={() => handleItemClick("createCustomer")}
                selected={selectedItem === "createCustomer"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Customer" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-customer"
                onClick={() => handleItemClick("maintainCustomer")}
                selected={selectedItem === "maintainCustomer"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    // backgroundColor: "#3e8ee6",
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    // backgroundColor: "#2c74d1", // Update the hover color for the selected state
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Manage Customer" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleMaterialClick}
            selected={selectedItem === "material"}
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
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <Handyman />
            </ListItemIcon>
            <ListItemText primary="Material Management" />
            {openMaterial ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMaterial} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/material-management"
                onClick={() => handleItemClick("addMaterial")}
                selected={selectedItem === "addMaterial"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Material" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-material"
                onClick={() => handleItemClick("viewMaterial")}
                selected={selectedItem === "viewMaterial"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Material" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={handleProductClick}
            selected={selectedItem === "product"}
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
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <ProductionQuantityLimits />
            </ListItemIcon>
            <ListItemText primary="Product Management" />
            {openProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openProduct} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ paddingLeft: "55px", listStyleType: "disc" }}
            >
              <ListItemButton
                component={Link}
                to="/product-management"
                onClick={() => handleItemClick("addProduct")}
                selected={selectedItem === "addProduct"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="Add Product" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/view-product"
                onClick={() => handleItemClick("viewProduct")}
                selected={selectedItem === "viewProduct"}
                sx={{
                  "&.Mui-selected, &:hover": {
                    color: "#3e8ee6",
                  },
                  "&.Mui-selected:hover": {
                    color: "#2c74d1",
                  },
                  display: "list-item",
                }}
              >
                <ListItemText primary="View Product" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/CameraMaster"
            onClick={() => handleItemClick("camera")}
            selected={selectedItem === "camera"}
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
                backgroundColor: "#2c74d1",
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <VideoCallRounded />
            </ListItemIcon>
            <ListItemText primary="Camera" />
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
              "&.Mui-selected:hover": {
                backgroundColor: "#2c74d1", // Update the hover color for the selected state
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "16px",
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default SideBar;
