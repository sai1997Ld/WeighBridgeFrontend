import React from "react";

const TicketPrintComponentGU = React.forwardRef((props, ref) => {
    const { ticketData } = props;

    if (!ticketData) {
        return null;
    }

    const divStyle = {
        border: "1px solid #ccc",
        padding: "20px",
        marginBottom: "20px",
    };

    const headingStyle = {
        fontSize: "24px",
        marginBottom: "10px",
    };

    const paragraphStyle = {
        margin: "5px 0",
    };

    return (
        <div ref={ref} style={divStyle}>

            <h2 style={{ textAlign: "center" }}>{ticketData.companyName}</h2>
            <h4 style={{ textAlign: "center" }}>{ticketData.siteName}</h4>
            <div style={{ paddingLeft: "5%" }}>

                <p> <strong> Ticket No: </strong> {ticketData.ticketNo} </p>
                <p> <strong> Vehicle No: </strong> {ticketData.vehicleNo} </p>
                <p> <strong> Vehicle In: </strong> {ticketData.vehicleIn} </p>
                <p> <strong> Vehicle Out: </strong> {ticketData.vehicleOut} </p>
                <p> <strong> Transporter Name: </strong> {ticketData.transporter} </p>

                {ticketData.transactionType === "Inbound" && (
                    <>
                        <p><strong>Supplier:</strong> {ticketData.supplier}</p>
                        <p><strong>Supplier Address:</strong> {ticketData.supplierAddress}</p>
                    </>
                )}

                {ticketData.transactionType === "Outbound" && (
                    <>
                        <p><strong>Customer:</strong> {ticketData.customer}</p>
                        <p><strong>Customer Address:</strong> {ticketData.customerAddress}</p>
                    </>
                )}

                {ticketData.transactionType === "Inbound" && (
                    <>
                        <p> <strong> Material: </strong> {ticketData.material} </p>
                        <p> <strong> Material Type: </strong> {ticketData.materialType} </p>
                    </>
                )}

                {ticketData.transactionType === "Outbound" && (
                    <>
                        <p> <strong> Product: </strong> {ticketData.productName} </p>
                        <p> <strong> Product Type: </strong> {ticketData.productType} </p>
                    </>
                )}


                <p> <strong> TP No: </strong> {ticketData.tpNo} </p>
                <p> <strong> TP Net Weight : </strong> {ticketData.tpNetWeight} </p>
                <p> <strong> PO No: </strong> {ticketData.poNo} </p>
                <p> <strong> Challan: </strong> {ticketData.challanNo} </p>
                <p> <strong> Challan Date: </strong> {ticketData.challanDate} </p>
                <p> <strong> Transaction Date: </strong> {ticketData.transactionDate} </p>
                <p> <strong> Transaction Type: </strong> {ticketData.transactionType} </p>

            </div>
        </div>
    );
});

export default TicketPrintComponentGU;
