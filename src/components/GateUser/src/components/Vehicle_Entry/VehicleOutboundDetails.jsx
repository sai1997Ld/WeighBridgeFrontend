import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SideBar2 from "../../../../SideBar/SideBar2";
import "./VehicleOutboundDetails.css";
import ScannImage_IB from "../../assets/ScannImage_IB.jpg";
import CameraIcon_IB from "../../assets/CameraIcon_IB.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEraser, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import Select from "react-select";
import axios from 'axios';


function VehicleOutboundDetails() {

  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const [Customers, setCustomers] = useState([]);
  const [CustomersAddressLine1, setCustomersAddressLine1] = useState();
  const [transporter, setTransporter] = useState();
  const [Products, setProducts] = useState([]);
  // const [transactionType, setTransactionType] = useState();
  const [ProductType, setProductType] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const [saleDetails, setSaleDetails] = useState([]);



  const sale = queryParams.get("sales");






  // Get API for Customer
  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/Customer/get/list",
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of Customers, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching Customer list:", error);
      }
    };

    fetchCustomerList();
  }, []);

  // onChangeCustomer
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    fetch(`http://localhost:8080/api/v1/Customer/get/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Check if data is an array and has at least one element
        if (Array.isArray(data) && data.length > 0) {
          // Set the first element of the array as the Customer address
          setFormData((prevData) => ({
            ...prevData,
            CustomerAddressLine1: data[0]
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching Customer Address:", error);
      });
  };



  // Get API for Product:

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/Products/names",
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of Products, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setProducts(data);
      } catch (error) {
        console.error("Error fetching Products list:", error);
      }
    };

    fetchProductList();
  }, []);

  // Get API for Product Type:
  const fetchProductType = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    //   try {
    //     const response = await fetch(
    //       `http://localhost:8080/api/v1/Products/${e.target.value}/types`,
    //       {
    //         method: "GET",
    //         credentials: "include"
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     // Assuming data is an array of Products, update state or handle data accordingly
    //     console.log(data); // Log the data to see its structure
    //     setProductType(data);
    //   } catch (error) {
    //     console.error("Error fetching Product Type:", error);
    //   }
    // };
    fetch(`http://localhost:8080/api/v1/Products/${e.target.value}/types`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Assuming data is an array of ProductType names
        setProductType(data); // Update the state with the fetched Product types
      })
      .catch((error) => {
        console.error("Error fetching Product types:", error);
      });
  };


  // Get API Vehicle No.

  // const handleVehicleNoKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault(); // Prevent form submission
  //     // Call API with the entered vehicle number
  //     fetch(`http://localhost:8080/api/v1/vehicles/vehicle/${formData.vehicleNo}`)
  //       .then((response) => response.json())
  //       .then((data) => {

  //         // Set transporter state with the data from the API response
  //         setTransporter(data.transporter);
  //         // Update other form data fields with the received data
  //         setFormData((prevData) => ({
  //           ...prevData,
  //           vehicleNo: data.vehicleNo,
  //           noOfWheels: data.vehicleWheelsNo,
  //           vehicleType: data.vehicleType,
  //           transporter: data.transporter,
  //           rcFitnessUpto: data.vehicleFitnessUpTo
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching Customer Address:", error);
  //       });
  //   }
  // };

  const handleVehicleNoBlur = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/vehicles/vehicle/${formData.vehicleNo}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFormData((prevFormData) => ({
        ...prevFormData,
        vehicleNo: data.vehicleNo || prevFormData.vehicleNo,
        noOfWheels: data.vehicleWheelsNo || prevFormData.noOfWheels,
        vehicleType: data.vehicleType || prevFormData.vehicleType,
        transporter: data.transporter || prevFormData.transporter,
        rcFitnessUpto: data.vehicleFitnessUpTo || prevFormData.rcFitnessUpto,
      }));
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
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
    poNo: "",
    salePassNo: "",
    SaleOrderNo: "",
    vehicleNo: "",
    vehicleType: "",
    noOfWheels: "",
    Customer: "",
    CustomerAddressLine1: "",
    transporter: "",
    Product: "",
    ProductType: "",
    driverDLNo: "",
    driverName: "",
    quantity: "",
    rcFitnessUpto: "",
    department: "",
    eWayBillNo: "",
    transactionType: "Inbound"
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Disable TP No if PO No is entered and vice versa
    if (name === "poNo") {
      setFormData((prevData) => ({
        ...prevData,
        salePassNo: value ? "" : prevData.salePassNo,
      }));
    } else if (name === "salePassNo") {
      setFormData((prevData) => ({
        ...prevData,
        poNo: value ? "" : prevData.poNo,
      }));
    }
  };

  const handleSave = () => {

    const gateData = {
      // userId,
      // saleOrderDate: saleDetails.saleOrderDate,
      customer: saleDetails.customerName,
      customerAddressLine: saleDetails.customerAddress,
      transporter: saleDetails.transporterName,
      material: saleDetails.productName,
      materialType: saleDetails.productType,
      vehicle: saleDetails.vehicleNo,
      dlNo: formData.driverDLNo,
      driverName: formData.driverName,
      supplyConsignmentWeight: saleDetails.consignmentWeight,
      poNo: saleDetails.purchaseOrderNo,
      challanDate: formData.saleOrderDate,
      tpNo: saleDetails.salePassNo,
      challanNo: saleDetails.saleOrderNo,
      // ewayBillNo: formData.eWayBillNo,
      // department: formData.department,
      transactionType: "Outbound"
    };

    // Create JSON payload
    const payload = JSON.stringify(gateData);
    console.log("payload", payload);
    // Fetch API

    fetch("http://localhost:8080/api/v1/gate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: payload,
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Transaction with id ${data} created Successfully!`,
        });


        // Reset form data after 3 seconds and navigate to VehicleEntry page
        setTimeout(() => {
          setFormData({
            poNo: "",
            salePassNo: "",
            saleOrderDate: "",
            SaleOrderNo: "",
            vehicleNo: "",
            vehicleType: "",
            noOfWheels: "",
            Customer: "",
            CustomerAddress: "",
            transporter: "",
            material: "",
            materialType: "",
            driverDLNo: "",
            driverName: "",
            quantity: "",
            // rcFitnessUpto: "",
            // eWayBillNo: "",
            // transactionType: "Inbound"
          });
          navigate("/VehicleEntry");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  // const handleClear = () => {
  //   setFormData({
  //     poNo: "",
  //     salePassNo: "",
  //     saleOrderDate: "",
  //     SaleOrderNo: "",
  //     vehicleNo: "",
  //     vehicleType: "",
  //     noOfWheels: "",
  //     Customer: "",
  //     CustomerAddress: "",
  //     transporter: "",
  //     material: "",
  //     materialType: "",
  //     driverDLNo: "",
  //     driverName: "",
  //     quantity: "",
  //     rcFitnessUpto: "",
  //     eWayBillNo: "",
  //     transactionType: "Inbound "
  //   });
  // };

  const handleCapturePicture = () => {
    // Make a request to the backend to capture the picture
    // Display a Swal modal indicating that the picture will be coming from the backend
    Swal.fire({
      icon: "info",
      title: "Picture will be coming from backend",
      text: "Please wait...",
      customClass: {
        popup: 'my-popup-class',
        title: 'my-title-class',
        content: 'my-content-class'
      }
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/sales/getBySalePassNo?salePassNo=${sale}`, {
        withCredentials: true,
      })
      .then((response) => {
        setSaleDetails(response.data);
        console.log(response.data);

      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, []);

  // Code for Close icon
  const goBack = () => {
    navigate(-1);
  }

  return (
    <SideBar2>
      <>
        <div className="VehicleoutboundDetailsMainContent"  >
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
          <h2 className="text-center mb-4">Create Outbound Ticket </h2>
          <div className="row">
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          {/* Code of Challan Date */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="saleOrderDate" className="outbound-form-label">
                              Sale Order Date:
                            </label>
                            <input
                              type="text"
                              id="saleOrderDate"
                              name="saleOrderDate"
                              value={saleDetails.saleOrderDate}
                              onChange={handleChange}
                              // required
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code Of Challan No */}
                          <div className="col-md-6">
                            <label htmlFor="SaleOrderNo" className="outbound-form-label ">
                              Sale Order No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="SaleOrderNo"
                              name="SaleOrderNo"
                              value={saleDetails.saleOrderNo}
                              onChange={handleChange}
                              // required
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of TP NO */}
                          <div className="col-md-6 ">
                            <label htmlFor="poNo" className="outbound-form-label ">
                              PO No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="poNo"
                              name="poNo"
                              value={saleDetails.purchaseOrderNo}
                              onChange={handleChange}
                              // required
                              readOnly
                              className="form-control"
                              disabled
                            />
                          </div>
                          {/* Code of PO NO */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="salePassNo" className="outbound-form-label ">
                              Sale Pass No:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id="salePassNo"
                                name="salePassNo"
                                value={saleDetails.salePassNo}
                                onChange={handleChange}
                                // required
                                readOnly
                                className="form-control tpscanner"
                                disabled
                              />
                              {/* <button
                  className="scanner_button1"
                  style={{ marginLeft: "2px" }}
                  onClick={() => alert("Scan TP No")}
                  disabled={!!formData.salePassNo}
                >
                 
                  <img
                    src={scanner}
                    alt="Scanner"
                 
                  />
                </button> */}
                            </div>
                          </div>
                          {/* Code of Material */}
                          <div className="col-md-6">
                            <label htmlFor="Product" className="outbound-form-label">
                              Product:
                            </label>
                            <input
                              type="text"
                              id="Product"
                              name="Product"
                              value={saleDetails.productName}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of Material Type */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="ProductType" className="outbound-form-label">
                              Product Type:
                            </label>
                            <input
                              type="text"
                              id="ProductType"
                              name="ProductType"
                              value={saleDetails.productType}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code Of E-Way Bill No */}

                          {/* Code of TP Net Weight */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="quantity" className="outbound-form-label">
                              Quantity (MT):
                            </label>
                            <input
                              type="text"
                              id="quantity"
                              name="quantity"
                              value={saleDetails.consignmentWeight}
                              onChange={handleChange}
                              readOnly
                              disabled
                              className="form-control"
                            />
                          </div>
                          {/* Code of Vehicle No */}

                          <div className="col-md-6">
                            <label htmlFor="vehicleType" className="outbound-form-label">
                              Vehicle Type:
                            </label>
                            <input
                              type="text"
                              id="vehicleType"
                              name="vehicleType"
                              value={formData.vehicleType}
                              onChange={handleChange}
                              className="form-control"
                              disabled={!formData.vehicleNo}
                              style={{ backgroundColor: '#efefef', color: '#818181' }}
                            />
                          </div>

                          {/* Code of Driver DL No */}
                          <div className="col-md-6">
                            <label htmlFor="transporter" className="outbound-form-label ">
                              Transporter:
                            </label>
                            <input
                              type="text"
                              id="transporter"
                              name="transporter"
                              value={saleDetails.transporterName}
                              onChange={handleChange}
                              className="form-control"
                              // placeholder="Enter Transporter"
                              disabled={!formData.vehicleNo}
                              style={{ backgroundColor: '#efefef', color: '#818181' }}
                            />
                          </div>
                          {/* Code Of RC Fitness Upto */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="rcFitnessUpto" className="outbound-form-label">
                              RC Fitness Upto:
                              {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
                            </label>
                            <input
                              type="text"
                              id="rcFitnessUpto"
                              name="rcFitnessUpto"
                              value={formData.rcFitnessUpto}
                              onChange={handleChange}
                              // required
                              className="form-control"
                              disabled={!formData.vehicleNo}
                              style={{ backgroundColor: '#efefef', color: '#818181' }}
                            />
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="Customer" className="outbound-form-label ">
                              Customer:
                            </label>
                            <input
                              type="text"
                              id="customer"
                              name="customer"
                              value={saleDetails.customerName}
                              onChange={handleChange}
                              readOnly
                              className="form-control"
                              disabled
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="CustomerContactNo" className="outbound-form-label">
                              Customer's Address:
                            </label>
                            <input
                              type="text"
                              id="CustomerAddressLine1"
                              name="CustomerAddressLine1"
                              value={saleDetails.customerAddress}
                              onChange={handleChange}
                              className="form-control"
                              disabled={!formData.Customer}
                              style={{ backgroundColor: '#efefef', color: '#818181' }}
                            />
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <label htmlFor="driverDLNo" className="outbound-form-label ">
                              Driver DL No:
                              <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id="driverDLNo"
                                name="driverDLNo"
                                value={formData.driverDLNo}
                                onChange={handleChange}
                                required
                                className="form-control tpscanner"
                                style={{ flexGrow: 1 }}
                              />
                              <button
                                className="scanner_button3"
                                style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                onClick={() => alert("Scan Driver DL No")}
                              >
                                {/* Use the imported scanner image */}
                                <img
                                  src={ScannImage_IB}
                                  alt="Scanner"
                                // style={{ width: "25px", height: "25px" }}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="driverName" className="outbound-form-label">
                              Driver Name:
                              <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="driverName"
                              name="driverName"
                              value={formData.driverName}
                              onChange={handleChange}
                              required
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6 mb-3"></div>
                        </div>
                      </div>
                      {/* Code of Camera View  */}
                      <div className="col-md-6" style={{ marginTop: "-16px" }}>
                        <div className="mb-0">
                          <div>
                            <table className="camview1 table">
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>Front-View</span>
                                      <button
                                        className="table-btn"
                                        style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{ width: "45px", height: "36px" }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>Back-View</span>
                                      <button
                                        className="table-btn"
                                        style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{ width: "45px", height: "36px" }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr></tr>
                                <tr>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>Top-View</span>
                                      <button
                                        className="table-btn"
                                        style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{ width: "45px", height: "36px" }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>Side-View</span>
                                      <button
                                        className="table-btn"
                                        style={{ position: "absolute", bottom: 0, right: 0, border: "0px" }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{ width: "45px", height: "36px" }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div style={{ height: 20 }}></div>
                        <div className="row justify-content-end mt-6 mb-2">
                          <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                            {/* <button
                              type="button"
                              className="btn btn-danger me-4 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#d63031",
                                border: "1px solid #cccccc",
                                width: "100px",
                              }}
                              onClick={handleClear}
                            >
                              <FontAwesomeIcon icon={faEraser} className="me-1" /> Clear
                            </button> */}
                            <button
                              type="button"
                              className="btn btn-success-1 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#008060",
                                width: "150px",
                                height: "50px",
                                border: "1px solid #cccccc",
                              }}
                              onClick={handleSave}
                            >
                              <FontAwesomeIcon icon={faSave} className="me-1" /> Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </SideBar2>

  );
}

export default VehicleOutboundDetails;
