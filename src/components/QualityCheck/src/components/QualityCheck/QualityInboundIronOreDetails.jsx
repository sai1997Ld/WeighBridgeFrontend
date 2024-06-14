import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTrashAlt,
  faPrint,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import SideBar3 from "../../../../SideBar/SideBar3";
import { useMediaQuery } from "react-responsive";
import { Chart, ArcElement } from "chart.js/auto";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

const QualityInboundIronOreDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    date: "",
    inTime: "",
    outTime: "",
    vehicleNo: "",
    transporterName: "",
    transactionType: "",
    ticketNo: "",
    tpNo: "",
    poNo: "",
    challanNo: "",
    supplierOrCustomerName: "",
    supplierOrCustomerAddress: "",
    materialOrProduct: "",
    materialTypeOrProductType: "",
  });

  const [parameterRanges, setParameterRanges] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = {
      date: urlParams.get("date"),
      inTime: urlParams.get("inTime"),
      outTime: urlParams.get("outTime"),
      vehicleNo: urlParams.get("vehicleNo"),
      transporterName: urlParams.get("transporterName"),
      transactionType: urlParams.get("transactionType"),
      ticketNo: urlParams.get("ticketNo"),
      tpNo: urlParams.get("tpNo"),
      poNo: urlParams.get("poNo"),
      challanNo: urlParams.get("challanNo"),
      supplierOrCustomerName: urlParams.get("supplierOrCustomerName"),
      supplierOrCustomerAddress: urlParams.get("supplierOrCustomerAddress"),
      materialOrProduct: urlParams.get("materialOrProduct"),
      materialTypeOrProductType: urlParams.get("materialTypeOrProductType"),
    };

    setFormData(urlData);

    const fetchParameterRanges = async () => {
      try {
        const response = await fetch(
          `http://172.16.20.161:8080/api/v1/materials/${urlData.materialOrProduct}/parameters`
        );
        const data = await response.json();
        if (data.length > 0 && data[0].parameters) {
          const ranges = data[0].parameters.reduce((acc, parameter) => {
            acc[parameter.parameterName] = {
              rangeFrom: parameter.rangeFrom,
              rangeTo: parameter.rangeTo,
            };
            return acc;
          }, {});
          setParameterRanges(ranges);
        }
      } catch (error) {
        console.error("Error fetching parameter ranges:", error);
      }
    };

    if (urlData.materialOrProduct && urlData.materialTypeOrProductType) {
      fetchParameterRanges();
    }
  }, []);

  const handleSave = async () => {
    const data = {
      ticketNo: formData.ticketNo,
      date: formData.date,
      vehicleNo: formData.vehicleNo,
      transporterName: formData.transporterName,
      transactionType: formData.transactionType,
      tpNo: formData.tpNo,
      poNo: formData.poNo,
      challanNo: formData.challanNo,
      supplierOrCustomerName: formData.supplierOrCustomerName,
      supplierOrCustomerAddress: formData.supplierOrCustomerAddress,
      materialOrProduct: formData.materialOrProduct,
      materialTypeOrProductType: formData.materialTypeOrProductType,
      size_20mm: formData.size_20mm || 0,
      size_03mm: formData.size_03mm || 0,
      fe_t: formData.fe_t || 0,
      loi: formData.loi || 0,
    };

    try {
      const response = await fetch(
        `http://172.16.20.161:8080/api/v1/qualities/${formData.ticketNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials:"include"
        }
      );

      if (response.ok) {
        console.log("Data saved successfully");
        const queryString = new URLSearchParams(data).toString();
        navigate(`/QualityCheck?${queryString}`);
      } else {
        console.error("Error saving data:", response.status);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const currentDateTime = new Date().toLocaleString();

  const [material, setMaterial] = useState("Select");

  useEffect(() => {
    Chart.register(ArcElement);
  }, []);

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Any side effect code can be placed here
    // console.log("Updated state:", formData);
  }, [formData]);

  const generateFieldNameWithRange = (parameterName) => {
    if (!parameterRanges[parameterName]) return parameterName;
    const { rangeFrom, rangeTo } = parameterRanges[parameterName];
    return `${parameterName} % (${rangeFrom}-${rangeTo})`;
  };

  const renderFieldWithBox = (fieldName, fieldValue, propertyName, onChange) => {
    return (
      <div className="col-md-3 mb-3">
        <label htmlFor={propertyName} className="form-label">
          {fieldName}:
        </label>
        <input
          type="text"
          name={propertyName}
          autoComplete="off"
          value={fieldValue || ""}
          onChange={onChange}
          required
          className="form-control"
          id={propertyName}
        />
      </div>
    );
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <SideBar3 />
        <h3 className="text-center p-3">Quality Check Inbound Iron Ore Details</h3>
        <div className="main-content mt-1 ms-md-3">
          <div className="container-fluid trans-form-main-div overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-2 ml-6">
              <div></div>
              <div>
                <button className="btn btn-primary mx-2" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button className="btn btn-secondary mx-2">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button className="btn btn-secondary mx-2">
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
              <div className="card mb-3 p-3 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      {renderFieldWithBox("TicketNo", formData.ticketNo, "ticketNo", handleInputChange)}
                      {renderFieldWithBox("Date", formData.date, "date", handleInputChange)}
                      {renderFieldWithBox("Vehicle Number", formData.vehicleNo, "vehicleNo", handleInputChange)}
                      {renderFieldWithBox("Transporter", formData.transporterName, "transporterName", handleInputChange)}
                      {renderFieldWithBox("Tp No", formData.tpNo, "tpNo", handleInputChange)}
                      {renderFieldWithBox("Po No", formData.poNo, "poNo", handleInputChange)}
                      {renderFieldWithBox("Challan No", formData.challanNo, "challanNo", handleInputChange)}
                      {renderFieldWithBox("Material", formData.materialOrProduct, "materialOrProduct", handleInputChange)}
                      {renderFieldWithBox("Material Type", formData.materialTypeOrProductType, "materialTypeOrProductType", handleInputChange)}
                      {renderFieldWithBox("Supplier", formData.supplierOrCustomerName, "supplierOrCustomerName", handleInputChange)}
                      {renderFieldWithBox("Supplier Address", formData.supplierOrCustomerAddress, "supplierOrCustomerAddress", handleInputChange)}
                      {renderFieldWithBox("Transaction Type", formData.transactionType, "transactionType", handleInputChange)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
              <div className="card mb-3 p-3 border shadow-lg">
                  <div className="card-body">
                    <div className="row">
                      {renderFieldWithBox(generateFieldNameWithRange("size_20mm"), formData.size_20mm, "size_20mm", handleInputChange)}
                      {renderFieldWithBox(generateFieldNameWithRange("size_03mm"), formData.size_03mm, "size_03mm", handleInputChange)}
                      {renderFieldWithBox(generateFieldNameWithRange("fe_t"), formData.fe_t, "fe_t", handleInputChange)}
                      {renderFieldWithBox(generateFieldNameWithRange("loi"), formData.loi, "loi", handleInputChange)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityInboundIronOreDetails;