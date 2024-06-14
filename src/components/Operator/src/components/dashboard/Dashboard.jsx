import { useState, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,
  faUsersSlash,
  faTruck,
  faTruckMoving,
  faUser,
  faUserTie,
  faUserFriends,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

import "./Dashboard.css";

import SideBar5 from "../../../../SideBar/SideBar5";

import { Link, useNavigate } from "react-router-dom";
import { Calculate } from "@mui/icons-material";

function DashboardOperator() {
  const [pendingTare, setPendingTare] = useState(0);

  const [pendingGross, setPendingGross] = useState(0);

  const [completed, setCompleted] = useState(0);

  const [queued, setQueued] = useState(0);
  //   const [queue, setQueue] = useState(0);

  //   const [completed, setCompleted] = useState(0);

  //   const [registeredTrucks, setRegisteredTrucks] = useState(0);

  //   const [allUsers, setAllUsers] = useState(0);

  //   const [transporters, setTransporters] = useState(0);

  //   const [suppliers, setSuppliers] = useState(0);

  //   const [customers, setCustomers] = useState(0);

  //   const [companies, setCompanies] = useState(0);

  //   const navigate = useNavigate();

  //   const handleActiveCard = () => {
  //     navigate("/OperatorTransaction", { state: "Queued" });
  //   }

  //   const handleInactiveCard = () => {
  //     navigate("/OperatorTransactionComp", { state: "Completed" });
  //   }
  //   useEffect(() => {
  //     fetch("http://localhost:8080/api/v1/home/all-users")
  //       .then((response) => response.json())

  //       .then((data) => setAllUsers(data))

  //       .catch((error) => console.error("Error fetching all users:", error));

  //     fetch("http://localhost:8080/api/v1/home/active-users")
  //       .then((response) => response.json())

  //       .then((data) => setActiveUsers(data))

  //       .catch((error) => console.error("Error fetching active users:", error));

  //     fetch("http://localhost:8080/api/v1/home/inactive-users")
  //       .then((response) => response.json())

  //       .then((data) => setInactiveUsers(data))

  //       .catch((error) => console.error("Error fetching inactive users:", error));

  //     fetch("http://localhost:8080/api/v1/home/transporters")
  //       .then((response) => response.json())

  //       .then((data) => setTransporters(data))

  //       .catch((error) =>
  //         console.error("Error fetching registered trucks:", error)
  //       );

  //     fetch("http://localhost:8080/api/v1/home/companies")
  //       .then((response) => response.json())

  //       .then((data) => setCompanies(data))

  //       .catch((error) =>
  //         console.error("Error fetching registered companies:", error)
  //       );

  //     fetch("http://localhost:8080/api/v1/home/suppliers")
  //       .then((response) => response.json())

  //       .then((data) => setSuppliers(data))

  //       .catch((error) =>
  //         console.error("Error fetching registered suppliers:", error)
  //       );

  //     fetch("http://localhost:8080/api/v1/home/customers")
  //       .then((response) => response.json())

  //       .then((data) => setCustomers(data))

  //       .catch((error) =>
  //         console.error("Error fetching registered customers:", error)
  //       );

  //     fetch("http://localhost:8080/api/v1/home/vehicles")
  //       .then((response) => response.json())

  //       .then((data) => setRegisteredTrucks(data))

  //       .catch((error) =>
  //         console.error("Error fetching registered vehicles:", error)
  //       );
  //   }, []);

  const Calculation = () =>{

  }

  return (
    <SideBar5>
      <div className="operator-home-main-content">
        <h2 className="text-center">Operator Dashboard</h2>

        <div className="container-fluid mt-3">
          <div className="row operator-row justify-content-center">
            <div className="col-12 col-md-6 col-lg-5 mb-4">
              <Link
                className="col-lg-3 mb-4"
                to="/OperatorTransaction"
                style={{ textDecoration: "none" }}
              >
                <div className="card card-gradient-queued card-gradient">
                  <div className="card-body-home" >
                    <DashboardIcon style={{ fontSize: "4em" }} />
                    <h5 className="card-title-home" style={{marginTop:"2%"}}>Queued Transactions</h5>
                    <div className="queued-dtails">
                    <p className="card-text-home">{queued}</p>
                    </div>
                    {/* <p className="card-text-home">{allUsers}</p>{" "} */}
                    {/* Placeholder data */}
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-5 mb-4">
              <Link
                className="col-lg-3 mb-4"
                to="/OperatorTransactionComp"
                style={{ textDecoration: "none" }}
              >
                <div className="card card-gradient-completed card-gradient" >
                  <div className="card-body-home">
                    <DashboardIcon style={{ fontSize: "4em" }} />

                    <h5 className="card-title-home admin"  style={{marginTop:"2%"}}>
                      Completed Transactions
                    </h5>
                    <div className="Complete-details">
                    <p className="card-text-home">{completed}</p>
                    </div>

                    {/* <p className="card-text-home">{activeUsers}</p> */}
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-5 mb-4">
              <Link
                className="col-lg-3 mb-4"
                style={{ textDecoration: "none" }}
              >
                <div className="card card-gradient-outbound card-gradient">
                  <div className="card-body-home">
                    <FontAwesomeIcon icon={faTruck} size="3x" />

                    <h5 className="card-title-home admin">Outbound</h5>
                    <div className="outbound-details">
                    <p className="card-text-home">Pending Tare:{Calculation}</p>
                    <p className="card-text-home">Pending Gross:{Calculation}</p>
                    </div>

                    {/* <p className="card-text-home">{inactiveUsers}</p> */}
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-5 mb-4">
              <Link
                className="col-lg-3 mb-4"
                style={{ textDecoration: "none" }}
              >
                <div className="card card-gradient-inbound card-gradient" >
                  <div className="card-body-home">
                    <FontAwesomeIcon icon={faTruckMoving} size="3x" />
                    <h5 className="card-title-home admin">Inbound</h5>
                    <div className="inbound-details">
                    <p className="card-text-home">Pending Tare:{Calculation}</p>
                    <p className="card-text-home">Pending Gross:{Calculation}</p>
                    </div>
                    {/* <p className="card-text-home">{transporters}</p>{" "} */}
                    {/* Placeholder data */}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SideBar5>
  );
}

export default DashboardOperator;
