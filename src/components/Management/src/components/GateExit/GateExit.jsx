import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPrint, faFileWord, faHome } from "@fortawesome/free-solid-svg-icons";
import OutTimeVehicle from "../../assets/OutTimeVehicle.jpg";
import { Link } from "react-router-dom";
import { Chart, ArcElement } from "chart.js/auto";
import Swal from 'sweetalert2';
import { Table, Tag, Button, Input, Select, DatePicker, Menu, Dropdown } from "antd";
import { SearchOutlined, PrinterOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import SideBar4 from "../../../../SideBar/SideBar4";


const { Option } = Select;
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/gate',
    headers: {
        'Content-Type': 'application/json',
    },

    withCredentials: true,
});



const ManagementGateExit = ({ onConfirmTicket = () => { } }) => {
    const [currentDate, setCurrentDate] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchOption, setSearchOption] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [totalPage, setTotalPage] = useState(0);
    const [date, setDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [searchQuery, setSearchQuery] = useState('');
    const [systemOutTime, setSystemOutTime] = useState('');
    const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [startPageNumber, setStartPageNumber] = useState(1);
    const itemsPerPage = 5;
    const [totalEntries, setTotalEntries] = useState(0);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [reportStatuses, setReportStatuses] = useState({}); // function for quality report 


    const disabledFutureDate = (current) => {
        return current && current > moment().endOf("day");
    };


    // Code for Date:

    // useEffect(() => {
    //   const today = new Date();
    //   const formattedDate = today.toISOString().split("T")[0];
    //   setCurrentDate(formattedDate);
    // }, []);


    // useEffect(() => {
    //   const today = new Date().toISOString().split('T')[0];
    //   setSelectedDate(today);
    // }, []);

    const handleDateChange = (date) => {
        setDate(date);
        if (date && date.isValid()) {
            console.log("The date is valid:", date);
        } else {
            console.error("Invalid date");
        }
    };

    // Code for Searching:

    // const handleSearch = (value) => {
    //   setSearchQuery(value);
    //   setCurrentPage(0); // Reset to the first page when searching
    //   console.log(value); 
    // };
    const handleSearchOptionChange = (value) => {
        setSearchOption(value);
        setSearchValue(''); // Reset the search value when the option changes
    };
    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = async () => {
        if (!searchValue) {
            message.error('Please enter a search value');
            return;
        }

        let apiUrl = `${api.defaults.baseURL}/transactions`;

        // Build the URL based on the selected search option
        switch (searchOption) {
            case 'ticketNo':
                apiUrl += `?ticketNo=${searchValue}`;
                break;
            case 'date':
                apiUrl += `?date=${searchValue}`;
                break;
            case 'vehicleNo':
                apiUrl += `?vehicleNo=${searchValue}`;
                break;
            case 'supplier':
                apiUrl += `?supplier=${searchValue}`;
                break;
            case 'address':
                apiUrl += `?address=${searchValue}`;
                break;
            default:
                break;
        }

        try {
            const response = await api.get(apiUrl); //Use api.get instead of axios.get
            console.log(response.data);
            // You can handle the response data here, such as setting it to state to display it
            setVehicleEntryDetails(response.data.transactions); // Update the vehicleEntryDetails state with the fetched data
            setTotalPage(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Failed to fetch data. Please try again.');
            }
        }
    };

// Function to fetch material options from the API
const fetchMaterialOptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/gate/fetch-ProductsOrMaterials", {
        credentials: "include" // Include credentials option here
      });
      const data = await response.json();
      setMaterialOptions(data);
    } catch (error) {
      console.error("Error fetching material options:", error);
    }
  };

  // Fetch material options when the component mounts
  useEffect(() => {
    fetchMaterialOptions();
  }, []);



  // Function to handle material filter selection
  const handleMaterialFilter = (e) => {
    console.log('Selected filter:', e.key);
    const [filterType, filterValue] = e.key.split('-');
    if (filterType === 'material') {
      setSelectedMaterial(filterValue);
      // Apply filter based on material only
      applyFilter(vehicleEntryDetails, filterValue, selectedTransactionType);
    } else if (filterType === 'transaction') {
      setSelectedTransactionType(filterValue);
    }
  };

  // Menu for material and transaction type filters
  const menu = (
    <Menu onClick={handleMaterialFilter}>
      <Menu.SubMenu key="1" title="Product/Material">
        {materialOptions.map((option, index) => (
          <Menu.Item key={`material-${option}`}>{option}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="2" title="Transaction Type">
        <Menu.Item key="transaction-inbound">Inbound</Menu.Item>
        <Menu.Item key="transaction-outbound">Outbound</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );


    // API  For Completed Dashboard:



    useEffect(() => {
        // Initial fetch
        fetch("http://localhost:8080/api/v1/management/transactions/ongoing?transactionType=outbound&companyName=${selectedCompany}&siteName=${siteName}&page=${pageNumber}", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVehicleEntryDetails(data.transactions);
                setTotalPage(data.totalPages);
                console.log("total Page " + data.totalPages);

                // Set the current page to 0 to trigger the paginated fetch

                setCurrentPage(0);
            })
            .catch(error => {
                console.error('Error fetching vehicle entry details:', error);
            });
    }, []);

    // API for Pagination:

    useEffect(() => {
        if (currentPage !== null) {
          fetchData(currentPage);
        }
      }, [currentPage, selectedDate]);

    const fetchData = (pageNumber) => {
        const selectedCompany = sessionStorage.getItem('company');
        const selectedSiteName = sessionStorage.getItem('site');
        // const selectedSiteAddress = sessionStorage.getItem('selectedSiteAddress');

        if (!selectedCompany) {
            console.error('Company not selected');
            return;
        }

          // Get the selected date and format it as "YYYY-MM-DD"
         const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

         // Construct the API URL with the selected date
  const apiUrl = selectedSiteName
  ? `http://localhost:8080/api/v1/management/transactions/ongoing?transactionType=outbound&companyName=${selectedCompany}&siteName=${selectedSiteName}&page=${pageNumber}&startDate=${formattedDate}`
  : `http://localhost:8080/api/v1/management/transactions/ongoing?transactionType=outbound&companyName=${selectedCompany}&page=${pageNumber}&startDate=${formattedDate}`;

        fetch(apiUrl, {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVehicleEntryDetails(data.transactions);
                setTotalPage(data.totalPages);
                setTotalEntries(data.totalElements)
                console.log("total Page " + data.totalPages);
            })
            .catch(error => {
                console.error('Error fetching vehicle entry details:', error);
            });
    };






    const pageCount = totalPage;
    const handlePageChange = ({ selected }) => {
        const newStartPage = Math.max(1, selected * 3 - 2);
        setCurrentPage(selected);
        setStartPageNumber(newStartPage);
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

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };



    const handleConfirm = () => {
        const details = {
            ticketType: selectedOption,
            inTimeDate: selectedDate,
            outTimeDate: selectedDate // Assuming both in and out time/date are same for now
        };
        onConfirmTicket(details);

        if (selectedOption === 'inbound') {
            navigate('/VehicleEntryDetails');
        }

        setSelectedOption('');
        setSelectedDate('');
        closePopup();
    };

    // API for Vehicle Out



    // Code for Quality Report:

    const handleQualityReportDownload = async (ticketNo) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/qualities/report-response/${ticketNo}`);
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
            const subtitle2 = `Generated on: ${new Date().toLocaleDateString()}`;
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
    // Code for Disabled Quality Report
    useEffect(() => {
        const fetchReportStatuses = async () => {
            const statuses = {};
            for (const entry of vehicleEntryDetails) {
                const status = await checkQualityReportStatus(entry.ticketNo);
                statuses[entry.ticketNo] = status;
            }
            setReportStatuses(statuses);
        };

        fetchReportStatuses();
    }, [vehicleEntryDetails]);

    return (
        <SideBar4>
            <div style={{ fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}>
                <div className="container-fluid mt-0">
                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div style={{ flex: "2" }}>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    disabledDate={disabledFutureDate}
                                    format="DD-MM-YYYY"
                                    style={{
                                        borderRadius: "5px",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </div>
                            <div style={{ flex: "15", textAlign: "center" }}>
                                <h2 style={{ fontFamily: "Arial", marginBottom: "0px", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" }}>
                                    Processed Transactions
                                </h2>
                            </div>
                            <div style={{ flex: "2", textAlign: "right" }}>
                                <Link to="/home5">
                                    <FontAwesomeIcon icon={faHome} style={{ fontSize: '1.5em' }} />
                                </Link>
                            </div>
                        </div>

                        <div style={{ flex: "1" }}></div> {/* To balance the layout */}
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        <div className="d-flex align-items-center" style={{ marginLeft: "auto", marginRight: "auto" }}>
                            <Select
                                placeholder="Select a search option"
                                style={{ width: "200px" }}
                                onChange={handleSearchOptionChange}
                            // suffixIcon={<SearchOutlined />}
                            >

                                <Option value="ticketNo">Search by Ticket No</Option>
                                <Option value="vehicleNo">Search by Vehicle No</Option>
                            </Select>
                            {searchOption && (
                                <Input
                                    placeholder={`Enter ${searchOption}`}
                                    style={{ width: "200px", }}
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onPressEnter={handleSearch} // Optionally allow search on Enter key press
                                />
                            )}
                        </div>
                        <div className=" d-flex justify-content-end">
              <Dropdown overlay={menu} onSelect={handleMaterialFilter}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            </div>
                    </div>

                    <div className=" table-responsive" style={{ overflowX: "auto", maxWidth: "100%", borderRadius: "10px" }}>
                        <div >
                            <table className=" ant-table table table-striped" style={{ width: "100%" }} >
                                <thead className="ant-table-thead" >
                                    <tr className="ant-table-row">
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Ticket No.</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Vehicle No.</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>In Time/Date</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Out Time/Date</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transporter Name</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Supplier/Customer</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Supplier's /Customer's Address</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Material/Product</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Gross weight</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Tare weight</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Net weight</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>TP No.</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>TP Net weight</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>PO No.</th>
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Challan No.</th>
                                        {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transaction Status </th> */}
                                        <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>Transaction Type</th>
                                        {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Print </th> */}
                                        {/* <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}>OUT</th> */}
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {vehicleEntryDetails.map((entry) => (
                                        <tr key={entry.id}>
                                            <td className="ant-table-cell" style={{ textAlign: "center" }} >{entry.ticketNo}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleNo} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleIn} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.vehicleOut} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transporter} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionType === 'Inbound' ? entry.supplier : entry.customer}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionType === 'Inbound' ? entry.supplierAddress : entry.customerAddress}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.material} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.grossWeight}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tareWeight}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.netWeight}</td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tpNo} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.tpNetWeight} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.poNo} </td>
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.challanNo} </td>
                                            {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center"}}> {entry.transactionStatus}</td> */}
                                            <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transactionType}</td>
                                            {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                <button className="btn btn-success btn-sm" style={{ padding: "3px 6px" }}
                                                    onClick={() => { handlePrint(entry.print) }}
                                                >
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            </td> */}
                                            {/* <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                                                <button className="image-button" onClick={() => handleVehicleExit(entry.ticketNo)}>
                                                    <div className="image-container" style={{ border: 'none' }}>
                                                        <img src={OutTimeVehicle} alt="Out" className="time-image" />
                                                    </div>
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code for Pagination: */}
            <div className="d-flex justify-content-between align-items-center mt-3 ml-2">
                <span>
                    Showing {currentPage * itemsPerPage + 1} to{" "}
                    {Math.min((currentPage + 1) * itemsPerPage, ((currentPage) * itemsPerPage) + vehicleEntryDetails.length)} of{" "}
                    {totalEntries} entries


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
                                className={`btn btn-outline-primary btn-sm me-2 ${currentPage === pageNumber ? "active" : ""
                                    }`}
                                style={{
                                    color: currentPage === pageNumber ? "#fff" : "#0077B6",
                                    backgroundColor:
                                        currentPage === pageNumber ? "#0077B6" : "transparent",
                                    borderColor: "#0077B6",
                                    marginRight: "2px",
                                }}
                                //onClick={() => setCurrentPage(pageNumber)}
                                onClick={() => setCurrentPage(pageNumber)}

                            >
                                {pageNumber + 1}
                            </button>
                        );
                    })}
                    {currentPage + 3 < pageCount && <span>...</span>}
                    {currentPage + 3 < pageCount && (
                        <button
                            className={`btn btn-outline-primary btn-sm me-2 ${currentPage === pageCount - 1 ? "active" : ""
                                }`}
                            style={{
                                color: currentPage === pageCount - 1 ? "#fff" : "#0077B6",
                                backgroundColor:
                                    currentPage === pageCount - 1 ? "#0077B6" : "transparent",
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
                        onClick={() =>
                            setCurrentPage(Math.min(pageCount - 1, currentPage + 5))
                        }
                        disabled={currentPage === pageCount - 1}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </SideBar4>
    );
};

export default ManagementGateExit;
