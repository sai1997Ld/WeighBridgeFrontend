/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import Header from "../../../../Header/Header";
import SideBar5 from "../../../../SideBar/SideBar5";
// eslint-disable-next-line no-unused-vars
import camView from "../../assets/weighbridge.webp";
import "./transactionform1.css";
// import ScannerImg1 from "../../assets/ScannerImg1.png";
import Camera_Icon from "../../assets/Camera_Icon.png";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faFloppyDisk,
  faPrint,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function TransactionFrom2() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const queryParams = new URLSearchParams(window.location.search);

  const [inputValue, setInputValue] = useState();

  const [grossWeight, setGrossWeight] = useState(0);
  const [tareWeight, setTareWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [consignmentWeight, setConsignmentWeight] = useState(0);

  const [isGrossWeightEnabled, setIsGrossWeightEnabled] = useState(false);

  const [ticket, setTicket] = useState([]);

  const ticketNumber = queryParams.get("ticketNumber");

  console.log(ticketNumber);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/weighment/get/${ticketNumber}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTicket(response.data);
        console.log(response.data);
        setGrossWeight(response.data.grossWeight);
        setTareWeight(response.data.tareWeight);
        setNetWeight(response.data.netWeight);
        setConsignmentWeight(response.data.consignmentWeight);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  }, []);

  useEffect(() => {
    setNetWeight(grossWeight - tareWeight);
    console.log("Count changed:", netWeight);
  }, [grossWeight]);

  const handleChange1 = (e) => {
    const newValue = e.target.value;
    if (newValue === "-" || parseFloat(newValue) < 0) {
      Swal.fire({
        title: "Please enter a valid positive number",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      setInputValue("");
      return;
    } else {
      setInputValue(newValue);

      if (ticket.tareWeight === 0) {
        setTareWeight(newValue);
      }
       else {
        setGrossWeight(newValue);
      }
    }
  };


  const handleSave = () => {
    if (grossWeight == 0) {
      Swal.fire({
        title: "Tare weight saved to the database",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    } else {
      if (grossWeight <= tareWeight) {
        Swal.fire({
          title: "Gross weight must be greater than tare weight",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
        return;
      }
  
      Swal.fire({
        title: "Gross weight saved to the database",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    }

    const consignment = parseFloat(ticket.consignmentWeight);
    const lowerBound = parseFloat((consignment - 1).toFixed(3));
    const upperBound = parseFloat((consignment + 1).toFixed(3));
    if(netWeight ){
    if (netWeight < lowerBound || netWeight > upperBound) {
      Swal.fire({
        title: "Net weight is out of the allowed range",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
      return;
    }
  }
    window.location.reload();
    goBack();
    setInputValue("");
    
    const payload = {
      machineId: "1",
      ticketNo: ticketNumber,
      weight: inputValue,
    };

    axios
      .post("http://localhost:8080/api/v1/weighment/measure", payload, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Measurement saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving measurement:", error);
      });
  };

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

  const [formData, setFormData] = useState({
    date: "",
    inTime: "",
    poNo: "",
    challanNo: "",
    customer: "",
    supplier: "",
    supplierAddress: "",
    supplierContactNo: "",
    vehicleNo: "",
    transporter: "",
    driverDLNo: "",
    driverName: "",
    department: "",
    product: "",
    eWayBillNo: "",
    tpNo: "",
    vehicleType: "",
    tpNetWeight: "",
    rcFitnessUpto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "poNo" || name === "challanNo") {
      setFormData((prevData) => ({
        ...prevData,
        [name === "poNo" ? "challanNo" : "poNo"]: value
          ? ""
          : prevData[name === "poNo" ? "challanNo" : "poNo"],
      }));
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <SideBar5>
      <div>
        <div className="container-fluid">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={ faRectangleXmark}  />
          </button>
          <h2 className="text-center mb-2">Outbound Transaction Form</h2>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                id="ticketNo"
                name="ticketNo"
                value={`Ticket No: ${ticketNumber}`}
                onChange={handleChange}
                required
                className="abcv"
                readOnly
              />
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-3 mb-3">
              <label htmlFor="poNo" className="form-label ">
                PO No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="poNo"
                  name="poNo"
                  value={ticket.poNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* TP No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="tpNo" className="form-label ">
                TP No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="tpNo"
                  name="tpNo"
                  value={ticket.tpNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>

            {/* Challan No */}
            <div className="col-md-3 mb-3 ">
              <label htmlFor="challanNo" className="form-label ">
                Challan No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <input
                type="text"
                id="challanNo"
                name="challanNo"
                value={ticket.challanNo}
                onChange={handleChange}
                required
                disabled

                className="abcv"
                readOnly
              />
            </div>
            {/* Vehicle No */}
            <div className="col-md-3 mb-3 ">
              <label htmlFor="vehicleNo" className="form-label ">
                Vehicle No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={ticket.vehicleNo}
                  onChange={handleChange}
                  required
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-7">
              {/* Input fields */}
              <h5>Weighment Details:</h5>
              <div className="row">
                <div className="col-md-8">
                  <div className="sub">
                    <input
                      type="number"
                      className="abcv"
                      placeholder="0"
                      style={{
                       
                        height: "50px",
                        appearance: "textfield",
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                      min="0"
                      value={inputValue}
                      onChange={(e) => handleChange1(e)}
                      inputMode="numeric"
                    />
                    <div className="icons-group">
                      <div>
                        {ticket.grossWeight === 0 && ticket.netWeight === 0 ? (
                               <button
                               type="button"
                               className="btn btn-success-1 btn-hover"
                               style={{
                                 backgroundColor: "white",
                                 color: "#008060 ",
                                 width: "100px",
                                 border: "1px solid #cccccc",
                               }}
                               onClick={handleSave}
                             >
                               <FontAwesomeIcon icon={faSave} className="me-3" />
                               Save
                             </button>
                        ) : null}
                      </div>

            
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="mno">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Gross Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${grossWeight} ton`}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="text"
                      value={ticket.grossWeightTime}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="pqr">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Tare Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${tareWeight} ton`}
                      required={isGrossWeightEnabled}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="text"
                      value={ticket.tareWeightTime}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="stu">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Net Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${netWeight} ton`}
                      // required={isGrossWeightEnabled}
                      className="abcx"
                      readOnly
                    />
                    <input
                      type="text"
                      value={ticket.grossWeightTime}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="mno">
                  <div className="col-2 mt-2">
                    <label htmlFor="vehicleType" className="form-label">
                      Consignment Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${consignmentWeight} ton`}
                      className="abcx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 ">
              <div className="grid-container" id="z3">
                <div className="grid-item">
                  <div className="mnc">
                    <img src={camView} />
                    <div className="overlay">
                      <span>Top-View</span>
                      <button className="ct-btn ">
                        <img src={Camera_Icon} alt="Captured" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mnc">
                    <img src={camView} />
                    <div className="overlay">
                      <span>Front-View</span>
                      <button className="ct-btn ">
                        <img src={Camera_Icon} alt="Captured" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mnc">
                    <img src={camView} />
                    <div className="overlay">
                      <span>Rear-View</span>
                      <button className="ct-btn ">
                        <img src={Camera_Icon} alt="Captured" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid-item">
                  <div className="mnc">
                    <img src={camView} />
                    <div className="overlay">
                      <span>Side-View</span>
                      <button className="ct-btn ">
                        <img src={Camera_Icon} alt="Captured" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <h5>Transaction Details:</h5>
            <div className="grid-container-op">
              <div className="grid-item-2">
                <label htmlFor="supplier" className="form-label">
                  Customer:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={ticket.customerName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="supplierAddress" className="form-label">
                  Customer Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={ticket.customerAddress}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="transporter" className="form-label">
                  Transporter:
                </label>
                <input
                  type="text"
                  id="transporter"
                  name="transporter"
                  value={ticket.transporter}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              {/* <div className="grid-item-op">
                <label htmlFor="department" className="form-label">
                  Department:
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={ticket.department}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div> */}
              <div className="grid-item-op">
                <label htmlFor="driverDL" className="form-label">
                  Driver DL No:
                </label>
                <input
                  type="text"
                  id="driverDL"
                  name="driverDL"
                  value={ticket.driverDlNo}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="driverName" className="form-label">
                  Driver Name:
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={ticket.driverName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="material" className="form-label">
                  Material:
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={ticket.material}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar5>
  );
}

// eslint-disable-next-line no-undef
export default TransactionFrom2;
