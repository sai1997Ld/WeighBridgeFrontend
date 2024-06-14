import "./homed.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faSearch,
  faBellSlash,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";

import SideBar5 from "../../../../SideBar/SideBar5";

const OperatorHome= () => {
  
  const [showNotification, setShowNotification] = useState(false);
  

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
   
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
 
 
  useEffect(() => {
    Chart.register(ArcElement);
 
    const resizeObserver = new ResizeObserver(() => {
      if (
        homeMainContentRef.current &&
        chartRef.current?.chartInstance &&
        chartRef2.current?.chartInstance
      ) {
        chartRef.current.chartInstance.resize();
        chartRef2.current.chartInstance.resize();
      }
    });
 
    if (homeMainContentRef.current) {
      resizeObserver.observe(homeMainContentRef.current);
    }
 
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
 
 

  return (
    <div className="home-page">
      

<SideBar5
  isSidebarExpanded={isSidebarExpanded}
  toggleSidebar={toggleSidebar}
/>
      <div className="home-header d-flex justify-content-center">
      </div>
      <div className="home-logo-container-1 container-fluid">
        <div className="row justify-content-end">
          <div className="col-auto">
            <FontAwesomeIcon
              icon={faSearch}
              className="header-icon mx-2"
              style={{ fontSize: "1.2rem" }}
            />
            <FontAwesomeIcon
              icon={faBellSlash}
              onClick={toggleNotification}
              className="header-icon mx-2"
              style={{ fontSize: "1.2rem" }}
            />
            {showNotification && (
              <div className="notification-popup mt-3">
                <ul>
                  <li>Dummy Notification 1</li>
                  <li>Dummy Notification 2</li>
                  <li>Dummy Notification 3</li>
                  <li>Dummy Notification 4</li>
                </ul>
              </div>
            )}
            <FontAwesomeIcon
              icon={faUserCircle}
              className="header-icon mx-2"
              style={{ fontSize: "1.2rem" }}
            />
          </div>
        </div>
      </div>
      <div className="card p-3 mb-3 home home-card mt-5 mx-auto"  style={{ marginRight: '50px' }}>
      <h1>Weighbridge Operator</h1>
          <label className="fw-bold home-label">Company:</label>
          <select className="form-select w-100">
            <option value="Vikram Pvt Ltd">Vikram Pvt Ltd</option>
            <option value="Highlander">Highlander</option>
            <option value="Rider">Rider</option>
          </select>
          <label className="fw-bold mt-3 home-label">Site:</label>
          <select className="form-select w-100">
            <option>Bhubaneswar</option>
            <option value="Roulkela">Roulkela</option>
            <option value="Aska">Aska</option>
            <option value="Puri">Puri</option>
          </select>
        </div>
        
        </div>
      
  )
}

export default OperatorHome;
