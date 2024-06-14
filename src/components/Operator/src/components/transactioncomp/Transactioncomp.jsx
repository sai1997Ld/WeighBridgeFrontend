import React, { useState, useEffect, useRef } from "react";
import "./Transactioncomp.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Chart, ArcElement } from "chart.js/auto";
import SideBar5 from "../../../../SideBar/SideBar5";
import { Button } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import { Select, Input, InputNumber, DatePicker } from "antd";
import { Row, Col } from "antd";
import TicketComponent from "./PrintCompleted";
import { useReactToPrint } from "react-to-print";

const OperatorTransaction2 = () => {
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [weighments, setWeighments] = useState([]);
  const [pager, setPager] = useState(0);
  const [searchOption, setSearchOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const componentRef = useRef();

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const goToTransForm = (ticketNo, transactionType) => {
    if (transactionType === "Inbound") {
      navigate(`/OperatorTransactionFromInbound/?ticketNumber=${ticketNo}`);
    } else {
      navigate(`/OperatorTransactionFromOutbound/?ticketNumber=${ticketNo}`);
    }
  };

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);

  const itemsPerPage = 5;

  // const handlePageChange = ({ selected }) => {
  //   setPageNumber(selected);
  // };

  // Function to fetch data from the API
  const fetchData = (pageNumber) => {
    axios
      .get(
        `http://localhost:8080/api/v1/weighment/getCompletedTransaction?page=${pageNumber}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setWeighments(response.data.weighmentTransactionResponses);
        setTotalPages(response.data.totalPages);
        setPager(response.data.totalElements);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

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
  //Search

  // const { Option } = Select;
  const api = axios.create({
    baseURL: "http://localhost:8080/search/v1/Api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  }
);
  
  const handleSearchOptionChange = (value) => {
    setSearchOption(value);
    setSearchValue(""); // Reset the search value when the option changes
  };
  
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleSearch = async () => {
    if (searchValue === "") {
      // window.location.reload();
      fetchData(pageNumber);

      setWeighments([]);
      return;
    }
    // Corrected endpoint path
    let apiUrl = `${api.defaults.baseURL}/serachApi`;
  
    switch (searchOption) {
      case "ticketNo":
        apiUrl += `?ticketNo=${searchValue}`;
        break;
  
      case "vehicleNo":
        apiUrl += `?vehicleNo=${searchValue}`;
        break;
  
      default:
        break;
    }
  
    console.log("API URL:", apiUrl); // Log the API URL for debugging
  
    try {
      const response = await api.get(apiUrl);
  
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Response data:", responseData);
        // if (Array.isArray(responseData)) {
        //   setWeighments(responseData);
        // } else {
        //   setWeighments([responseData.weighmentTransactionResponses]);
        // }
        setWeighments(response.data.weighmentTransactionResponses)
      } else {
        console.error("Error: Received unexpected response status:", response.status);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  //print
  const handlePrint = async (ticketNo) => {
    const apiUrl = `http://localhost:8080/api/v1/weighment/getPrintTicketWise/${ticketNo}`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const ticketData = response.data;
        setTicketData(ticketData);
      } else {
        console.error("Error: Received unexpected response status");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (ticketData) {
      handlePrintClick();
    }
  }, [ticketData]);
  
  

  return (
    <SideBar5>
      <div
        style={{
          fontFamily: "Arial",
          color: "#333",
          "--table-border-radius": "30px",
        }}
      >
        <div className="container-fluid mt-0">
          <div className="mb-3 text-center">
            <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
              Completed Transaction
            </h2>
            <Row gutter={[16, 16]} justify="start" align="top">
              <Col
                xs={24}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control form-control-sm"
                  style={{ width: "110px" }}
                  value={currentDate}
                  disabled
                />
              </Col>
              <Col
                xs={24}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}>
                <Select
                  placeholder="Select a search option"
                  style={{ width: "200px" }}
                  onChange={handleSearchOptionChange}
                  // suffixIcon={<SearchOutlined />}
                >
                  <Option value="ticketNo">Search by Ticket No</Option>
                  <Option value="vehicleNo">Search by Vehicle No</Option>
                  {/* <Option value="supplier">Search by Supplier</Option>
                  <Option value="address">Search by Supplier's Address</Option> */}
                </Select>
                {searchOption && (
                  <Input
                   
                    placeholder={`Enter ${searchOption}`}
                    style={{ width: "200px" }}
                    value={searchValue}
                    onChange={handleInputChange}
                    onPressEnter={handleSearch}
                    // onChange={(searchValue) => {
            
                    //   handleInputChange(searchValue);
                    //   handleSearch(searchValue);
                    // }}
                  />
                )}
              </Col>
            </Row>
          </div>

          <div className="table-responsive" style={{ borderRadius: "10px" }}>
            <div>
              <table className="ant-table table table-striped">
                <thead className="ant-table-thead">
                  <tr className="ant-table-row">
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Ticket No.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Transaction Type
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Vehicle No.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;Transporter
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Supplier/Customer
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Gross Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Tare Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Net Wt.
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Material/Product
                    </th>
                    <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Print
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weighments.map((weighment) => (
                    <tr key={weighment.id}>
                      <td
                        className="ant-table-cell"
                        style={{ textAlign: "center" }}
                      >
                        <Button
                          onClick={() => {
                            goToTransForm(
                              weighment.ticketNo,
                              weighment.transactionType,
                              weighment.grossWeight,
                              weighment.tareWeight
                            );
                          }}
                          style={{ background: "#88CCFA" }}
                        >
                          {weighment.ticketNo}
                        </Button>
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.transactionType}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.vehicleNo}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.transporterName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.supplierName || weighment.customerName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.grossWeight}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.tareWeight}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.netWeight}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                        {weighment.materialName}
                      </td>

                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap", textAlign: "center" }}
                      >
                            <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "3px 6px" }}
                          onClick={() => {
                            handlePrint(weighment.ticketNo);
                          }}
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                        <div style={{ display: "none" }}>
                          <TicketComponent
                            ref={componentRef}
                            ticketData={ticketData}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 ml-2">
            <span>
              Showing {pageNumber * itemsPerPage + 1} to{" "}
              {Math.min(
                (pageNumber + 1) * itemsPerPage,
                pageNumber * itemsPerPage + weighments.length
              )}{" "}
              of {pager} entries
            </span>
            <div className="ml-auto">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(Math.max(0, pageNumber - 5))}
                disabled={pageNumber === 0}
              >
                &lt;&lt;
              </button>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 0}
              >
                &lt;
              </button>

              {Array.from({ length: 3 }, (_, index) => {
                const pageIndex = pageNumber + index;
                if (pageIndex >= totalPages) return null;
                return (
                  <button
                    key={pageIndex}
                    className={`btn btn-outline-primary btn-sm me-2 ${
                      pageIndex === pageNumber ? "active" : ""
                    }`}
                    style={{
                      color: pageIndex === pageNumber ? "#fff" : "#0077B6",
                      backgroundColor:
                        pageIndex === pageNumber ? "#0077B6" : "transparent",
                      borderColor: "#0077B6",
                      marginRight: "2px",
                    }}
                    onClick={() => setPageNumber(pageIndex)}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}
              {pageNumber + 3 < totalPages && <span>...</span>}
              {pageNumber + 3 < totalPages && (
                <button
                  className={`btn btn-outline-primary btn-sm me-2 ${
                    pageNumber === totalPages - 1 ? "active" : ""
                  }`}
                  style={{
                    color: pageNumber === totalPages - 1 ? "#fff" : "#0077B6",
                    backgroundColor:
                      pageNumber === totalPages - 1 ? "#0077B6" : "transparent",
                    borderColor: "#0077B6",
                    marginRight: "2px",
                  }}
                  onClick={() => setPageNumber(totalPages - 1)}
                >
                  {totalPages}
                </button>
              )}
              <button
                className="btn btn-outline-primary btn-sm me-2"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === totalPages - 1}
              >
                &gt;
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                style={{
                  color: "#0077B6",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() =>
                  setPageNumber(Math.min(totalPages - 1, pageNumber + 5))
                }
                disabled={pageNumber === totalPages - 1}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </SideBar5>
  );
};

export default OperatorTransaction2;
