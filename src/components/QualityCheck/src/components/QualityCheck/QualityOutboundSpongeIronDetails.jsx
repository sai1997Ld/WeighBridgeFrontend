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

const QualityOutboundSpongeIronDetails = () => {
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
        const response = await fetch(`http://localhost:8080/api/v1/materials/${urlData.materialOrProduct}/types/${urlData.materialTypeOrProductType}`);
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
      size: formData.size || 0,
      fe_m: formData.fe_m || 0,
      fe_t: formData.fe_t || 0,
      Mtz: formData.Mtz || 0,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/qualities/${formData.ticketNo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials:"include"
      });

      if (response.ok) {
        console.log("Data saved successfully");
        // You can perform additional actions here, such as navigating or resetting the form
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
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1023px)" });
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

  // Add useEffect to execute side effects after rendering
  useEffect(() => {
    // Any side effect code can be placed here
    console.log("Updated state:", formData);
  }, [formData]); // This will ensure the effect runs whenever formData changes



  const generateFieldNameWithRange = (parameterName) => {
    if (!parameterRanges[parameterName]) return parameterName;
    const { rangeFrom, rangeTo } = parameterRanges[parameterName];
    return `${parameterName} % (${rangeFrom}-${rangeTo})`;
  };

  const renderFieldWithBox = (fieldName, fieldValue, propertyName, onChange) => {
    return (
      <div className="field-container">
        <label htmlFor={propertyName} className="form-label">
          {fieldName}:
        </label>
        <input
          type="text"
          name={propertyName}
          autoComplete="off"
          value={fieldValue || ''}
          onChange={onChange}
          required
          className="form-control"
          id={propertyName} // Add this line to ensure id matches name
        />
      </div>
    );
  };
  
  



  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        
        <SideBar3
        />
        <div
          className={`quality-outbound-sponge-iron-detail-check-main-content ${isSidebarExpanded ? "expanded" : ""
            }`}>
          <div className="container-fluid trans-form-main-div overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="quality-outbound-header">Quality Check Outbound Sponge Iron Details</h3>
              <div>
                <button className="qt-btn button-transition mx-2" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button className="qt-btn button-transition mx-2">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button className="qt-btn button-transition mx-2">
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <div className="quality-outbound-upper-card p-0">
                  <div className="row mx-0 mb-6">
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                    {renderFieldWithBox("Ticket No", formData.ticketNo, "ticketNo", handleInputChange)}
{renderFieldWithBox("Date", formData.date, "date", handleInputChange)}
{renderFieldWithBox("Vehicle Number", formData.vehicleNo, "vehicleNo", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                    {renderFieldWithBox("Transporter", formData.transporterName, "transporterName", handleInputChange)}
{renderFieldWithBox("Material", formData.materialOrProduct, "materialOrProduct", handleInputChange)}
{renderFieldWithBox("Material Type", formData.materialTypeOrProductType, "materialTypeOrProductType", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                    {renderFieldWithBox("Tp No", formData.tpNo, "tpNo", handleInputChange)}
{renderFieldWithBox("Po No", formData.poNo, "poNo", handleInputChange)}
{renderFieldWithBox("Challan No", formData.challanNo, "challanNo", handleInputChange)}
                    </div>
                    <div className="col-lg-3 px-4 py-3">
                    {renderFieldWithBox("Supplier", formData.supplierOrCustomerName, "supplierOrCustomerName", handleInputChange)}
{renderFieldWithBox("Supplier Address", formData.supplierOrCustomerAddress, "supplierOrCustomerAddress", handleInputChange)}
{renderFieldWithBox("Transaction Type", formData.transactionType, "transactionType", handleInputChange)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="quality-outbound-lower-card  p-0">
                  <div className="row mx-0">
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                    {renderFieldWithBox(generateFieldNameWithRange("Size"), formData.size, "size", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                      {renderFieldWithBox(generateFieldNameWithRange("%Fe(m)"), formData.fe_m, "fe_m", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                      {renderFieldWithBox(generateFieldNameWithRange("%Fe(t)"), formData.fe_t, "fe_t", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                      {renderFieldWithBox(generateFieldNameWithRange("%Mtz"), formData.Mtz, "Mtz", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                    {renderFieldWithBox(generateFieldNameWithRange("%Carbon"), formData.carbon, "carbon", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                      {renderFieldWithBox(generateFieldNameWithRange("%Sulphur"), formData.sulphur, "sulphur", handleInputChange)}
                    </div>
                    <div className="col-lg-3 mb-3 mb-lg-0 px-4 py-3">
                      {renderFieldWithBox(generateFieldNameWithRange("%Non-Mag"), formData.non_mag, "non_mag", handleInputChange)}
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

export default QualityOutboundSpongeIronDetails;