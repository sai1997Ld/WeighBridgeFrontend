import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./NewVehicleRegistration.css";
import { faSave, faEraser, faRectangleXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import SideBar2 from "../../../../SideBar/SideBar2";

function NewVehicleRegistration() {
    const navigate = useNavigate();
    const [vehicleNo, setVehicleNo] = useState("");
    const [transporter, setTransporter] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleManufacturer, setVehicleManufacturer] = useState("");
    const [vehicleWheelsNo, setvehicleWheelsNo] = useState("");
    const [vehicleFitnessUpTo, setvehicleFitnessUpTo] = useState("");
    const [vehicleLoadCapacity, setVehicleLoadCapacity] = useState("");
    const [transporters, setTransporters] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://172.16.20.161:8080/api/v1/transporter")
            .then((response) => response.json())
            .then((data) => setTransporters(data))
            .catch((error) => console.error("Error fetching transporters:", error));
    }, []);



    const handleClear = () => {
        setVehicleNo("");
        setTransporter("");
        setVehicleType("");
        setVehicleManufacturer("");
        setvehicleWheelsNo("");
        setvehicleFitnessUpTo("");
        setVehicleLoadCapacity("");
    };


    const handleSave = () => {
        if (
            vehicleNo.trim() === "" ||
            transporter.trim() === ""
            // vehicleFitnessUpTo.trim() === "" ||
            // vehicleLoadCapacity.toString().trim() === ""
        ) {
            Swal.fire({
                title: "Please fill out all required fields.",
                icon: "warning",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-warning",
                },
            });
            return;

        }

        const vehicleData = {
            vehicleNo,
            transporter,
            vehicleType,
            vehicleManufacturer,
            vehicleWheelsNo,
            vehicleFitnessUpTo,
            vehicleLoadCapacity,
        };

        fetch(`http://172.16.20.161:8080/api/v1/vehicles/${transporter}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vehicleData),
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    return response.json().then((error) => {
                        throw new Error(error.message);
                    });
                }
            })
            .then((data) => {
                console.log("Response from the API:", data);
                Swal.fire({
                    title: data,
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                });
                handleClear();
                navigate("/VehicleEntryDetails"); // Navigate to VehicleEntryDetails page
            })
            .catch((error) => {
                console.error("Error:", error);
                setError(error.message);
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                });
            });
    };


    // Add New Transporter
    const handleNewTransporter = () => {
        navigate("/new-transporter");
    };


    //Code for close icon
    const goBack = () => {
        navigate(-1);
    }

    return (
        <SideBar2>
            <div className="vehicle-register">
                <div className="vehicle-content container-fluid">
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
                    <h2 className="text-center"> New Vehicle Registration</h2>
                    <div className="vehicle-user-container card" style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)" }}>
                        <div className="card-body p-4">
                            <form>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleNo" className="form-label">
                                            Vehicle Number{" "}
                                            <span style={{ color: "red", fontWeight: "bold" }}>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="vehicleNo"
                                            placeholder="Enter Vehicle Number"
                                            value={vehicleNo}
                                            onChange={(e) => setVehicleNo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="transporter" className="form-label">
                                            Transporter{" "}
                                            {/* <span style={{ color: "red", fontWeight: "bold" }}>  * </span> */}
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
                                                onClick={handleNewTransporter}
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
                                            options={transporters.map((transporter) => ({
                                                value: transporter,
                                                label: transporter,
                                            }))}
                                            value={{ value: transporter, label: transporter }}
                                            onChange={(selectedOption) =>
                                                setTransporter(selectedOption.value)
                                            }
                                            placeholder="Select Transporter"
                                            isSearchable
                                        // required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleType" className="form-label">
                                            Vehicle Type{" "}
                                            {/* <span style={{ color: "red", fontWeight: "bold" }}> </span> */}
                                        </label>
                                        <Select
                                            options={[
                                                { value: "mini-truck", label: "Mini Truck" },
                                                { value: "large-truck", label: "Large Truck" },
                                                { value: "others", label: "Others" },
                                            ]}
                                            value={{ value: vehicleType, label: vehicleType }}
                                            onChange={(selectedOption) =>
                                                setVehicleType(selectedOption.value)
                                            }
                                            placeholder="Select Vehicle Type"
                                            isSearchable
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleManufacturer" className="form-label">
                                            Vehicle Manufacturer
                                        </label>
                                        <Select
                                            options={[
                                                { value: "Tata Motors", label: "Tata Motors" },
                                                {
                                                    value: "Ashok Leyland Limited",
                                                    label: "Ashok Leyland Limited",
                                                },
                                                {
                                                    value: "VE Commercial Vehicles Limited",
                                                    label: "VE Commercial Vehicles Limited",
                                                },
                                                {
                                                    value: "Mahindra & Mahindra Limited",
                                                    label: "Mahindra & Mahindra Limited",
                                                },
                                                { value: "Piaggio India", label: "Piaggio India" },
                                                {
                                                    value: "Scania Commercial Vehicle India Pvt Ltd",
                                                    label: "Scania Commercial Vehicle India Pvt Ltd",
                                                },
                                                { value: "Force Motors", label: "Force Motors" },
                                                { value: "Bharat Benz", label: "Bharat Benz" },
                                                { value: "others", label: "Others" },
                                            ]}
                                            value={{
                                                value: vehicleManufacturer,
                                                label: vehicleManufacturer,
                                            }}
                                            onChange={(selectedOption) =>
                                                setVehicleManufacturer(selectedOption.value)
                                            }
                                            placeholder="Select Manufacturer"
                                            isSearchable
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label htmlFor="vehicleLoadCapacity" className="form-label">
                                            Vehicle Load Capacity{" "}
                                            {/* <span style={{ color: "red", fontWeight: "bold" }}> </span> */}
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="vehicleLoadCapacity"
                                            placeholder="Enter Vehicle Load Capacity"
                                            value={vehicleLoadCapacity}
                                            onChange={(e) => setVehicleLoadCapacity(e.target.value)}
                                            min={0}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="vehicleFitnessUpTo" className="form-label">
                                            Fitness Upto{" "}
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="vehicleFitnessUpTo"
                                            value={vehicleFitnessUpTo}
                                            onChange={(e) => setvehicleFitnessUpTo(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="vehicleWheelsNo" className="form-label">
                                            Wheels
                                        </label>
                                        <select
                                            className="form-select vehicle-select"
                                            id="vehicleWheelsNo"
                                            value={vehicleWheelsNo}
                                            onChange={(e) => setvehicleWheelsNo(e.target.value)}
                                        >
                                            {[4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((wheel) => (
                                                <option key={wheel} value={wheel}>
                                                    {wheel}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-danger me-4 btn-hover"
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            border: "1px solid #cccccc",
                                            width: "100px",
                                        }}
                                        onClick={handleClear}
                                    >
                                        <FontAwesomeIcon icon={faEraser} className="me-1" />
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success-1 btn-hover"
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            width: "100px",
                                            border: "1px solid #cccccc",
                                        }}
                                        onClick={handleSave}
                                    >
                                        <FontAwesomeIcon icon={faSave} className="me-1" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </SideBar2>
    );
}

export default NewVehicleRegistration;
