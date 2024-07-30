import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./ProcessOrder.css";
import SideBar6 from "../../SideBar/Sidebar6";
import { faSave, faEraser, faHome, faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Modal, Select as AntSelect } from 'antd';

const { Option } = AntSelect;

function ProcessOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saleOrderNo, productName, balanceQty, customerName, customerAddress } = location.state || {};

  const [formsaleOrderNo, setFormsaleOrderNo] = useState(saleOrderNo || "");
  const [formProductName, setFormProductName] = useState(productName || "");
  const [productType, setProductType] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [balance, setBalance] = useState(() => {
    const sessionBalance = sessionStorage.getItem("balanceQty");
    return sessionBalance ? parseFloat(sessionBalance) : (balanceQty || 0);
  });

  const [isFollowOnModalVisible, setIsFollowOnModalVisible] = useState(false);
  const [followOnOrders, setFollowOnOrders] = useState([]);
  const [selectedFollowOnOrder, setSelectedFollowOnOrder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/vehicles?size=20")
      .then((response) => response.json())
      .then((data) => {
        const numbers = data.transactions.map((vehicle) => ({
          value: vehicle.vehicleNo,
          label: vehicle.vehicleNo,
        }));
        setVehicleNumbers(numbers);
      })
      .catch((error) => console.error("Error fetching vehicle numbers:", error));

    const savedFormData = sessionStorage.getItem("processOrderFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormsaleOrderNo(parsedData.formsaleOrderNo || "");
      setFormProductName(parsedData.formProductName || "");
      setProductType(parsedData.productType || "");
      setVehicleNo(parsedData.vehicleNo || "");
      setTransporterName(parsedData.transporterName || "");
      sessionStorage.removeItem("processOrderFormData");
    } else {
      setBalance(balanceQty || parseFloat(sessionStorage.getItem("balanceQty")) || 0);
    }

    sessionStorage.setItem("balanceQty", balance.toString());
  }, [balanceQty, balance]);

  useEffect(() => {
    if (vehicleNo) {
      fetch(`http://localhost:8080/api/v1/vehicles/${vehicleNo.value}`)
        .then((response) => response.json())
        .then((data) => {
          setTransporters(data.transporter);
        })
        .catch((error) => console.error("Error fetching transporter details:", error));
    }
  }, [vehicleNo]);

  useEffect(() => {
    if (formProductName) {
      fetch(`http://localhost:8080/api/v1/products/${encodeURIComponent(formProductName)}/types`)
        .then((response) => response.json())
        .then((data) => {
          setProductTypes(data);
        })
        .catch((error) => console.error("Error fetching product types:", error));
    } else {
      setProductTypes([]);
    }
  }, [formProductName]);

  const handleClear = () => {
    setProductType("");
    setVehicleNo("");
    setTransporterName("");
    sessionStorage.removeItem("balanceQty");
  };

  const handleAddVehicle = () => {
    sessionStorage.setItem(
      "processOrderFormData",
      JSON.stringify({
        formsaleOrderNo,
        formProductName,
        productType,
        vehicleNo,
        transporterName,
      })
    );
    navigate("/SalesVehicle");
  };

  const handleSave = () => {
    if (!formsaleOrderNo || !formProductName || !productType || !vehicleNo || !transporterName) {
      Swal.fire({
        title: "Please fill in all the required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    if (balance < 60) {
      Swal.fire({
        title: 'Low Balance Quantity',
        html: `The current balance quantity is <strong>${balance}</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Use Existing',
        cancelButtonText: 'Create New',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          saveSalesPass();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Create New Order',
            text: 'Choose an option',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Follow On',
            cancelButtonText: 'New Order',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              fetchFollowOnOrders();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              navigate('/create-new-order');
            }
          });
        }
      });
    } else {
      saveSalesPass();
    }
  };

  const saveSalesPass = () => {
    const salesProcessData = {
      saleOrderNo: formsaleOrderNo,
      productName: formProductName,
      productType,
      vehicleNo: vehicleNo.value,
      transporterName,
    };

    fetch("http://localhost:8080/api/v1/salesProcess/salesProcess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesProcessData),
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
          title: "Sales pass created successfully",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
        sessionStorage.removeItem("processOrderFormData");
        navigate("/sales-dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
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

  const fetchFollowOnOrders = () => {
    const queryParams = new URLSearchParams({
      customerName,
      customerAddress,
      productName: formProductName,
      saleOrder: saleOrderNo
    });

    fetch(`http://localhost:8080/api/v1/sales/saleOrderList?${queryParams}`)
      .then(response => response.json())
      .then(data => {
        setFollowOnOrders(data);
        setIsFollowOnModalVisible(true);
      })
      .catch(error => {
        console.error('Error fetching follow-on orders:', error);
        Swal.fire('Error', 'Failed to fetch follow-on orders', 'error');
      });
  };

  const handleFollowOnOrderSelect = (value) => {
    setSelectedFollowOnOrder(value);
  };

  const handleFollowOnModalOk = () => {
    if (selectedFollowOnOrder) {
      setIsFollowOnModalVisible(false);
      const selectedOrder = followOnOrders.find(order => order.saleOrderNo === selectedFollowOnOrder);
      setFormsaleOrderNo(selectedOrder.saleOrderNo);
      setBalance(selectedOrder.balanceQuantity);
      Swal.fire('Success', 'Follow-on order selected', 'success');
    } else {
      Swal.fire('Warning', 'Please select a follow-on order', 'warning');
    }
  };

  const handleFollowOnModalCancel = () => {
    setIsFollowOnModalVisible(false);
  };

  return (
    <SideBar6>
      <div className="sales-process-management container-fluid">
        <div className="sales-process-main-content">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center mx-auto">Create Sales Pass</h2>
            <Link to={"/sales-dashboard"}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ float: "right", fontSize: "1.5em" }}
                className="mb-2"
              />
            </Link>
          </div>
          <div className="sales-process-card-container">
            <div className="card" style={{
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            }}>
              <div className="card-body p-4">
                <form>
                  <p style={{ color: "red" }}>Please fill all * marked fields.</p>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label htmlFor="purchaseOrderNo" className="form-label">
                        Sales Order No <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="purchaseOrderNo"
                        placeholder="Enter Purchase Order No"
                        value={formsaleOrderNo}
                        onChange={(e) => setFormsaleOrderNo(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="productName" className="form-label">
                        Product Name <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        placeholder="Enter Product Name"
                        value={formProductName}
                        onChange={(e) => setFormProductName(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="productType" className="form-label">
                        Product Type <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        id="productType"
                        value={productType}
                        required
                        onChange={(e) => setProductType(e.target.value)}
                        disabled={!productTypes.length}
                      >
                        <option value="">Select Product Type</option>
                        {productTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label htmlFor="vehicleNo" className="form-label">
                        Vehicle No <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                      </label>
                      <button
                        className="btn btn-sm border btn-success-1 btn-hover"
                        style={{
                          borderRadius: "5px",
                          marginLeft: "5px",
                          backgroundColor: "lightblue",
                        }}
                      >
                        <div
                          onClick={handleAddVehicle}
                          style={{
                            display: "block",
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          Add <FontAwesomeIcon icon={faTruck} />
                        </div>
                      </button>
                      <Select
                        options={vehicleNumbers}
                        value={vehicleNo}
                        onChange={setVehicleNo}
                        id="vehicleNo"
                        placeholder="Select Vehicle No"
                        isSearchable
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="transporterName" className="form-label">
                        Transporter Name <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        id="transporterName"
                        value={transporterName}
                        onChange={(e) => setTransporterName(e.target.value)}
                        required
                      >
                        <option value="">Select Transporter Name</option>
                        {transporters.map((transporter, index) => (
                          <option key={index} value={transporter}>{transporter}</option>
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
      </div>

      <Modal
        title="Select Follow-on Order"
        open={isFollowOnModalVisible}
        onOk={handleFollowOnModalOk}
        onCancel={handleFollowOnModalCancel}
      >
        <AntSelect
          style={{ width: '100%' }}
          placeholder="Select a follow-on order"
          onChange={handleFollowOnOrderSelect}
          value={selectedFollowOnOrder}
        >
          {followOnOrders.map(order => (
            <Option key={order.saleOrderNo} value={order.saleOrderNo}>
              {order.saleOrderNo} - Balance: {order.balanceQuantity}
            </Option>
          ))}
        </AntSelect>
      </Modal>
    </SideBar6>
  );
}

export default ProcessOrder;