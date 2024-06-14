import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Typography, Popover, List, ListItem, ListItemText } from "@mui/material";
import "./Header.css";

function Header({ toggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userName = sessionStorage.getItem("userName");
  const roles = sessionStorage.getItem("roles");
  const userId = sessionStorage.getItem("userId");
  const open = Boolean(anchorEl);

  return (
    <div className="rp-report-header d-flex justify-content-between align-items-center">
      <FontAwesomeIcon
        icon={faBars}
        className="rp-sidebar-daily-report-icon mt-2 me-3 rp-sidebar-toggle-btn"
        onClick={toggleSidebar}
      />
      <h2 className="rp-report-header-title text-center mt-3">
        WEIGHBRIDGE MANAGEMENT SYSTEM
      </h2>
      <div>
        <FontAwesomeIcon
          icon={faUser}
          className="rp-daily-report-icon mt-2 me-2 rp-home-toggle-btn"
          onClick={handleUserProfileClick}
        />
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
        >
          <List>
            <ListItem>
              <ListItemText primary={`User ID: ${userId}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`User Name: ${userName}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Roles: ${roles}`} />
            </ListItem>
          </List>
        </Popover>
      </div>
    </div>
  );
}

export default Header;