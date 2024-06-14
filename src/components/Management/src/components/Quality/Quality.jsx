import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { InputNumber, DatePicker, } from "antd";
import moment from "moment";
import { Button, Dropdown, Menu } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Sidebar4 from "../../../../SideBar/SideBar4";



// Styled component for the table
const StyledTable = styled.table`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const fetchAllTransactions = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/qualities/getAllTransaction`,
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

function ManagementQuality() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("select"); // State for search type
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [transactionType, setTransactionType] = useState("inbound"); // Default to 'inbound', adjust as necessary
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState([]);





  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
        const combinedOptions = [...materialData,];
        setMaterialOptions(combinedOptions);
      } else {
        console.error(
          "Failed to fetch material or product options:",
          materialResponse.status,
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
        "http://localhost:8080/api/v1/qualities/fetch-InboundTransaction",
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
        "http://localhost:8080/api/v1/qualities/fetch-OutboundTransaction",
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

  const disabledFutureDate = (current) => {
    return current && current > moment().endOf("day");
  };


  const handleTicketClick = (ticketNumber, transactionType) => {
    const item = allData.find((item) => item.ticketNo === ticketNumber);
    if (item) {
      const queryString = new URLSearchParams(item).toString();
      if (transactionType.toLowerCase() === "inbound") {
        navigate("/QualityInboundDetails?" + queryString);
      } else if (transactionType.toLowerCase() === "outbound") {
        navigate("/QualityOutboundDetails?" + queryString);
      }
    }
  };



  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const removeTransaction = async (ticketNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/qualities/${ticketNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log(`Transaction with ticket number ${ticketNumber} removed successfully`);

        // Update state to remove the transaction from the list
        setAllData((prevData) => prevData.filter((item) => item.ticketNo !== ticketNumber));
        setFilteredData((prevData) => prevData.filter((item) => item.ticketNo !== ticketNumber));
      } else {
        console.error("Failed to remove transaction:", response.status);
      }
    } catch (error) {
      console.error("Error removing transaction:", error);
    }
  };

  const handleRemoveTransaction = async (ticketNumber, transactionType) => {
    if (transactionType === "Outbound") {
      showModal();
      return;
    }

    console.log(`Removing transaction with ticket number ${ticketNumber}`);
    await removeTransaction(ticketNumber);

    // Re-fetch the counts
    fetchPendingCounts();
    fetchCompletedCounts();
  };


  const handleSearch = async () => {
    if (searchQuery === "") {
      setFilteredData(allData);
      return;
    }
  };

  const fetchApiData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/management/completedQualities/GoodOrBad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromDate: '2024-05-22',
          toDate: '2024-06-06',
          companyName: 'Vikram Private Limited',
          siteName: 'ROURKELA,Tumkela',
        }),
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      } else {
        console.error('Failed to fetch API data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  useEffect(() => {
    if (filteredData.length !== allData.length) {
      setCurrentPage(0);
    }
  }, [filteredData, allData]);

  return (
    <Sidebar4>
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
      }}
    />
            </div>
            <div style={{ flex: "1", textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: "Arial",
                  marginBottom: "0px",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Quality Transaction
              </h2>
            </div>
            <div style={{ flex: "1", textAlign: "right" }}>
              <Link to="/home5">
                <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.5em' }} />
              </Link>
            </div>
          </div>


          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
              Show
              <>
                <InputNumber
                  min={1}
                  value={itemsPerPage}
                  onChange={(value) => setItemsPerPage(value)}
                  style={{
                    width: "60px",
                    marginLeft: "5px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
                &nbsp;entries
              </>

            </div>
            <div className="col-12 col-md-6 mb-2 mb-md-0">

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
                      Ticket No
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
                      Vehicle No
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
                      Quality Type
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
                    {/* <th
                      className="ant-table-cell"
                      style={{
                        whiteSpace: "nowrap",
                        color: "white",
                        backgroundColor: "#0077b6",
                        borderRight: "1px solid white",
                      }}
                    >
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
  {Array.isArray(apiData) &&
    apiData.map((item, index) => (
      <tr key={index}>
        <td className="ant-table-cell" style={{ whiteSpace: 'nowrap' }}>
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
                            {item.productOrMaterialName}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.productOrMaterialType}
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
                            {item.qualityType}
                          </td>
                          <td
                            className="ant-table-cell"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {item.transactionType}
                          </td>
                          {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap" }}>
                            <EditNoteIcon
                              style={{ color: "green", cursor: "pointer" }}
                              onClick={() => handleTicketClick(item.ticketNo, item.transactionType)}
                            />

                            {transactionType === "inbound" && (
                              <PlaylistRemoveIcon
                                style={{ color: "red", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => handleRemoveTransaction(item.ticketNo, item.transactionType)}
                              />
                            )} 
                          </td> */}
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
              {filteredData.length} {" "}entries
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

  {Array.from({ length: Math.min(pageCount, 5) }, (_, index) => {
    const pageNumber = currentPage + index;
    if (pageNumber >= pageCount) return null;
    return (
      <button
        key={pageNumber}
        className={`btn btn-outline-primary btn-sm me-2 ${
          currentPage === pageNumber ? "active" : ""
        }`}
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
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        title="Error"
      >
        <p>Quality parameter for Outbound must be filled.</p>
      </Modal>
    </Sidebar4>
  );
}
export default ManagementQuality;