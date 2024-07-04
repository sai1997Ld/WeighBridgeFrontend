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
import { faRectangleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import LiveVideo from "../transactionform/LiveVideo";

function TransactionFrom2() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);

  const [inputValue, setInputValue] = useState();

  const [grossWeight, setGrossWeight] = useState(0);
  const [tareWeight, setTareWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [consignmentWeight, setConsignmentWeight] = useState(0);

  const [isGrossWeightEnabled, setIsGrossWeightEnabled] = useState(false);

  const [ticket, setTicket] = useState([]);
  const [port, setPort] = useState(null);

  const ticketNumber = queryParams.get("ticketNumber");

  const userId = sessionStorage.getItem("userId");

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
      } else {
        setGrossWeight(newValue);
      }
    }
  };

  const handleSave = async () => {
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
    const lowerBound = parseFloat((consignment - 100).toFixed(3));
    const upperBound = parseFloat((consignment + 100).toFixed(3));
    if (netWeight) {
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

    // const blobFront = await fetch(capturedFrontImage).then((res) => res.blob());
    // const blobRear = await fetch(capturedRearImage).then((res) => res.blob());
    // const blobSide = await fetch(capturedSideImage).then((res) => res.blob());
    // const blobTop = await fetch(capturedTopImage).then((res) => res.blob());
    // const payload = {
    //   machineId: "1",
    //   ticketNo: ticketNumber,
    //   weight: inputValue,
    // };

    const fetchAndAppendBlob = async (capturedImage, name) => {
      if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        return formD.append(name, blob, `${name}_${ticketNumber}_${Date.now()}.jpg`);
      }
    };

    const formD = new FormData();
    await Promise.all([
      fetchAndAppendBlob(capturedFrontImage, "frontImg1"),
      fetchAndAppendBlob(capturedRearImage, "backImg2"),
      fetchAndAppendBlob(capturedSideImage, "leftImg5"),
      fetchAndAppendBlob(capturedTopImage, "topImg3"),
    ]);
    const payload = {
      machineId: "1",
      ticketNo: ticketNumber,
      weight: inputValue,
    };
    formD.append("weighmentRequest", JSON.stringify(payload));
    const response = await axios({
      method: "post",
      url: `http://localhost:8080/api/v1/weighment/measure?userId=${userId}&role=${"WEIGHBRIDGE_OPERATOR"}`,
      data: formD,
      headers: {
        withCredentials: true,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log({ response });
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

  const canvasTopRef = useRef(null);
  const canvasRearRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const canvasSideRef = useRef(null);
  const [capturedTopImage, setCapturedTopImage] = useState(null);
  const [capturedRearImage, setCapturedRearImage] = useState(null);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null);
  const [capturedSideImage, setCapturedSideImage] = useState(null);

  const [weight, setWeight] = useState('Connecting...');
  const [trimmedWeight, setTrimmedWeight] = useState('');
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    const createWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8080/ws/weight');
 
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        setWeight('Waiting for data...');
      };
 
      ws.onmessage = (event) => {
        const receivedData = event.data.trim();
        console.log('Received data:', receivedData);
        setWeight(receivedData);
      
        // Extract and trim the weight
        const match = receivedData.match(/(\d+(\.\d+)?)/);
        if (match) {
          setTrimmedWeight(match[0]);
          setInputValue(match[0]); // Update the input value
        }
      };

 
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWeight('Error receiving data');
      };
 
      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        if (event.wasClean) {
          setWeight('Connection closed');
        } else {
          setWeight('Connection lost, attempting to reconnect...');
          setTimeout(createWebSocket, 5000); // Attempt to reconnect after 5 seconds
        }
      };
 
      setSocket(ws);
    };
 
    createWebSocket();

     // Cleanup on component unmount
  return () => {
    if (socket) {
      socket.close();
    }
  };
}, []); // Empty dependency array ensures useEffect runs only on mount

console.log(trimmedWeight );

  return (
    <SideBar5>
      <div className="container-fluid">
        <div className="container-fluid">
          <button className="close-button" onClick={goBack}>
            <FontAwesomeIcon icon={faRectangleXmark} />
          </button>
          <h2 className="text-center mb-3 mt-1">Outbound Transaction Form</h2>
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
            {/* <div className="col-md-6 mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={connectSerial}
                style={{ float: "right" }}
              >
                Connect Serial Port
              </button>
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
            <div className="col-md-12">
              {/* Input fields */}
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
        
        value={trimmedWeight} // Use trimmedWeight here
        onChange={(e) => {
          setTrimmedWeight(e.target.value);
          handleChange1(e);
        }}
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
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Gross Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${grossWeight} kg`}
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

                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Tare Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${tareWeight} kg`}
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
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Net Weight:
                    </label>

                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={`${netWeight} kg`}
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
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <div className="form-group">
                    <label htmlFor="vehicleType" className="form-label">
                      Consignment Weight:
                    </label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      autoComplete="off"
                      value={`${consignmentWeight} kg`}
                      className="abcx"
                      readOnly
                    />
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
                    wsUrl={"ws://localhost:8080/ws/frame2"}
                    imageRef={canvasRearRef}
                    setCapturedImage={setCapturedRearImage}
                    capturedImage={capturedRearImage}
                    label = "Rear View"
                  />
                </div>
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame14"}
                    imageRef={canvasFrontRef}
                    setCapturedImage={setCapturedFrontImage}
                    capturedImage={capturedFrontImage}
                    label = "Front View"
                  />
                </div>
                <div className="col-md-3">
                  <LiveVideo
                    wsUrl={"ws://localhost:8080/ws/frame5"}
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
