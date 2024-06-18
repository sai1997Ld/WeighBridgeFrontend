import { useState, useEffect } from "react";

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

import "./HomePage1.css";

import SideBar from "../SideBar/SideBar";

import { Link, useNavigate } from "react-router-dom";

function HomePage1Component() {
  const [activeUsers, setActiveUsers] = useState(0);

  const [inactiveUsers, setInactiveUsers] = useState(0);

  const [registeredTrucks, setRegisteredTrucks] = useState(0);

  const [allUsers, setAllUsers] = useState(0);

  const [transporters, setTransporters] = useState(0);

  const [suppliers, setSuppliers] = useState(0);

  const [customers, setCustomers] = useState(0);

  const [companies, setCompanies] = useState(0);

  const navigate = useNavigate();

  const handleActiveCard = () => {
    navigate("/manage-user", { state: "ACTIVE" });
  };

  const handleInactiveCard = () => {
    navigate("/manage-user", { state: "INACTIVE" });
  };
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/home/all-users")
      .then((response) => response.json())

      .then((data) => setAllUsers(data))

      .catch((error) => console.error("Error fetching all users:", error));

    // Fetch active users

    fetch("http://localhost:8080/api/v1/home/active-users")
      .then((response) => response.json())

      .then((data) => setActiveUsers(data))

      .catch((error) => console.error("Error fetching active users:", error));

    // Fetch inactive users

    fetch("http://localhost:8080/api/v1/home/inactive-users")
      .then((response) => response.json())

      .then((data) => setInactiveUsers(data))

      .catch((error) => console.error("Error fetching inactive users:", error));

    // Fetch registered trucks

    fetch("http://localhost:8080/api/v1/home/transporters")
      .then((response) => response.json())

      .then((data) => setTransporters(data))

      .catch((error) =>
        console.error("Error fetching registered trucks:", error)
      );

    // Fetch registered companies

    fetch("http://localhost:8080/api/v1/home/companies")
      .then((response) => response.json())

      .then((data) => setCompanies(data))

      .catch((error) =>
        console.error("Error fetching registered companies:", error)
      );

    // Fetch registered suppliers

    fetch("http://localhost:8080/api/v1/home/suppliers")
      .then((response) => response.json())

      .then((data) => setSuppliers(data))

      .catch((error) =>
        console.error("Error fetching registered suppliers:", error)
      );

    // Fetch registered customers

    fetch("http://localhost:8080/api/v1/home/customers")
      .then((response) => response.json())

      .then((data) => setCustomers(data))

      .catch((error) =>
        console.error("Error fetching registered customers:", error)
      );

    // Fetch registered vehicles

    fetch("http://localhost:8080/api/v1/home/vehicles")
      .then((response) => response.json())

      .then((data) => setRegisteredTrucks(data))

      .catch((error) =>
        console.error("Error fetching registered vehicles:", error)
      );
  }, []);

  return (
    <SideBar>
      <div className="admin-home-main-content">
        <h2 className="text-center">Admin Dashboard</h2>

        <div className="container-fluid mt-3">
          <div className="row admin-row">
            <Link
              className="col-md-3 mb-4"
              to="/manage-user"
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-all-users card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faUser} size="3x" />
                  <h5 className="card-title-home">Total Users</h5>
                  <p className="card-text-home">{allUsers}</p>{" "}
                  {/* Placeholder data */}
                </div>
              </div>
            </Link>

            <div
              className="col-md-3 mb-4"
              onClick={handleActiveCard}
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-active card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faUsers} size="3x" />

                  <h5 className="card-title-home admin">Active Users</h5>

                  <p className="card-text-home">{activeUsers}</p>
                </div>
              </div>
            </div>

            <div
              className="col-md-3 mb-4"
              onClick={handleInactiveCard}
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-inactive card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faUsersSlash} size="3x" />

                  <h5 className="card-title-home admin">Inactive Users</h5>

                  <p className="card-text-home">{inactiveUsers}</p>
                </div>
              </div>
            </div>

            <Link
              className="col-md-3 mb-4"
              to="/view-transporter"
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-transporters card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faTruckMoving} size="3x" />
                  <h5 className="card-title-home admin">Transporters</h5>
                  <p className="card-text-home">{transporters}</p>{" "}
                  {/* Placeholder data */}
                </div>
              </div>
            </Link>

            <Link
              className="col-md-3 mb-4"
              to="/view-vehicle"
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-registered card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faTruck} size="3x" />

                  <h5 className="card-title-home admin">Vehicles</h5>

                  <p className="card-text-home">{registeredTrucks}</p>
                </div>
              </div>
            </Link>

            <Link
              className="col-md-3 mb-4"
              to="/view-company"
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-companies card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faBuilding} size="3x" />
                  <h5 className="card-title-home admin">Companies</h5>
                  <p className="card-text-home">{companies}</p>{" "}
                  {/* Placeholder data */}
                </div>
              </div>
            </Link>

            <Link
              className="col-md-3 mb-4"
              to="/view-supplier"
              style={{ textDecoration: "none" }}
            >
              <div className="card card-gradient-suppliers card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faUserTie} size="3x" />
                  <h5 className="card-title-home admin">Suppliers</h5>
                  <p className="card-text-home">{suppliers}</p>{" "}
                  {/* Placeholder data */}
                </div>
              </div>
            </Link>

            <Link
              className="col-md-3 mb-4"
              style={{ textDecoration: "none" }}
              to="/view-customer"
            >
              <div className="card card-gradient-customers card-gradient">
                <div className="card-body-home">
                  <FontAwesomeIcon icon={faUserFriends} size="3x" />
                  <h5 className="card-title-home admin">Customers</h5>
                  <p className="card-text-home">{customers}</p>{" "}
                  {/* Placeholder data */}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default HomePage1Component;
