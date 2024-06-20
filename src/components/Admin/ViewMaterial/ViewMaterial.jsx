import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import SideBar from "../../SideBar/SideBar";
import './ViewMaterial.css';
import {
  Box,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ViewMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/materials')
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error('Error fetching materials:', error));
  }, []);

  const handleViewClick = (materialName) => {
    fetch(`http://localhost:8080/api/v1/materials/view/${materialName}/parameters`)
      .then(response => response.json())
      .then(data => {
        setModalData(data);
        setSelectedMaterial(materialName);
        setOpen(true);
      })
      .catch(error => console.error('Error fetching material parameters:', error));
  };

  const handleClose = () => setOpen(false);

  const columns = [
    {
      title: 'Material ID',
      dataIndex: 'materialId',
      key: 'materialId',
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: 'Material Type Name',
      dataIndex: 'materialTypeName',
      key: 'materialTypeName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          icon={<VisibilityIcon />}
          onClick={() => handleViewClick(record.materialName)}
        />
      ),
    },
  ];

  return (
    <SideBar>
      <div className='view-material-page container-fluid'>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Material</h2>
          <Link to={"/home1"}>
            <FontAwesomeIcon icon={faHome} style={{ float: "right", fontSize: "1.5em" }} className="mb-3"/>
          </Link>
        </div>
        <div className="table-responsive">
          <Table dataSource={materials} columns={columns} rowKey="materialId" 
          className="user-table mt-3 custom-table"/>
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              maxHeight: '80vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'red',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              {selectedMaterial} Parameters
            </Typography>
            {modalData.map((item, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Supplier Name:</strong> {item.supplierName}
                </Typography>
                <Typography variant="body2">
                  <strong>Supplier Address:</strong> {item.supplierAddress}
                </Typography>
                {item.parameters.map((parameter, paramIndex) => (
                  <Box key={paramIndex} sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      <strong>{parameter.parameterName}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {parameter.rangeFrom}(Min) - {parameter.rangeTo}(Max)
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Modal>
      </div>
    </SideBar>
  );
};

export default ViewMaterial;
