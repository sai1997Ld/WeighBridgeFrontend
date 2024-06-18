import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar3 from "../../../../SideBar/SideBar3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord, faPrint } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Input, InputNumber, DatePicker, Select, Modal } from "antd";
import moment from "moment";
import { Button, Dropdown, Menu } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
// import PrintTicket from "./PrintTicket";
import axios from "axios"; // Import axios
 
// Styled component for the table
const StyledTable = styled.table`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
 
const fetchAllTransactions = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/qualities/qct-completed?`,
      {
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {

        return data;

      } else {

        console.error("Unexpected data format:", data);

        return [];

      }
    } else {
      console.error("Failed to fetch all transactions:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return [];
  }
};
 
function QualityCompleted() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("select"); // State for search type
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const navigate = useNavigate();
  const componentRef = useRef();
  const [ticketData, setTicketData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [transactionType, setTransactionType] = useState("inbound"); // Default to 'inbound', adjust as necessary
 
  const [printData, setPrintData] = useState(null);
  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };
 
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllTransactions();
      setAllData(data);
      setFilteredData(data);
    };
 
    fetchData();
  }, []);
 
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(allData);
    }
  }, [searchQuery, allData]);
 
  const homeMainContentRef = useRef(null);
 
  const fetchMaterialOptions = async () => {
    try {
      const materialResponse = await fetch(
        "http://localhost:8080/api/v1/qualities/fetch-ProductsOrMaterials",
        {
          credentials: "include",
        }
      );
 
      if (materialResponse.ok) {
        const materialData = await materialResponse.json();
        const combinedOptions = [...materialData];
        setMaterialOptions(combinedOptions);
      } else {
        console.error(
          "Failed to fetch material or product options:",
          materialResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching material or product options:", error);
    }
  };
 
  const [materialOptions, setMaterialOptions] = useState([]);
 
  useEffect(() => {
    fetchMaterialOptions();
  }, []);
 
  const fetchInboundTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/qualities/inbound-qct-completed",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
        setAllData(data);
      } else {
        console.error("Failed to fetch inbound transactions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching inbound transactions:", error);
    }
  };
 
  const fetchOutboundTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/qualities/outbound-qct-completed",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
        setAllData(data);
      } else {
        console.error("Failed to fetch outbound transactions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching outbound transactions:", error);
    }
  };
 
  const handleMaterialFilter = ({ key }) => {
    if (key.startsWith("material-")) {
      const selectedIndex = parseInt(key.split("-")[1], 10);
      setSelectedMaterial(materialOptions[selectedIndex]);
      setCurrentPage(0);
      const filtered = allData.filter((item) =>
        (selectedTransactionType === "" ||
          item.transactionType.toLowerCase() ===
          selectedTransactionType.toLowerCase()) &&
        (materialOptions[selectedIndex] === "" ||
          item.materialName.toLowerCase() === materialOptions[selectedIndex].toLowerCase())
      );
      setFilteredData(filtered);
    } else if (key === "transaction-inbound") {
      setSelectedTransactionType("Inbound");
      setCurrentPage(0);
      fetchInboundTransactions();
    } else if (key === "transaction-outbound") {
      setSelectedTransactionType("Outbound");
      setCurrentPage(0);
      fetchOutboundTransactions();
    }
  };
 
  const menu = (
    <Menu onClick={handleMaterialFilter}>
      <Menu.SubMenu key="1" title="Product/Material">
        {materialOptions.map((option, index) => (
          <Menu.Item key={`material-${index}`}>{option}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="2" title="Transaction Type">
        <Menu.Item key="transaction-inbound">Inbound</Menu.Item>
        <Menu.Item key="transaction-outbound">Outbound</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
 
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
 
  const handlehome = () => {
    navigate("/home");
  };
 
  const handleTicketClick = (ticketNumber, productMaterial) => {
    const item = allData.find((item) => item.ticketNo === ticketNumber);
    if (item) {
      const queryString = new URLSearchParams(item).toString();
      if (productMaterial === "Coal" || productMaterial === "Iron Ore" || productMaterial === "Dolomite") {
        navigate("/QualityInboundDetails?" + queryString);
      } else if (productMaterial === "Sponge Iron" || productMaterial === "Dolochar") {
        navigate("/QualityOutboundDetails?" + queryString);
      }
    }
  };
 
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const handleSearch = async () => {
    if (searchQuery === "") {
      setFilteredData(allData);
      return;
    }
    if (searchType === "ticketNo") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchByTicketNo/${searchQuery}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFilteredData(data);
          } else {
            // Wrap the single object in an array
            setFilteredData([data]);
          }
        } else {
          console.error("Failed to search by ticket number:", response.status);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error searching by ticket number:", error);
        setFilteredData([]);
      }
    } else if (searchType === "vehicleNo") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchByVehicleNo/${searchQuery}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by vehicle number:", response.status);
        }
      } catch (error) {
        console.error("Error searching by vehicle number:", error);
      }
    } else if (searchType === "supplier") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerName=${searchQuery}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by supplier name:", response.status);
        }
      } catch (error) {
        console.error("Error searching by supplier name:", error);
      }
    } else if (searchType === "supplierAddress") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/qualities/searchBySupplierOrCustomer?supplierOrCustomerAddress=${searchQuery}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredData(data);
        } else {
          console.error("Failed to search by supplier address:", response.status);
        }
      } catch (error) {
        console.error("Error searching by supplier address:", error);
      }
    }
  };
  const handleQualityReportDownload = async (ticketNo) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qualities/report-response/${ticketNo}`,      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      const doc = new jsPDF();
      const text = data.companyName;
      const textWidth = doc.getTextWidth(text);
      const pageWidth = doc.internal.pageSize.getWidth();
      const x = (pageWidth - textWidth) / 2;
      doc.setFontSize(18);
      doc.text(text, x, 22);
 
      doc.setFontSize(12);
      doc.setTextColor(100);
      const subtitle1 = data.companyAddress;
      const formatDate = (date) => {
        const d = new Date(date);
        let day = d.getDate();
        let month = d.getMonth() + 1;
        const year = d.getFullYear();
 
        if (day < 10) {
          day = '0' + day;
        }
        if (month < 10) {
          month = '0' + month;
        }
        return `${day}-${month}-${year}`;
      };
      const subtitle2 = `Generated on: ${formatDate(new Date())}`;
      const subtitleWidth1 = doc.getTextWidth(subtitle1);
      const subtitleWidth2 = doc.getTextWidth(subtitle2);
      const subtitleX1 = (pageWidth - subtitleWidth1) / 2;
      const subtitleX2 = (pageWidth - subtitleWidth2) / 2;
      doc.text(subtitle1, subtitleX1, 32);
      doc.text(subtitle2, subtitleX2, 38);
 
      // Add the additional details before the table
      const details = [
        `Ticket No: ${data.ticketNo}`,
        `Date: ${data.date}`,
        `Vehicle No: ${data.vehicleNo}`,
        `Material/Product: ${data.materialOrProduct}`,
        `Material/Product Type: ${data.materialTypeOrProductType}`,
        `Supplier/Customer Name: ${data.supplierOrCustomerName}`,
        `Supplier/Customer Address: ${data.supplierOrCustomerAddress}`,
        `Transaction Type: ${data.transactionType}`
      ];
 
      doc.setFontSize(14);
      let yPosition = 50; // Initial Y position for the details
      details.forEach(detail => {
        doc.text(detail, 20, yPosition);
        yPosition += 10; // Increment Y position for each detail line
      });
 
      // Move the table start position down to avoid overlapping with details
      yPosition += 10;
 
      const filteredEntries = Object.entries(data.qualityParameters).filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      );
 
      const tableBody = filteredEntries.map(([key, value]) => [key, value]);
      doc.autoTable({
        startY: yPosition,
        head: [["Field", "Value"]],
        body: tableBody,
      });
 
      doc.save("quality_report.pdf");
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to download the quality report. Please try again later.");
    }
  };
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedPrintFormat, setSelectedPrintFormat] = useState(null);
 
  const handlePrint = async (ticketNo) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qualities/report-response/${ticketNo}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
 
      // Open a new window or tab to print the data
      const printWindow = window.open("", "_blank");
      const formattedData = `
        <html>
          <head>
            <title>Print Report</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
              }
              th {
                background-color: #0077b6;
                color: white;
              }
            </style>
          </head>
          <body>
            <h2>${data.companyName}</h2>
            <p>${data.companyAddress}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
              ${Object.entries(data)
                .filter(([key, value]) => typeof value !== "object" || value === null)
                .map(
                  ([key, value]) =>
                    `<tr><td>${key}</td><td>${
                      typeof value === "object" ? JSON.stringify(value) : value
                    }</td></tr>`
                )
                .join("")}
              ${
                data.qualityParameters
                  ? `<tr>
                      <td>Quality Parameters</td>
                      <td>
                        <table>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                          </tr>
                          ${Object.entries(data.qualityParameters)
                            .map(
                              ([key, value]) =>
                                `<tr><td>${key}</td><td>${value}</td></tr>`
                            )
                            .join("")}
                        </table>
                      </td>
                    </tr>`
                  : ""
              }
            </table>
            <script>
              window.print();
              window.close();
            </script>
          </body>
        </html>
      `;
      printWindow.document.write(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data for printing. Please try again later.");
    }
  };
 
 
  const handlePrintFormat = () => {
    handlePrintClick();
    setShowPrintModal(false); // Close the print modal after printing
  };
 
  const handlePrintClick = useReactToPrint({
    content: () => componentRef.current,
  });
 
  useEffect(() => {
    if (printData) {
      handlePrintClick();
    }
  }, [printData]);
 
  return (
    <>
    <SideBar3>
      <div
        style={{ fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}
      >
        <div className="container-fluid mt-0">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <div style={{ flex: "1" }}>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                disabledDate={disabledFutureDate}
                style={{
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }} />
            </div>
            <div style={{ flex: "1", textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: "Arial",
                  marginBottom: "0px",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Completed Transaction
              </h2>
            </div>
            <div style={{ flex: "1" }}></div>
          </div>
          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
              Show
              <InputNumber
                min={1}
                value={itemsPerPage}
                onChange={(value) => setItemsPerPage(value)}
                style={{
                  width: "60px",
                  marginLeft: "5px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }} />
              entries
            </div>
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div style={{ display: "flex", alignItems: "center" }}>
              <Select
    value={searchType}
    onChange={(value) => setSearchType(value)}
    style={{ width: 150, marginRight: "8px" }} // Increase width
  >
    <Select.Option value="select">Select</Select.Option>
    <Select.Option value="ticketNo">Ticket No</Select.Option>
    <Select.Option value="vehicleNo">Vehicle No</Select.Option>
    <Select.Option value="supplier">Supplier</Select.Option>
    <Select.Option value="supplierAddress">Supplier Address</Select.Option>
  </Select>
              <Input.Search
                placeholder="Search by Ticket No, Vehicle No, Supplier, or Address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                style={{ flex: 1, width: 200 }} // Decrease width
              />
            </div>
          </div>
          <div className="col-12 col-md-3 d-flex justify-content-end">
            <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Dropdown>
          </div>
        </div>
        <div
          className="table-responsive"
          style={{
            overflowX: "auto",
            maxWidth: "100%",
            borderRadius: "10px",
            maxHeight: "500px",
          }}
        >
          <div style={{ maxHeight: "394px", overflowY: "auto" }}>
            <StyledTable
              className="ant-table table table-striped"
              style={{ marginBottom: 0 }}
            >
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
                    TicketNo
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
                    VehicleNo
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
                    Product/Material
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
                    Product/MaterialType
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
                    Supplier/CustomerAddress
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
                    TransactionType
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredData) && filteredData
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map((item, index) => (
                    <tr key={index}>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.ticketNo}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.vehicleNo}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.materialName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.materialType}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.supplierOrCustomerName}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.supplierOrCustomerAddress}
                      </td>
                      <td
                        className="ant-table-cell"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.transactionType}
                      </td>
                      <td className="ant-table-cell" style={{ whiteSpace: "nowrap" }}>
                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "3px 6px", marginRight: "5px" }}
                          onClick={() => {
                            handleQualityReportDownload(item.ticketNo);
                          } }
                          disabled={!item.qualityParametersPresent}
                        >
                          <FontAwesomeIcon icon={faFileWord} />
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          style={{
                            color: "#0077B6",
                            borderColor: "#0077B6",
                            marginRight: "2px",
                          }}
                          onClick={() => {
                            handlePrint(item.ticketNo);
                          } }
                          disabled={!item.qualityParametersPresent}
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                       
                      </td>
                    </tr>
                  ))}
              </tbody>
            </StyledTable>
          </div>
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3 ml-2">
          <span>
            Showing {currentPage * itemsPerPage + 1} to{" "}
            {Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </span>
          <div className="ml-auto">
            <button
              className="btn btn-outline-primary btn-sm me-2"
              style={{
                color: "#0077B6",
                borderColor: "#0077B6",
                marginRight: "2px",
              }}
              onClick={() => setCurrentPage(Math.max(0, currentPage - 5))}
              disabled={currentPage === 0}
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
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
 
            {Array.from({ length: 3 }, (_, index) => {
              const pageNumber = currentPage + index;
              if (pageNumber >= pageCount) return null;
              return (
                <button
                  key={pageNumber}
                  className={`btn btn-outline-primary btn-sm me-2 ${currentPage === pageNumber ? "active" : ""}`}
                  style={{
                    color: currentPage === pageNumber ? "#fff" : "#0077B6",
                    backgroundColor: currentPage === pageNumber ? "#0077B6" : "transparent",
                    borderColor: "#0077B6",
                    marginRight: "2px",
                  }}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
            {currentPage + 3 < pageCount && <span>...</span>}
            {currentPage + 3 < pageCount && (
              <button
                className={`btn btn-outline-primary btn-sm me-2 ${currentPage === pageCount - 1 ? "active" : ""}`}
                style={{
                  color: currentPage === pageCount - 1 ? "#fff" : "#0077B6",
                  backgroundColor: currentPage === pageCount - 1 ? "#0077B6" : "transparent",
                  borderColor: "#0077B6",
                  marginRight: "2px",
                }}
                onClick={() => setCurrentPage(pageCount - 1)}
              >
                {pageCount}
              </button>
            )}
            <button
              className="btn btn-outline-primary btn-sm me-2"
              style={{
                color: "#0077B6",
                borderColor: "#0077B6",
                marginRight: "2px",
              }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
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
              onClick={() => setCurrentPage(Math.min(pageCount - 1, currentPage + 5))}
              disabled={currentPage === pageCount - 1}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
    <Modal
        title="Print Report"
        visible={showPrintModal}
        onCancel={() => setShowPrintModal(false)}
        footer={null}
      >
       
        <button
          className="btn btn-primary"
          onClick={handlePrintFormat}
        >
          Print
        </button>
      </Modal>
</SideBar3>
</>
);
}
export default QualityCompleted;
