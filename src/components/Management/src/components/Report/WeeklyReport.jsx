import { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";
import "./WeeklyReport.css";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import {
  faHome,
  faFileAlt,
  faVideo,
  faMapMarked,
  faExchangeAlt,
  faTruck,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

function WeeklyReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  const navigate = useNavigate();

  const handlehome = () => {
    navigate("/home");
  };

  const data = useMemo(
    () => [
      {
        date: "2024-03-01",
        ticketNo: 1,
        truckNo: "00 02 Al 1860",
        product: "Coal",
        poNo: 120012,
        tpNo: "21T-11000000076981",
        grossWt: 3265,
        tareWt: 1936,
        netWt: 1329,
      },
      {
        date: "2024-03-02",
        ticketNo: 2,
        truckNo: "00 14 OD 1334",
        product: "Hariana",
        poNo: 16123456,
        tpNo: "21T-11000000076982",
        grossWt: 3265,
        tareWt: 1935,
        netWt: 1330,
      },
      {
        date: "2024-03-03",
        ticketNo: 3,
        truckNo: "04-hk-a-j-1022",
        product: "Coal",
        poNo: 232452,
        tpNo: "21T-11000000076983",
        grossWt: 2898,
        tareWt: 2065,
        netWt: 833,
      },
      {
        date: "2024-03-04",
        ticketNo: 4,
        truckNo: "Ch 02-d-a 2420",
        product: "Coal",
        poNo: 543124,
        tpNo: "21T-11000000076984",
        grossWt: 3000,
        tareWt: 1970,
        netWt: 1030,
      },
      {
        date: "2024-03-03",
        ticketNo: 5,
        truckNo: "00-kj-1-a-841",
        product: "Hematite",
        poNo: 323144,
        tpNo: "21T-11000000076985",
        grossWt: 2969,
        tareWt: 2144,
        netWt: 825,
      },
      {
        date: "2024-03-06",
        ticketNo: 6,
        truckNo: "Gd-28-a-j-1825",
        product: "Coal",
        poNo: 241524,
        tpNo: "21T-11000000076986",
        grossWt: 3265,
        tareWt: 2136,
        netWt: 1129,
      },
      {
        date: "2024-03-07",
        ticketNo: 7,
        truckNo: "Gd-28-sa-v-893",
        product: "Coal",
        poNo: 210973,
        tpNo: "21T-11000000076987",
        grossWt: 3100,
        tareWt: 1700,
        netWt: 1400,
      },
      {
        date: "2024-03-08",
        ticketNo: 8,
        truckNo: "Cb-34-rs-k-800",
        product: "Dovermin",
        poNo: 5918873,
        tpNo: "21T-11000000076988",
        grossWt: 3265,
        tareWt: 1835,
        netWt: 1430,
      },
      {
        date: "2024-03-09",
        ticketNo: 9,
        truckNo: "Ch 02-sa-a-6843",
        product: "Coal",
        poNo: 212345,
        tpNo: "21T-11000000076989",
        grossWt: 2899,
        tareWt: 1999,
        netWt: 900,
      },
      {
        date: "2024-03-10",
        ticketNo: 10,
        truckNo: "Gd-25-tc-h-5123",
        product: "Coal",
        poNo: 281783,
        tpNo: "21T-11000000076990",
        grossWt: 3265,
        tareWt: 2235,
        netWt: 1030,
      },
      {
        date: "2024-03-11",
        ticketNo: 11,
        truckNo: "Ch 02-sa-a-6843",
        product: "Coal",
        poNo: 212345,
        tpNo: "21T-11000000076991",
        grossWt: 2899,
        tareWt: 1999,
        netWt: 900,
      },
    ],
    []
  );

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setSelectedStartDate(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Set end date to 6 days after start date
    setSelectedEndDate(endDate.toISOString().split("T")[0]);
    updateWeekRange(startDate, endDate.toISOString().split("T")[0]);
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setSelectedEndDate(endDate);
    updateWeekRange(selectedStartDate, endDate);
  };

  const updateWeekRange = (startDate, endDate) => {
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Adjust to Monday of the week
    const endOfWeek = new Date(endDate);
    setSelectedWeek(
      `${startOfWeek.toISOString().split("T")[0]} - ${
        endOfWeek.toISOString().split("T")[0]
      }`
    );
  };

  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Adjust to Monday of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Sunday of the week
    setSelectedStartDate(startOfWeek.toISOString().split("T")[0]);
    setSelectedEndDate(endOfWeek.toISOString().split("T")[0]);
    updateWeekRange(startOfWeek, endOfWeek);
  }, []);
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate >= new Date(selectedStartDate) &&
        itemDate <= new Date(selectedEndDate)
      );
    });
  }, [data, selectedStartDate, selectedEndDate]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // const tableData = useMemo(() => {
  //   return currentItems.map((item) => ({
  //     date: item.date,
  //     ticketNo: item.ticketNo,
  //     truckNo: item.truckNo,
  //     product: item.product,
  //     poNo: item.poNo,
  //     tpNo: item.tpNo,
  //     grossWt: item.grossWt,
  //     tareWt: item.tareWt,
  //     netWt: item.netWt,
  //   }));
  // }, [currentItems]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "WeeklyReport");
    XLSX.writeFile(wb, "weekly_report.xlsx");
  };

  return (
    <div>
      <div className="report-header d-flex justify-content-between align-items-center">
        <div></div>
        <h2 className="report-header-title text-center mt-3">Weekly Report</h2>
        <FontAwesomeIcon
          icon={faHome}
          className="daily_report_icon mt-2 "
          onClick={handlehome}
        />
      </div>
      <div className="home-sidebar d-flex flex-column text-center">
        <Link to="/vehicle-entry" className="sidebar-item">
          <FontAwesomeIcon icon={faTruck} className="sidebar-icon" />
          <span className="sidebar-item-text">Vehicle Entered</span>
        </Link>
        <Link to="/live-location" className="sidebar-item">
          <FontAwesomeIcon icon={faMapMarked} className="sidebar-icon" />
          <span className="sidebar-item-text">Live Location</span>
        </Link>
        <Link to="/live-transaction" className="sidebar-item">
          <FontAwesomeIcon icon={faExchangeAlt} className="sidebar-icon" />
          <span className="sidebar-item-text">Live Transaction</span>
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
      <div className="daily-report-main-content">
        <div className="daily-report-date d-flex flex-column align-items-start ml-3 mt-3">
          <div className="mb-3">
            <label htmlFor="startDate" className="mb-0 mr-3">
              &nbsp;Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="form-control"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              style={{ marginLeft: "5px" }}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-0 mr-3">
              &nbsp; End Date:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="form-control"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              style={{ marginLeft: "5px" }}
            />
          </div>
        </div>
        <div className="daily-report-table table-responsive-xl table-responsive-md table-responsive-lg table-responsive-sm table-responsive-xxl mt-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Ticket no.</th>
                <th scope="col">Truck no.</th>
                <th scope="col">Product</th>
                <th scope="col">Po no.</th>
                <th scope="col">TP no.</th>
                <th scope="col">Gross Wt.</th>
                <th scope="col">Tare Wt.</th>
                <th scope="col">Net Wt.</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.ticketNo}</td>
                  <td>{item.truckNo}</td>
                  <td>{item.product}</td>
                  <td>{item.poNo}</td>
                  <td>{item.tpNo}</td>
                  <td>{item.grossWt}</td>
                  <td>{item.tareWt}</td>
                  <td>{item.netWt}</td>
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
            // Custom styling to hide the page count
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

        {/* <div className="mt-5 mb-3 d-flex justify-content-center gap-5 button-container fixed-bottom">
        <button className="icon-button" onClick={handlehome}>
          <FontAwesomeIcon icon={faHome} size="lg" />
          <span className="ms-1">Home</span>
        </button>
        <button className="icon-button" onClick={handleback}>
          <FontAwesomeIcon icon={faBackward} size="lg" />
          <span className="ms-1">Back</span>
        </button>
        <button className="icon-button" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faPowerOff} size="lg" />
          <span className="ms-1">Sign Out</span>
        </button>
      </div> */}
      </div>
    </div>
  );
}

export default WeeklyReport;
