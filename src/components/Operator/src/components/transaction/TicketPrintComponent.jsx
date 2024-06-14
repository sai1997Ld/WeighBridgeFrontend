import React from "react";

const TicketPrintComponent = React.forwardRef((props, ref) => {
  const { ticketData } = props;

  if (!ticketData) {
    return null;
  }

  return (
    <div ref={ref}>
      <h2 style={{textAlign:"center"}}>{ticketData.companyName}</h2>
      <h4 style={{textAlign:"center"}}>{ticketData.companyAdress}</h4>
      <div style={{paddingLeft:"5%"}}>
        <p>
          <strong>Ticket No: </strong> {ticketData.ticketNo}
        </p>
        <p>
          <strong>Vehicle No: </strong> {ticketData.vehicleNo}
        </p>
        <p>
          <strong>Product: </strong> {ticketData.productName}
        </p>
        <p>
          <strong>Material: </strong> {ticketData.materialName}
        </p>
        <p>
          <strong>Transporter: </strong> {ticketData.transporterName}
        </p>
        <p>
          <strong>Customer: </strong> {ticketData.customerName}
        </p>
        <p>
          <strong>Supplier: </strong> {ticketData.supplierName}
        </p>
        <p>
          <strong>Challan: </strong> {ticketData.challanNo}
        </p>
      </div>
      <div className="row" style={{ paddingTop:"3%",paddingLeft:"5%"}}>
        <p>
          <strong className="col-4">Gross Weight:</strong> {ticketData.grossWeight}ton
          <span style={{paddingLeft:"2%"}}><strong>Date:</strong> {ticketData.grossWeightDate}</span>
          <span style={{paddingLeft:"2%"}}><strong>Time:</strong> {ticketData.grossWeightTime}</span>
        </p>
        <p>
          <strong  className="col-4">Tare Weight:</strong> {ticketData.tareWeight}ton
          <span style={{paddingLeft:"2%"}} ><strong>Date:</strong> {ticketData.tareWeightDate}</span>
          <span style={{paddingLeft:"2%"}}><strong>Time:</strong> {ticketData.tareWeightTime}</span>
        </p>
        <p>
          <strong>Net Weight:</strong> {ticketData.netWeight}ton
        </p>
      </div>
    </div>
  );
});

export default TicketPrintComponent;
