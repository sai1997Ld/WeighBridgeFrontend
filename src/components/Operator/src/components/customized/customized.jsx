import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import SideBar5 from "../../../../SideBar/SideBar5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faFloppyDisk,
  faPrint,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
const { Text } = Typography;

const CustomizedReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weighments, setWeighments] = useState([]);
  const navigate = useNavigate();
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const fetchData = (start, end) => {
    if (start && end) {
      axios
        .get(
          `http://localhost:8080/api/v1/weighment/report?startDate=${start}&endDate=${end}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setWeighments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);
  const goBack = () => {
    navigate(-1);
  };

  return (
    <SideBar5>
      <div className="container-fluid mt-0">
        <div className="mb-3 text-center">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 style={{ fontFamily: "Arial", marginBottom: "0px !important" }}>
            Customized Transaction Report
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
              }}
            >
              <label htmlFor="startDate">Start Date: </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control form-control-sm"
                style={{ width: "120px" }}
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Col>
          </Row>
        </div>

        {weighments.map((material, index) => (
          <div key={index} className="table-responsive">
            <h5>
              {material.materialName} &nbsp; {material.supplierOrCustomer}
            </h5>
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
                      textAlign: "center",
                    }}
                  >
                    Date
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    Vehicle
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    CH.No
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    CH_Date
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    CH_Qty
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    Weigh_Qty
                  </th>
                  <th
                    className="ant-table-cell"
                    style={{
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#0077b6",
                      borderRight: "1px solid white",
                      textAlign: "center",
                    }}
                  >
                    Differences
                  </th>
                </tr>
              </thead>
              <tbody>
                {material.weighbridgeResponse2List.map((response, idx) => (
                  <tr key={idx}>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.transactionDate}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.vehicleNo}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.tpNo}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.challanDate}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.supplyConsignmentWeight}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.weighQuantity}
                    </td>
                    <td
                      className="ant-table-cell"
                      style={{ textAlign: "center" }}
                    >
                      {response.excessQty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </SideBar5>
  );
};

export default CustomizedReport;
