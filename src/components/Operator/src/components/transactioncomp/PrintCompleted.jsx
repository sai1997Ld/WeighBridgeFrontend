import React from "react";

const PrintCompleted = React.forwardRef((props, ref) => {
  const { ticketData } = props;

  if (!ticketData) {
    return null;
  }

  return (
    <div ref={ref}>
      <h1 style={{ textAlign: "center" }}>{ticketData.companyName}</h1>
      <h3 style={{ textAlign: "center" }}>{ticketData.companyAdress}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Ticket No:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.ticketNo}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Vehicle No:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.vehicleNo}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Product:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.productName}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Material:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.materialName}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Transporter:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.transporterName}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Customer:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.customerName}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Supplier:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.supplierName}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Challan:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.challanNo}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Gross Weight:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.grossWeight} kg</td>
            <td style={{  fontSize: "18px" }}><strong>Date:</strong></td>
            <td style={{  fontSize: "18px" }}>{ticketData.grossWeightDate}</td>
            <td style={{  fontSize: "18px" }}><strong>Time:</strong></td>
            <td style={{  fontSize: "18px" }}>{ticketData.grossWeightTime}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Tare Weight:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.tareWeight} kg</td>
            <td style={{  fontSize: "18px" }}><strong>Date:</strong></td>
            <td style={{ fontSize: "18px" }}>{ticketData.tareWeightDate}</td>
            <td style={{ fontSize: "18px" }}><strong>Time:</strong></td>
            <td style={{ fontSize: "18px" }}>{ticketData.tareWeightTime}</td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Net Weight:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px" }}>{ticketData.netWeight} kg</td>
          </tr>
           {/* Signature Rows */}
           <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Issued by:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px", borderBottom: "1px solid black" }}></td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Approved by:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px", borderBottom: "1px solid black" }}></td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Loaded by:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px", borderBottom: "1px solid black" }}></td>
          </tr>
          <tr>
            <td style={{ padding: "10px", fontSize: "18px", whiteSpace: "nowrap" }}><strong>Security Officer:</strong></td>
            <td style={{ padding: "10px", fontSize: "18px", borderBottom: "1px solid black" }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default PrintCompleted;
