import { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import SideBar from "../../SideBar/SideBar";
import './ViewProduct.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('http://172.16.20.161:8080/api/v1/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleViewClick = (productName) => {
    fetch(`http://172.16.20.161:8080/api/v1/products/view/${productName}/parameters`)
      .then(response => response.json())
      .then(data => {
        setModalData(data);
        setSelectedProduct(productName);
        setOpen(true);
      })
      .catch(error => console.error('Error fetching product parameters:', error));
  };

  const handleClose = () => setOpen(false);

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Product Type Name',
      dataIndex: 'productTypeName',
      key: 'productTypeName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          icon={<VisibilityIcon />}
          onClick={() => handleViewClick(record.productName)}
        />
      ),
    },
  ];

  return (
    <SideBar>
      <div className='view-product-page container-fluid'>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-center mx-auto">View Product</h2>
          <Link to={"/home1"}>
            <FontAwesomeIcon icon={faHome} style={{ float: "right", fontSize: "1.5em" }} className="mb-3"/>
          </Link>
        </div>
        <div className="table-responsive">
          <Table dataSource={products} columns={columns} rowKey="productId" 
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
      {selectedProduct} Parameters
    </Typography>
    {modalData.map((item, index) => (
      <Box key={index} sx={{ mt: 2 }}>
        <Typography variant="body1">
          <strong>{item.parameterName}</strong>
        </Typography>
        <Typography variant="body2">
          {item.rangeFrom}(Min) - {item.rangeTo}(Max)
        </Typography>
      </Box>
    ))}
  </Box>
</Modal>
      </div>
    </SideBar>
  );
};

export default ViewProduct;
