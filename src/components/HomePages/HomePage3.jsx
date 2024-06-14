import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar2 from "../SideBar/SideBar2";
import VehicleEntry from "../GateUser/src/components/Vehicle_Entry/VehicleEntry";

function HomePage3() {
   
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
      <VehicleEntry />
      </div>
  );
}

export default HomePage3;