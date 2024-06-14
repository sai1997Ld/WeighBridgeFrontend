import React, { useState } from 'react';
import { Button, Card, Input, Form } from 'antd';
import SideBar3 from "../../../../SideBar/SideBar3";

const QPrint = () => {
  const [ticketNo, setTicketNo] = useState('');
  
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/qualities/report-response/${ticketNo}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      handlePrint(ticketNo, data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data for printing. Please try again later.");
    }
  };

  const handleClear = () => {
    setTicketNo('');
    console.log('Clear clicked');
  };

  const handlePrint = async (ticketNo, data) => {
    const printWindow = window.open("", "_blank");
    const formattedData = `
      <html>
        <head>
          <title>Print Report</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #0077b6;
              color: white;
            }
          </style>
        </head>
        <body>
          <h2>${data.companyName}</h2>
          <p>${data.companyAddress}</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
            ${Object.entries(data)
              .filter(([key, value]) => typeof value !== "object" || value === null)
              .map(
                ([key, value]) =>
                  `<tr><td>${key}</td><td>${
                    typeof value === "object" ? JSON.stringify(value) : value
                  }</td></tr>`
              )
              .join("")}
            ${
              data.qualityParameters
                ? `<tr>
                    <td>Quality Parameters</td>
                    <td>
                      <table>
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                        </tr>
                        ${Object.entries(data.qualityParameters)
                          .map(
                            ([key, value]) =>
                              `<tr><td>${key}</td><td>${value}</td></tr>`
                          )
                          .join("")}
                      </table>
                    </td>
                  </tr>`
                : ""
            }
          </table>
          <script>
            window.print();
            window.close();
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(formattedData);
  };

  return (
    <SideBar3>
      <Card
        title="Print Card"
        style={{
          width: 400,
          margin: '100px auto 0', // Adjusted margin to bring the card further down
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Ticket Number">
            <Input 
              placeholder="Search by Ticket Number" 
              value={ticketNo} 
              onChange={(e) => setTicketNo(e.target.value)} 
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>
              Search
            </Button>
            <Button onClick={handleClear}>Clear</Button>
          </Form.Item>
        </Form>
      </Card>
    </SideBar3>
  );
};

export default QPrint;
