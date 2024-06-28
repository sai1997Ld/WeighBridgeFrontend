import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar5 from "../../../../SideBar/SideBar5";

import "./transactionform.css";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faPlay,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import LiveVideo from "./LiveVideo";

function TransactionFrom() {
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);

  const [inputValue, setInputValue] = useState();

  const [grossWeight, setGrossWeight] = useState(0);
  const [tareWeight, setTareWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);

  const [ticket, setTicket] = useState([]);

  const ticketNumber = queryParams.get("ticketNumber");
  const [port, setPort] = useState(null);
  const [simulate, setSimulate] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
 
  const userId = sessionStorage.getItem("userId");

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
        setSaveSuccess(false);
      })
      .catch((error) => {
        console.error("Error fetching weighments:", error);
      });
  }, []);

  useEffect(() => {
    setNetWeight(grossWeight - tareWeight);
    console.log("Count changed:", netWeight);
  }, [tareWeight]);

  const handleChange1 = (e) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue) || newValue <= 0) {
      Swal.fire({
        title: "Invalid weight",
        text: "Please enter a valid weight greater than 0",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      setInputValue("");
      return;
    }

    setInputValue(newValue);

    if (ticket.grossWeight === 0) {
      setGrossWeight(newValue);
    } else if (newValue >= ticket.grossWeight) {
      Swal.fire({
        title: "Invalid tare weight",
        text: "The tare weight should be less than the gross weight",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      setInputValue(0);
    } else {
      setTareWeight(newValue);
    }
  };

  const handleSave = async () => {
    if (inputValue <= 0 || isNaN(inputValue)) {
      Swal.fire({
        title: "Invalid weight",
        text: "Please enter a valid weight greater than 0",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return; // Exit the function without saving
    }
    if (tareWeight == 0) {
      Swal.fire({
        title: "Gross weight saved to the database",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    } else {
      Swal.fire({
        title: "Tare weight saved to the database",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    }
    window.location.reload();
    goBack();
    setInputValue("");


    const blobFront = await fetch(capturedFrontImage).then((res) => res.blob());
    const blobRear = await fetch(capturedRearImage).then((res) => res.blob());
    const blobSide = await fetch(capturedSideImage).then((res) => res.blob());
    const blobTop = await fetch(capturedTopImage).then((res) => res.blob());
    const payload = {
      machineId: "1",
      ticketNo: ticketNumber,
      weight: inputValue,
    };
    const formD = new FormData();
    formD.append("frontImg1", blobFront , Date.now());
    formD.append("backImg2", blobRear ,  Date.now());
    formD.append("leftImg5", blobSide ,  Date.now());
    formD.append("topImg3", blobTop ,  Date.now());
    formD.append("weighmentRequest", JSON.stringify(payload));

    const response = await axios({
      method: "post",
      url: `http://localhost:8080/api/v1/weighment/measure?userId=${userId}&role=${'WEIGHBRIDGE_OPERATOR'}`,
      data: formD,
      headers: {
        withCredentials: true,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log({response})
  
  };

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

  useEffect(() => {
    if (port) {
      readSerialData();
    }
  }, [port]);

  const connectSerial = async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.serial) {
      console.error("Web Serial API is not supported in this environment.");
      return;
    }


    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setPort(port);
    } catch (error) {
      console.error("There was an error opening the serial port:", error);
    }
  };

  const readSerialData = async () => {
    try {
      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      const inputStream = decoder.readable;
      const reader = inputStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("Stream closed");
          reader.releaseLock();
          break;
        }
        const newValue = value.trim();
        const extractedWeight = extractWeight(newValue);
        if (extractedWeight) {
          setInputValue(extractedWeight);
          handleChange1({ target: { value: extractedWeight } });
        }
      }
    } catch (error) {
      console.error("Error reading serial data:", error);
    }
  };

  const extractWeight = (data) => {
    const match = data.match(/(\d+(\.\d+)?)\s*kg/);
    return match ? match[0] : null;
  };
  const simulateSerialData = () => {
    const simulatedWeight = (Math.random() * 1000).toFixed(2); // Generate random weight data
    setInputValue(simulatedWeight);
    handleChange1({ target: { value: simulatedWeight } });
  };

  useEffect(() => {
    if (simulate) {
      const interval = setInterval(simulateSerialData, 2000); // Simulate data every 2 seconds
      return () => clearInterval(interval);
    }
  }, [simulate]);

  const toggleSimulation = () => {
    setSimulate(!simulate);
  };

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

  const canvasTopRef = useRef(null);
  const canvasRearRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const canvasSideRef = useRef(null);
  const [capturedTopImage, setCapturedTopImage] = useState(null);
  const [capturedRearImage, setCapturedRearImage] = useState(null);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null);
  const [capturedSideImage, setCapturedSideImage] = useState(null);

  return (
    <SideBar5>
      <div className="container-fluid">
        <div className="container-fluid">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 className="text-center mb-3 mt-1">Inbound Transaction Form</h2>
          <div className="row ">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                id="ticketNo"
                name="ticketNo"
                value={`Ticket No: ${ticketNumber}`}
                onChange={handleChange}
                required
                disabled
                className="abcv"
                readOnly
              />
            </div>

            {/* commented for serial port and simulation */}
            {/* <div className="col-md-6 mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={connectSerial}
                style={{ float: "right" }}
              >
                Connect Serial Port
              </button>
              <button
                onClick={toggleSimulation}
                className="btn btn-success"
                style={{ float: "right", marginRight: "10px" }}
              >
                <FontAwesomeIcon icon={simulate ? faRectangleXmark : faPlay} />{" "}
                {simulate ? "Stop Simulation" : "Start Simulation"}
              </button>
              {!hasPermission && <button onClick={requestPermission}>Request Serial Port Permission</button>}
            </div> */}
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
            {/* TP No */}
            <div className="col-md-3 mb-3 ">
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>

            {/* Challan No */}
            <div className="col-md-3 mb-3">
              <label htmlFor="challanNo" className="form-label ">
                Challan No:
                {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
              </label>
              <div className="input-group">
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
            </div>

            <div className="col-md-3 mb-3">
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
                  disabled
                  className="abcv"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <h5>Weighment Details:</h5>
              <div className="row mb-2">

                <div className="col-md-5">

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
                      onChange={(e) => handleChange1(e, ticket.grossWeight)}
                      inputMode="numeric"
                    />
                    <div className="icons-group">
                      <div>
                        {ticket.tareWeight === 0 && ticket.netWeight === 0 ? (
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
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="grossWeight" className="form-label">
                      Gross Weight:
                    </label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        id="grossWeight"
                        autoComplete="off"
                        value={`${grossWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.grossWeightTime}
                        className="abcv"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="tareWeight" className="form-label">
                      Tare Weight:
                    </label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        id="tareWeight"
                        autoComplete="off"
                        value={`${tareWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.tareWeightTime}
                        className="abcv"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="netWeight" className="form-label">
                      Net Weight:
                    </label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        id="netWeight"
                        autoComplete="off"
                        value={`${netWeight} kg`}
                        className="abcv"
                        readOnly
                      />
                      <input
                        type="text"
                        value={ticket.netWeightTime}
                        className="abcv"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame1"}
                    imageRef={canvasTopRef}
                    setCapturedImage={setCapturedTopImage}
                    capturedImage={capturedTopImage}
                    label= "Top View"
                  />
                </div>
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame1"}
                    imageRef={canvasRearRef}
                    setCapturedImage={setCapturedRearImage}
                    capturedImage={capturedRearImage}
                    label = "Rear View"
                  />
                </div>
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame1"}
                    imageRef={canvasFrontRef}
                    setCapturedImage={setCapturedFrontImage}
                    capturedImage={capturedFrontImage}
                    label = "Front View"
                  />
                </div>
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame1"}
                    imageRef={canvasSideRef}
                    setCapturedImage={setCapturedSideImage}
                    capturedImage={capturedSideImage}
                    label = "Side View"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2 p-2 border shadow-lg rounded-lg">
            <h5>Transaction Details:</h5>
            <div className="grid-container-op">
              <div className="grid-item-op">
                <label htmlFor="supplier" className="form-label">
                  Supplier:
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={ticket.supplierName}
                  onChange={handleChange}
                  className="abcv"
                  readOnly
                />
              </div>
              <div className="grid-item-op">
                <label htmlFor="supplierAddress" className="form-label">
                  Supplier Address:
                </label>
                <input
                  type="text"
                  id="supplierAddress"
                  name="supplierAddress"
                  value={ticket.supplierAddress}
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
export default TransactionFrom;
