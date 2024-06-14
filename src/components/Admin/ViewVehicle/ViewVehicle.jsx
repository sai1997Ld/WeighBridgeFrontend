
import { useState, useEffect } from 'react';
import { Table } from 'antd';
import SideBar from "../../SideBar/SideBar";
import './ViewVehicle.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const ViewVehicle = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch('http://172.16.20.161:8080/api/v1/vehicles')
      .then(response => response.json())
      .then(data => setVehicles(data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }, []);

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
              <FontAwesomeIcon icon={faHome} style={{float: "right", fontSize: "1.5em"}}  className="mb-3"/>
              </Link>
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
