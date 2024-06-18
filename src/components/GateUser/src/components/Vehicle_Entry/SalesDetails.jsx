import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar2 from "../../../../SideBar/SideBar2";
import "./SalesDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

const SalesDetails = ({ onConfirmTicket = () => { } }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [vehicleEntryDetails, setVehicleEntryDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/sales/getAllVehicleDetails", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Access the nested sales array
                if (data && Array.isArray(data.sales)) {
                    setVehicleEntryDetails(data.sales);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching vehicle entry details:', error);
            });
    }, []);

    const handleVehicleClick = (salePassNo) => {
        // Navigate to VehicleEntry-Outbound page
        navigate(`/VehicleEntry-Outbound/?sales=${salePassNo}`);
    };

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = vehicleEntryDetails.slice(indexOfFirstEntry, indexOfLastEntry);

    // Code for Close icon
    const goBack = () => {
        navigate(-1);
    }

    return (
        <SideBar2>
            <div style={{ fontFamily: "Arial", color: "#333", "--table-border-radius": "30px" }}>
                <div className="container-fluid mt-0">
                    <div className="mb-3 text-center">
                        <button
                            className="close-button"
                            onClick={goBack}
                            style={{
                                position: 'absolute',
                                marginRight: 10,
                                backgroundColor: 'transparent',
                                color: '#f11212',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 30,
                                outline: 'none',
                            }}
                        >
                            <FontAwesomeIcon icon={faRectangleXmark} />
                        </button>
                        <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
                            Vehicle Outbound Details
                        </h2>
                    </div>
                    <div className="table-responsive" style={{ overflowX: "auto", maxWidth: "100%", borderRadius: "10px" }}>
                        <table className="ant-table table table-striped" style={{ width: "100%" }}>
                            <thead className="ant-table-thead">
                                <tr className="ant-table-row">
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Vehicle No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> PO No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Sale Order No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Sale Pass No. </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Transporter Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Customer Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Customer Address </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Product Name </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Product Type </th>
                                    <th className="ant-table-cell" style={{ whiteSpace: "nowrap", color: "white", backgroundColor: "#0077b6", borderRight: "1px solid white" }}> Quantity (MT) </th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {currentEntries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="ant-table-cell">
                                            <button onClick={() => handleVehicleClick(entry.salePassNo)} style={{ background: "#88CCFA", minWidth: "70px", whiteSpace: "nowrap", }}>{entry.vehicleNo}</button>
                                        </td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.purchaseOrderNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.saleOrderNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.salePassNo}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.transporterName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.customerName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.customerAddress}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.productName}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.productType}</td>
                                        <td className="ant-table-cell" style={{ whiteSpace: "nowrap", textAlign: "center" }}> {entry.consignmentWeight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SideBar2>
    );
};

export default SalesDetails;