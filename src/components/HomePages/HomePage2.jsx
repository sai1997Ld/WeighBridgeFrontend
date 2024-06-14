import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar3 from "../SideBar/SideBar3";
import QualityCheck from "../QualityCheck/src/components/QualityCheck/QualityCheck";
import "./HomePage1.css";

function HomePage2() {
   
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
      <QualityCheck/>
    </div>
  );
}

export default HomePage2;