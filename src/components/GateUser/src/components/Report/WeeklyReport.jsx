import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./WeeklyReport.css";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  faHome,
  faTruck,
  faPrint,
  faVideo,
  faFileAlt,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

function WeeklyReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedWeek, setSelectedWeek] = useState("");
  const [data] = useState([
    {
      week: "2024-04-01 to 2024-04-07",
      supplier: "ABC Mining Co.",
      customer: "Global Manufacturers",
      inTime: "09:00 AM",
      material: "Bauxite",
      netWeight: 5000,
      outTime: "04:30 PM",
    },
    {
      week: "2024-04-01 to 2024-04-07",
      supplier: "MCL",
      customer: "Kasi Vishwanath",
      inTime: "11:00 AM",
      material: "Coal",
      netWeight: 3500,
      outTime: "02:15 PM",
    },
  ]);
  const navigate = useNavigate();

  const handlehome = () => {
    navigate("/home");
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setCurrentPage(0);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    const startYear = weekStart.getFullYear();
    const startMonth = String(weekStart.getMonth() + 1).padStart(2, "0");
    const startDay = String(weekStart.getDate()).padStart(2, "0");
    const endYear = weekEnd.getFullYear();
    const endMonth = String(weekEnd.getMonth() + 1).padStart(2, "0");
    const endDay = String(weekEnd.getDate()).padStart(2, "0");
    return `${startYear}-${startMonth}-${startDay} to ${endYear}-${endMonth}-${endDay}`;
  };


  const filteredData = selectedWeek
    ? data.filter((item) => item.week === selectedWeek)
    : data;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(currentItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WeeklyReport");
    XLSX.writeFile(wb, "weekly_report.xlsx");
  };

  return (
    <div>
      <div className="report-header d-flex justify-content-between align-items-center">
        <div></div>
        <h3 className="report-header-title text-center mt-3">Weekly Report</h3>
        <FontAwesomeIcon
          icon={faHome}
          className="daily_report_icon mt-2 "
          onClick={handlehome}
        />
      </div>
      <div className="home-sidebar d-flex flex-column text-center">
        <Link to="/VehicleEntry" className="sidebar-item">
          <FontAwesomeIcon icon={faTruck} className="sidebar-icon" />
          <span className="sidebar-item-text">Vehicle Entry</span>
        </Link>
        <Link to="/print" className="sidebar-item">
          <FontAwesomeIcon icon={faPrint} className="sidebar-icon" />
          <span className="sidebar-item-text">Print</span>
        </Link>
        <Link to="/camera" className="sidebar-item">
          <FontAwesomeIcon icon={faVideo} className="sidebar-icon" />
          <span className="sidebar-item-text">Camera</span>
        </Link>
        <Link to="/report" className="sidebar-item">
          <FontAwesomeIcon icon={faFileAlt} className="sidebar-icon rp-icon" />
          <span className="sidebar-item-text">Reports</span>
        </Link>
        <Link to="/" className="sidebar-item">
          <FontAwesomeIcon icon={faSignOut} className="sidebar-icon" />
          <span className="sidebar-item-text">Logout</span>
        </Link>
      </div>
      <div className="weekly-report-main-content">
        <div className="weekly-report-date d-flex">
          <label htmlFor="week" className="mt-1">
            &nbsp;Week:&nbsp;
          </label>
          <input
            type="week"
            id="week"
            name="week"
            className="form-control w-auto"
            value={selectedWeek}
            onChange={handleWeekChange}
            max={getCurrentWeek()}
          />
        </div>
        <div className="weekly-report-table table-responsive-xl table-responsive-md table-responsive-lg table-responsive-sm table-responsive-xxl mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">Supplier</th>
                <th scope="col">Customer</th>
                <th scope="col">In Time</th>
                <th scope="col">Material</th>
                <th scope="col">Net Weight</th>
                <th scope="col">Out Time</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.supplier}</td>
                  <td>{item.customer}</td>
                  <td>{item.inTime}</td>
                  <td>{item.material}</td>
                  <td>{item.netWeight}</td>
                  <td>{item.outTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            activeClassName={"active"}
            pageClassName={"d-none"}
            breakClassName={"d-none"}
            pageLinkClassName={"d-none"}
            marginPagesDisplayed={0}
            breakLabel={null}
          />
        )}
        <div className="text-center mt-1">
          <button
            className="btn btn-primary download-btn"
            onClick={handleDownload}
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport;