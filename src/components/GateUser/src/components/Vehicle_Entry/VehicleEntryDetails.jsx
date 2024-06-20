import { useState, useEffect, useRef } from "react";
import { Chart, ArcElement } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import Header from "../../../../Header/Header";
import SideBar2 from "../../../../SideBar/SideBar2";
// import camView from "../../assets/weighbridgeCam.webp";
import "./VehicleEntryDetails.css";
import ScannImage_IB from "../../assets/ScannImage_IB.jpg";
import CameraIcon_IB from "../../assets/CameraIcon_IB.jpg";
import AddNewVehicleImg_IB from "../../assets/AddNewVehicleImg_IB.jpg";
import styled from "styled-components";
// import frontView from "../../assets/frontView.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEraser,
  faCar,
  faPlus,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import Select from "react-select";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import NewVehicleRegistration from "./NewVehicleRegistration";


function VehicleEntryDetails() {
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const homeMainContentRef = useRef(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersAddressLine1, setSuppliersAddressLine1] = useState();
  const [transporter, setTransporter] = useState();
  const [materials, setMaterials] = useState([]);
  // const [transactionType, setTransactionType] = useState();
  const [materialType, setMaterialType] = useState([]);
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);



  //Code of Add New Vehicle

  const handleNewVehicle = () => {
    navigate("/vehicle-registration");
  };

  const getVehicles = async () => {
    try {
      const config = {
        url: "http://localhost:8080/api/v1/vehicles?size=20",
        method: 'get',

      }
      const response = await axios(config);
      console.log({ response: response.data });
      const numbers = response.data.map((vehicle) => ({
        value: vehicle.vehicleNo,
        label: vehicle.vehicleNo,
      }));
      setVehicleNumbers(numbers);

      const vehicleData = await sessionStorage.getItem('vehicleData');

      const requiredData = JSON.parse(vehicleData);

      const tempVehicleNo = numbers?.filter((item) => item.value === requiredData?.vehicleNo);

      setVehicleNo(tempVehicleNo);
      // await handleVehicleNoKeyPress(requiredData?.vehicleNo)

      console.log({ vehicleData: vehicleData.challanNo, requiredData: requiredData, numbers, tempVehicleNo, formData: { ...formData, ...requiredData } });

      setFormData({ ...formData, ...requiredData })


    } catch (error) {
      console.log(error);
    }
  }
  // Get API for Fetching  Vehicle No if Registerd:
  useEffect(() => {
    // Fetch vehicle numbers
    fetchMaterialList();
    getVehicles();
  }, []);


  // To add session userid in frontend

  const userId = sessionStorage.getItem("userId");

  // Get API Vehicle No details if we select from dropdown.

  const handleVehicleNoKeyPress = async (selectedVehicleNo) => {
    try {
      fetch(`
http://localhost:8080/api/v1/vehicles/vehicle/${selectedVehicleNo}`)
        .then((response) => response.json())
        .then((data) => {
          // Set transporter state with the data from the API response
          setTransporter(data.transporter);
          // Update other form data fields with the received data
          setFormData({
            ...formData,
            vehicleNo: data.vehicleNo,
            noOfWheels: data.vehicleWheelsNo,
            vehicleType: data.vehicleType,
            transporter: data.transporter,
            rcFitnessUpto: data.vehicleFitnessUpTo,
          });
        })
        .catch((error) => {
          console.error("Error fetching supplier Address:", error);
        });
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  // Get API for Supplier
  useEffect(() => {
    const fetchSupplierList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/supplier/get/list",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Assuming data is an array of suppliers, update state or handle data accordingly
        console.log(data); // Log the data to see its structure
        setSuppliers(data.map((supplier) => ({
          value: supplier,
          label: supplier,
        })));


      } catch (error) {
        console.error("Error fetching supplier list:", error);
      }
    };

    fetchSupplierList();
    // Retrieve supplier details from session storage
    // const storedSupplierDetails = sessionStorage.getItem('supplierDetails');
    // if (storedSupplierDetails) {
    //   const parsedDetails = JSON.parse(storedSupplierDetails);
    //   setFormData(parsedDetails);
    //   setSelectedSupplier({ value: parsedDetails.supplier, label: parsedDetails.supplier });
    // }

  }, []);

  // onChangeSupplier
  // const handleSupplierChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value, });

  const handleSupplierChange = (selectedOption) => {

    setSelectedSupplier(selectedOption);

    fetch(`http://localhost:8080/api/v1/supplier/get/${selectedOption.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Check if data is an array and has at least one element
        if (Array.isArray(data) && data.length > 0) {
          // Set the first element of the array as the supplier address
          const newData = {
            ...formData,
            supplier: selectedOption.value,
            supplierAddressLine1: data[0],

          }
          setFormData(newData);

          // Save supplier details to session storage

          sessionStorage.setItem('vehicleData', JSON.stringify(newData))
        }
      })
      .catch((error) => {
        console.error("Error fetching supplier Address:", error);
      });
  };

  // Add New Supplier
  const handleNewSupplier = () => {
    navigate("/new-supplier");
  };
  // Add New Material
  const handleNewMaterial = () => {
    navigate("/new-material");
  };

  const handleMaterialChange = (selectedOption) => {
    setFormData({ ...formData, material: selectedOption.value });
    setSelectedMaterial(selectedOption);
  };

  // Get API for Material:

  const fetchMaterialList = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/materials/names",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Assuming data is an array of Materials, update state or handle data accordingly
      console.log(data); // Log the data to see its structure
      setMaterials(data.map((material) => ({
        value: material,
        label: material,
      })));
    } catch (error) {
      console.error("Error fetching Materials list:", error);
    }
  };

  // Get API for Material Type:
  const fetchMaterialType = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    //   try {
    //     const response = await fetch(
    //       `http://localhost:8080/api/v1/materials/${e.target.value}/types`,
    //       {
    //         method: "GET",
    //         credentials: "include"
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     // Assuming data is an array of Materials, update state or handle data accordingly
    //     console.log(data); // Log the data to see its structure
    //     setMaterialType(data);
    //   } catch (error) {
    //     console.error("Error fetching Material Type:", error);
    //   }
    // };
    // getMaterialType(e.target.value);
  };
  const getMaterialType = (value) => {
    fetch(`http://localhost:8080/api/v1/materials/${value}/types`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newMaterialTypes = data.map((d) => {
          return {
            label: d,
            value: d
          }
        })
        const newData = newMaterialTypes?.filter((item) => item?.value === formData?.materialType);
        console.log({ newData })
        setSelectedMaterialType(newData)
        // Assuming data is an array of materialType names
        setMaterialType(newMaterialTypes); // Update the state with the fetched material types
        // setMaterialType(data); // Update the state with the fetched material types
      })
      .catch((error) => {
        console.error("Error fetching material types:", error);
      });
  }

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
  //         console.error("Error fetching supplier Address:", error);
  //       });
  //   }
  // };

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
    challanDate: "",
    poNo: "",
    tpNo: "",
    challanNo: "",
    vehicleNo: "",
    vehicleType: "",
    noOfWheels: "",
    supplier: "",
    supplierAddressLine1: "",
    transporter: "",
    material: "",
    materialType: "",
    driverDLNo: "",
    driverName: "",
    tpNetWeight: "",
    rcFitnessUpto: "",
    department: "",
    eWayBillNo: "",
    transactionType: "Inbound",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value, };
    await sessionStorage.setItem('vehicleData', JSON.stringify(newData));
    setFormData(newData);


    // Disable TP No if PO No is entered and vice versa
    // if (name === "poNo") {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     tpNo: value ? "" : prevData.tpNo,
    //   }));
    // } else if (name === "tpNo") {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     poNo: value ? "" : prevData.poNo,
    //   }));
    // }
  };
  const handleAddVehicle = async (selectedOption) => {
    console.log({ vehicleNo: selectedOption.value })
    const newData = { ...formData, vehicleNo: selectedOption?.value };
    setFormData(newData)
    await sessionStorage.setItem('vehicleData', JSON.stringify(newData));
    setVehicleNo(selectedOption);
    handleVehicleNoKeyPress(selectedOption.value);
  }

  const handleSave = () => {
    console.log(formData);
    // Check if any mandatory field is missing
    if (
      // !formData.poNo ||
      // !formData.tpNo ||
      // !formData.challanNo ||
      !formData.challanDate ||
      !formData.material ||
      !formData.materialType ||
      !formData.vehicleNo ||
      !formData.supplier ||
      !formData.driverDLNo ||
      !formData.driverName

    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all mandatory fields.",
      });
      return;
    }
    // Ensure transporter is defined and not null/undefined before calling toString()
    // const transporterString = transporter ? transporter.toString() : "";

    const gateData = {
      // userId,
      challanDate: formData.challanDate,
      supplier: formData.supplier,
      supplierAddressLine1: formData.supplierAddressLine1,
      transporter: Array.isArray(transporter) ? transporter.toString() : '',
      // transporter: transporterString,
      material: formData.material,
      materialType: formData.materialType,
      vehicle: formData.vehicleNo,
      dlNo: formData.driverDLNo,
      driverName: formData.driverName,
      supplyConsignmentWeight: formData.tpNetWeight,
      poNo: formData.poNo,
      tpNo: formData.tpNo,
      challanNo: formData.challanNo,
      ewayBillNo: formData.eWayBillNo,
      // department: formData.department,
      transactionType: formData.transactionType,
    };
    console.log({ gateData })
    // return false
    // Create JSON payload for saving Inbound details
    const payload = JSON.stringify(gateData);
    console.log("payload", payload);

    // Fetch API
    fetch(`http://localhost:8080/api/v1/gate?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      credentials: "include",
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
        sessionStorage.removeItem("vehicleData");
        handleClear();
        navigate("/VehicleEntry");
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

  const handleClear = () => {
    setFormData({
      challanDate: "",
      poNo: "",
      tpNo: "",
      challanNo: "",
      vehicleNo: "",
      vehicleType: "",
      noOfWheels: "",
      supplier: "",
      supplierAddressLine1: "",
      transporter: "",
      material: "",
      materialType: "",
      driverDLNo: "",
      driverName: "",
      tpNetWeight: "",
      rcFitnessUpto: "",
      // department: "",
      eWayBillNo: "",
      transactionType: "Inbound ",
    });

    setSelectedMaterialType(null);
    setSelectedMaterial(null);
    setSelectedSupplier(null);
    setVehicleNo(null);
  };

  const handleCapturePicture = () => {
    // Make a request to the backend to capture the picture
    // Display a Swal modal indicating that the picture will be coming from the backend
    Swal.fire({
      icon: "info",
      title: "Picture will be coming from backend",
      text: "Please wait...",
      customClass: {
        popup: "my-popup-class",
        title: "my-title-class",
        content: "my-content-class",
      },
    });
  };

  //Code for close icon
  const goBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    if (formData.material) {
      const newMaterial = materials.filter((item) => item.value === formData.material)
      getMaterialType(formData.material);
      setSelectedMaterial(newMaterial);
      console.log(formData.material, newMaterial, materials);

    }
    if (formData.supplier) {
      const newSupplier = suppliers.filter((item) => item.value === formData.supplier)
      setSelectedSupplier(newSupplier);
      console.log(formData.supplier, newSupplier, suppliers);

    }

  }, [formData.material, formData.supplier])

  return (
    <SideBar2>
      <div>

        <div className="VehicleEntryDetailsMainContent">
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
          <h2 className="text-center mb-4">Vehicle Entry Inbound Details</h2>
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
                            <label
                              htmlFor="challanDate"
                              className="user-form-label"
                            >
                              Challan Date:
                            </label>
                            <input
                              type="date"
                              id="challanDate"
                              name="challanDate"
                              value={formData.challanDate}
                              onChange={handleChange}
                              // required
                              className="form-control"
                            />
                          </div>
                          {/* Code Of Challan No */}
                          <div className="col-md-6">
                            <label
                              htmlFor="challanNo"
                              className="user-form-label"
                            >
                              Challan No:
                            </label>
                            <input
                              type="text"
                              id="challanNo"
                              name="challanNo"
                              value={formData.challanNo}
                              onChange={handleChange}

                              className="form-control"
                            />
                          </div>
                          {/* Code of TP NO */}
                          <div className="col-md-6 col-sm-12">
                            <label htmlFor="tpNo" className="user-form-label">
                              TP No:
                            </label>
                            <div className="input-group d-flex align-items-center" >
                              <input
                                type="text"
                                id="tpNo"
                                name="tpNo"
                                value={formData.tpNo}
                                onChange={handleChange}

                                className="form-control tpscanner"
                                // disabled={!!formData.poNo}
                                style={{ flexGrow: 1 }}
                              />
                              <button
                                className="scanner_button1"
                                style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                onClick={() => alert("Scan TP No")}
                              // disabled={!!formData.poNo}
                              >
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button>
                            </div>
                          </div>
                          {/* Code of PO NO */}
                          <div className="col-md-6 mb-3">
                            <label htmlFor="poNo" className="user-form-label">
                              PO No:
                            </label>
                            <input
                              type="text"
                              id="poNo"
                              name="poNo"
                              value={formData.poNo}
                              onChange={handleChange}

                              className="form-control"
                            // disabled={!!formData.tpNo}
                            />
                          </div>
                          {/* Code of Material */}

                          <div className="col-md-6">
                            <label
                              htmlFor="material"
                              className="user-form-label"
                            >
                              Material:
                              <span style={{ color: "red", fontWeight: "bold" }} > *{" "} </span>
                            </label>
                            <button
                              type="button"
                              className="btn btn-sm border btn-success-1 btn-hover"
                              style={{
                                borderRadius: "5px",
                                marginLeft: "5px",
                                backgroundColor: "lightblue",
                                // width: "200px",
                              }}
                            >
                              <div
                                onClick={handleNewMaterial}
                                style={{
                                  display: "block",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Add

                              </div>
                            </button>
                            <Select
                              id="material"
                              name="material"
                              options={materials}
                              value={selectedMaterial}
                              onChange={handleMaterialChange}
                              // onChange={(selectedOption) => {
                              //   setSelectedMaterial(selectedOption);
                              //   const newData = { ...formData, material: selectedOption.value };
                              //   sessionStorage.setItem('vehicleData', JSON.stringify(newData))
                              //   setFormData(newData)
                              // }
                              // }
                              placeholder="Select Material"
                              required
                            />
                          </div>

                          {/* Code of Material Type */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="materialType"
                              className="user-form-label"
                            >
                              Material Type:
                            </label>
                            <Select

                              options={materialType}
                              value={selectedMaterialType}
                              onChange={(selectedOption) => {
                                setSelectedMaterialType(selectedOption);
                                const newData = { ...formData, materialType: selectedOption.value };
                                sessionStorage.setItem('vehicleData', JSON.stringify(newData))
                                setFormData(newData)
                              }
                              }
                              placeholder="Select MaterialType"
                            />
                            {/* <select
                              id="materialType"
                              name="materialType"
                              value={formData.materialType}
                              onChange={handleChange}
                              className="form-select"
                              required
                            >
                              <option value="">Select material Type</option>
                              {materialType.map((materialType, index) => (
                                <option key={index} value={materialType}>
                                  {materialType}
                                </option>
                              ))}
                            </select> */}
                          </div>
                          {/* Code Of E-Way Bill No */}
                          <div className="col-md-6 col-sm-12">
                            <label
                              htmlFor="eWayBillNo"
                              className="user-form-label"
                            >
                              E-way Bill No:
                            </label>
                            <div className="input-group" style={{ display: "flex", alignItems: "center" }}>
                              <input
                                type="text"
                                id="eWayBillNo"
                                name="eWayBillNo"
                                value={formData.eWayBillNo}
                                onChange={handleChange}
                                className="form-control tpscanner"
                                style={{ flexGrow: 1 }}
                              />
                              <button
                                className="scanner_button4"
                                style={{ marginLeft: "2px", padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                onClick={() => alert("Scan E-WayBill No")}
                              >
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button>
                            </div>
                          </div>
                          {/* Code of TP Net Weight */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="tpNetWeight"
                              className="user-form-label"
                            >
                              TP Net Weight(Ton):
                            </label>
                            <input
                              type="text"
                              id="tpNetWeight"
                              name="tpNetWeight"
                              value={formData.tpNetWeight}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          {/* Code of Vehicle No */}

                          <div className="col-md-6">
                            <label
                              htmlFor="vehicleNo"
                              className="user-form-label"
                            >
                              Vehicle No:
                              <span style={{ color: "red", fontWeight: "bold" }}>  *{" "} </span>
                            </label>
                            <button
                              type="button"
                              className="btn btn-sm border btn-success-1 btn-hover"
                              style={{
                                borderRadius: "5px",
                                marginLeft: "5px",
                                backgroundColor: "lightblue",
                                // width: "200px",
                              }}
                            >
                              <div
                                onClick={handleNewVehicle}
                                style={{
                                  display: "block",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <FontAwesomeIcon icon={faCar} /> Add
                                {/* <button
                                  className="scanner_button2"
                                  style={{ marginLeft: "15px" }}
                                  onClick={() => alert("Scan Vehicle No")}
                                >
                                  <img src={ScannImage_IB} alt="Scanner" />
                                </button> */}
                              </div>
                            </button>
                            <Select
                              options={vehicleNumbers}
                              value={vehicleNo}
                              onChange={(selectedOption) => {
                                console.log(selectedOption)
                                handleAddVehicle(selectedOption);

                              }}
                              id="vehicleNo"
                              placeholder="Select Vehicle No"
                              isSearchable
                              required
                            />
                          </div>

                          {/* Code of  Supplier */}
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="supplier"
                              className="user-form-label"
                            >
                              Supplier:  <span style={{ color: "red", fontWeight: "bold" }} > *{" "} </span>
                            </label>

                            <button
                              type="button"
                              className="btn btn-sm border btn-success-1 btn-hover"
                              style={{
                                borderRadius: "5px",
                                marginLeft: "5px",
                                backgroundColor: "lightblue",
                                // width: "200px",
                              }}
                            >
                              <div
                                onClick={handleNewSupplier}
                                style={{
                                  display: "block",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Add
                              </div>
                            </button>

                            <Select
                              id="supplier"
                              name="supplier"
                              options={suppliers}
                              value={selectedSupplier}
                              onChange={handleSupplierChange}
                              placeholder="Select Supplier"
                              required
                            />
                          </div>
                          {/* Code of Driver DL No */}
                          <div className="col-md-6 col-sm-12">
                            <label
                              htmlFor="driverDLNo"
                              className="user-form-label"
                            >
                              Driver DL No:
                              <span style={{ color: "red", fontWeight: "bold" }}> * </span>
                            </label>
                            <div className="input-group" style={{ display: "flex", alignItems: "center" }}>
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
                                <img src={ScannImage_IB} alt="Scanner" />
                              </button>
                            </div>
                          </div>
                          {/* Code Of Driver Name */}
                          <div className="col-md-6">
                            <label
                              htmlFor="driverName"
                              className="user-form-label"
                            >
                              Driver Name:
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                *
                              </span>
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
                                      <span style={{ marginRight: "5px" }}>
                                        Front-View
                                      </span>
                                      <button
                                        className="table-btn"
                                        style={{
                                          position: "absolute",
                                          bottom: 0,
                                          right: 0,
                                          border: "0px",
                                        }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{
                                            width: "45px",
                                            height: "36px",
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>
                                        Back-View
                                      </span>
                                      <button
                                        className="table-btn"
                                        style={{
                                          position: "absolute",
                                          bottom: 0,
                                          right: 0,
                                          border: "0px",
                                        }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{
                                            width: "45px",
                                            height: "36px",
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                <tr></tr>
                                <tr>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>
                                        Top-View
                                      </span>
                                      <button
                                        className="table-btn"
                                        style={{
                                          position: "absolute",
                                          bottom: 0,
                                          right: 0,
                                          border: "0px",
                                        }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{
                                            width: "45px",
                                            height: "36px",
                                          }}
                                        />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="camview1">
                                      <span style={{ marginRight: "5px" }}>
                                        Side-View
                                      </span>
                                      <button
                                        className="table-btn"
                                        style={{
                                          position: "absolute",
                                          bottom: 0,
                                          right: 0,
                                          border: "0px",
                                        }}
                                        onClick={handleCapturePicture}
                                      >
                                        <img
                                          src={CameraIcon_IB}
                                          alt="Captured"
                                          style={{
                                            width: "45px",
                                            height: "36px",
                                          }}
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
                          {/* <style>
                            {`
                               .btn-primary-hover {
                                    background-color: white;
                                   color: #0275d8;
                                    border: 1px solid #cccccc;
                                              }

                             .btn-primary-hover:hover {
                                  background-color: #0275d8 !important; 
                                  color: white !important;
                              }
                              `}
                          </style> */}
                          {/* <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                            <button
                              type="button"
                              className="btn btn-primary me-4 btn-hover btn-primary-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#0275d8",
                                border: "1px solid #cccccc",
                                width: "150px",
                                height: "50px",
                              }}
                              onClick={hangleNewVehicle}
                            >
                              <FontAwesomeIcon
                                icon={faCar}
                                className="me-1"
                              />{" "}
                              Add New..
                            </button>
                          </div> */}
                          <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                            <button
                              type="button"
                              className="btn btn-danger me-4 btn-hover"
                              style={{
                                backgroundColor: "white",
                                color: "#d63031",
                                border: "1px solid #cccccc",
                                width: "150px",
                                height: "50px",
                              }}
                              onClick={handleClear}
                            >
                              <FontAwesomeIcon
                                icon={faEraser}
                                className="me-1"
                              />{" "}
                              Clear
                            </button>
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
                              <FontAwesomeIcon icon={faSave} className="me-1" />{" "}
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Of Last Section which is coming from Backend */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-3 p-2 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <label htmlFor="noOfWheels" className="user-form-label">
                          No of Wheels:
                        </label>
                        <input
                          type="text"
                          id="noOfWheels"
                          name="noOfWheels"
                          value={formData.noOfWheels}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.vehicleNo}
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      {/* Vehicle Type */}
                      <div className="col-md-3">
                        <label
                          htmlFor="vehicleType"
                          className="user-form-label"
                        >
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
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label
                          htmlFor="supplierContactNo"
                          className="user-form-label"
                        >
                          Supplier's Address:
                        </label>
                        <input
                          type="text"
                          id="supplierAddressLine1"
                          name="supplierAddressLine1"
                          value={formData.supplierAddressLine1}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.supplier}
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                      {/* Rc fitness UpTo */}
                      <div className="col-md-3">
                        <label
                          htmlFor="rcFitnessUpto"
                          className="user-form-label"
                        >
                          RC Fitness Upto:
                        </label>
                        <input
                          type="text"
                          id="rcFitnessUpto"
                          name="rcFitnessUpto"
                          value={formData.rcFitnessUpto}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.vehicleNo}
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>

                      {/* Transporter */}
                      <div className="col-md-3">
                        <label
                          htmlFor="transporter"
                          className="user-form-label"
                        >
                          Transporter:
                        </label>
                        <input
                          type="text"
                          id="transporter"
                          name="transporter"
                          value={formData.transporter}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.vehicleNo}
                          style={{
                            backgroundColor: "#efefef",
                            color: "#818181",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBar2 >
  );
}

export default VehicleEntryDetails;
