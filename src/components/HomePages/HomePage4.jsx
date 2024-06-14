import React, { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar5 from "../SideBar/SideBar5";
import OperatorHome from "../Operator/src/components/homed/Homed";
import OperatorTransaction from "../Operator/src/components/transaction/Transaction";
// import DasboardOperator from "../Operator/src/components/dashboard/Dashboard.jsx";

function HomePage4() {
   
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
    <div>
     < OperatorTransaction/>
      </div>
  );
}

export default HomePage4;