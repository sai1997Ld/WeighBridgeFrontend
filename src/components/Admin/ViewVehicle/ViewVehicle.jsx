import { useState, useEffect } from 'react';
import { Table, Input } from 'antd'; // Import Input and Tooltip
import SideBar from "../../SideBar/SideBar";
import './ViewVehicle.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

const { Search } = Input;

const ViewVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleNoFilter, setVehicleNoFilter] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/vehicles?page=0&size=10&sortField=vehicleModifiedDate&sortOrder=desc');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchVehicleByNo = async () => {
    try {
      if (vehicleNoFilter.trim() === "") {
        fetchVehicles();
        return;
      }
      const response = await fetch(`http://localhost:8080/api/v1/vehicles/${vehicleNoFilter}`);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch vehicle data");
      }
      const vehicleData = await response.json();
      setVehicles([vehicleData]);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const columns = [
    {
      title: 'Vehicle Number',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    },
    {
      title: 'Transporter',
      dataIndex: 'transporter',
      key: 'transporter',
      render: transporter => (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {transporter.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Vehicle Type',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: 'Vehicle Manufacturer',
      dataIndex: 'vehicleManufacturer',
      key: 'vehicleManufacturer',
    },
    {
      title: 'Fitness Up to',
      dataIndex: 'fitnessUpto',
      key: 'fitnessUpto',
    },
    {
      title: 'Vehicle Status',
      dataIndex: 'vehicleStatus',
      key: 'vehicleStatus',
    }
  ];

  return (
    <SideBar>
      <div className='view-vehicle-page container-fluid'>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Vehicle</h2>
          <Link to={"/home1"}>
            <FontAwesomeIcon icon={faHome} style={{float: "right", fontSize: "1.5em"}} className="mb-3"/>
          </Link>
        </div>
        <div className="filters d-flex justify-content-between gap-2">
          <Search
            placeholder="Search Vehicle Number"
            value={vehicleNoFilter}
            onChange={(e) => setVehicleNoFilter(e.target.value)}
            style={{ width: 200 }}
            onSearch={fetchVehicleByNo}
          />
        </div>
        <div className="table-responsive">
          <Table dataSource={vehicles} columns={columns} rowKey="vehicleNo" 
          className="user-table mt-3 custom-table"/>
        </div>
      </div>
    </SideBar>
  );
};

export default ViewVehicle;
