import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEraser,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import SideBar3 from "../../../../SideBar/SideBar3";
import { useMediaQuery } from "react-responsive";
import { Chart, ArcElement } from "chart.js/auto";
import styled from 'styled-components';

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

const MainContent = styled.div`
  min-height: calc(100vh - 80vh); /* Adjust the value (56px) as needed for your navbar height */
  display: flex;
  flex-direction: column;
`;

const TransFormMainDiv = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const QualityInboundCoalDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    date: null,
    in: null, // Changed from inTime
    out: null, // Changed from outTime
    vehicleNo: null,
    transporterName: null,
    transactionType: null,
    ticketNo: null,
    tpNo: null,
    poNo: null,
    challanNo: null,
    supplierOrCustomerName: null,
    supplierOrCustomerAddress: null,
    materialName: null,
    materialType: null,
  });

  const [parameters, setParameters] = useState({});

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
      materialName: urlParams.get("materialName"),
      materialType: urlParams.get("materialType"),
    };
  
    setFormData(urlData);
  
    const fetchParameters = async () => {
      try {
        let response;
        if (urlData.transactionType === "Inbound") {
          response = await fetch(
            `http://172.16.20.161:8080/api/v1/materials/parameters?materialName=${urlData.materialName}&supplierName=${urlData.supplierOrCustomerName}&supplierAddress=${urlData.supplierOrCustomerAddress}`
          );
        } else {
          response = await fetch(
            `http://172.16.20.161:8080/api/v1/products/parameters?productName=${urlData.materialName}&customerName=${urlData.supplierOrCustomerName}&customerAddress=${urlData.supplierOrCustomerAddress}`
          );
        }
        const data = await response.json();
        if (data.length > 0 && data[0].parameters) {
          const ranges = data[0].parameters.reduce((acc, parameter) => {
            acc[parameter.parameterName] = {
              rangeFrom: parameter.rangeFrom,
              rangeTo: parameter.rangeTo,
            };
            return acc;
          }, {});
          setParameters(ranges);
        }
      } catch (error) {
        console.error("Error fetching parameter ranges:", error);
      }
    };
  
    if (urlData.materialName && urlData.materialType) {
      fetchParameters();
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
      materialName: formData.materialName,
      materialType: formData.materialType,
      ...formData,
    };

    console.log("Form data being sent:", data); // Added console log

    try {
      const response = await fetch(
        `http://172.16.20.161:8080/api/v1/qualities/${formData.ticketNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value === "" ? null : value,
    }));
  };
  

  useEffect(() => {
    // Any side effect code can be placed here
    // console.log("Updated state:", formData);
  }, [formData]);

  const generateFieldNameWithRange = (parameterName) => {
    const parameter = parameters[parameterName];
    if (!parameter) return `${parameterName}`;
    const { rangeFrom, rangeTo } = parameter;
    return `${parameterName} (${rangeFrom}-${rangeTo})`;
  };

  const handleKeyPress = (event) => {
    // Allow only numeric characters and certain special characters like dot (.) and minus (-)
    const allowedCharacters = /[0-9.-]/;
    if (!allowedCharacters.test(event.key)) {
      event.preventDefault();
    }
  };

 const renderFieldWithBox = (
  fieldName,
  propertyName,
  isReadOnly = false,
  isRequired = false
) => {
  const inputStyle = isReadOnly
    ? { borderColor: "#ced4da", backgroundColor: "rgb(239, 239, 239)" }
    : {};
  const asteriskStyle = isRequired ? { color: "red" } : {};
  const value = formData[propertyName] !== null ? formData[propertyName] : "-";

  return (
    <div className="col-md-3 mb-3">
      <label htmlFor={propertyName} className="form-label">
        {fieldName}:
        {isRequired && <span style={asteriskStyle}>*</span>}
        </label>
     <input
       type="text"
       name={propertyName}
       autoComplete="off"
       value={value}
       onChange={handleInputChange}
       onKeyPress={handleKeyPress}
       required={isRequired}
       readOnly={isReadOnly}
       style={inputStyle}
       className="form-control"
       id={propertyName}
     />
   </div>
 );
};

 const handleClear = () => {
   setFormData({
     ...formData,
     ...Object.keys(parameters).reduce((acc, parameterName) => {
       acc[parameterName] = "";
       return acc;
     }, {}),
   });
 };
 return (
   <SideBar3>
     <div className="d-flex">
       <div className="flex-grow-1">
         <h2
           className="text-center p-2"
           style={{ fontFamily: "Arial", fontSize: "clamp(12px, 4vw, 30px)" }}
         >
           Ticket Insights & Quality Inputs
         </h2>
         <MainContent>
           <TransFormMainDiv>
             <div className="container-fluid overflow-hidden">
               <div className="d-flex justify-content-between align-items-center mb-2 ml-6">
                 <div></div>
                 <div>
                   <FontAwesomeIcon
                     icon={faSave}
                     className="btn-icon mx-3"
                     onClick={handleSave}
                     style={{ fontSize: "1.5em", color: "#008060" }}
                   />
                   <FontAwesomeIcon
                     icon={faEraser}
                     className="btn-icon mx-3"
                     onClick={handleClear}
                     style={{ fontSize: "1.5em", color: "#d63031" }}
                   />
                   <FontAwesomeIcon
                     icon={faPrint}
                     className="btn-icon mx-3"
                     style={{ fontSize: "1.5em", color: "#3e8ee6" }}
                   />
                 </div>
               </div>
               <div className="row">
                 <div className="col-lg-12">
                   <div className="card mb-3 p-2 border shadow-lg">
                     <div className="card-body">
                       <div className="row">
                         {renderFieldWithBox("TicketNo", "ticketNo", true)}
                         {renderFieldWithBox("Date", "date", true)}
                         {renderFieldWithBox("Vehicle Number", "vehicleNo", true)}
                         {renderFieldWithBox("Transporter", "transporterName", true)}
                         {renderFieldWithBox("Tp No", "tpNo", true)}
                         {renderFieldWithBox("Po No", "poNo", true)}
                         {renderFieldWithBox("Challan No", "challanNo", true)}
                         {renderFieldWithBox("Material", "materialName", true)}
                         {renderFieldWithBox("Material Type", "materialType", true)}
                         {renderFieldWithBox("Supplier/Customer", "supplierOrCustomerName", true)}
                         {renderFieldWithBox("Supplier/Customer Address", "supplierOrCustomerAddress", true)}
                         {renderFieldWithBox("Transaction Type", "transactionType", true)}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="row">
                 <div className="col-lg-12">
                   <div className="card mb-3 p-2 border shadow-lg">
                     <div className="card-body">
                       <div className="row">
                         {Object.keys(parameters).map((parameterName) => (
                           <React.Fragment key={parameterName}>
                             {renderFieldWithBox(
                               generateFieldNameWithRange(parameterName),
                               parameterName,
                               false,
                               true
                             )}
                           </React.Fragment>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </TransFormMainDiv>
         </MainContent>
       </div>
     </div>
   </SideBar3>
 );
};
export default QualityInboundCoalDetails;