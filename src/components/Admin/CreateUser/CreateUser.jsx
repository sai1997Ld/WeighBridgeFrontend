import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faSave, faHome } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Select from "react-select";
import "./CreateUser.css";
import SideBar from "../../SideBar/SideBar";
import { Link } from "react-router-dom";

function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState([]);
  const [emailId, setEmailId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [company, setCompany] = useState("");
  const [site, setSite] = useState("");
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("http://172.16.20.161:8080/api/v1/company/names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Company List:", data);
        setCompanies(data);
      })
      .catch((error) => {
        console.error("Error fetching company list:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://172.16.20.161:8080/api/v1/roles/get/all/role")
      .then((response) => response.json())
      .then((data) => {
        console.log("Roles List:", data);
        setRoles(data.map((r) => ({ value: r, label: r })));
      })
      .catch((error) => {
        console.error("Error fetching roles list:", error);
      });
  }, []);

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);

    fetch(`http://172.16.20.161:8080/api/v1/sites/company/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Site List:", data);
        const formattedSites = data.map((site) => ({
          site: `${site.siteName}, ${site.siteAddress}`,
        }));
        setSites(formattedSites);
      })
      .catch((error) => {
        console.error("Error fetching site list:", error);
      });
  };

  const handleClear = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setRole([]);
    setEmailId("");
    setContactNo("");
    setCompany("");
    setSite("");
    setEmailError("");
    setContactNoError("");
  };

  const handleSave = () => {
    let emailIsValid = true;
    let phoneIsValid = true;

    if (
      role.length === 0 ||
      company.trim() === "" ||
      site.trim() === "" ||
      contactNo.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      emailId.trim() === ""
    ) {
      Swal.fire({
        title: "Please fill in all the required fields.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setEmailError("Please enter a valid email address.");
      emailIsValid = false;
    } else {
      setEmailError("");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNo)) {
      setContactNoError("Please enter a valid 10-digit phone number.");
      phoneIsValid = false;
    } else {
      setContactNoError("");
    }

    if (!emailIsValid || !phoneIsValid) {
      return;
    }

    const userData = {
      firstName,
      middleName,
      lastName,
      site,
      company,
      emailId,
      contactNo,
      role: role.map((r) => r.value),
    };

    setIsLoading(true);

    console.log("Payload sent to the API:", userData);

    fetch("http://172.16.20.161:8080/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then(async (response) => {
        if (response.ok) {
          return response.text(); // Assume the success response is text
        } else {
          const error = await response.json();
          throw new Error(error.message);
        }
      })
      .then((data) => {
        console.log("Response from the API:", data);
        Swal.fire({
          title: data,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        handleClear();
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SideBar>
      <div className="create-user">
        <div className="create-main-content container-fluid">
          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-center mx-auto">Create User</h2>
              <Link to={"/home1"}>
              <FontAwesomeIcon icon={faHome} style={{float: "right", fontSize: "1.5em"}}  className="mb-3"/>
              </Link>
            </div>
              <div className="create-user-container">
                <div className="card create-user-form" style={{boxShadow:"0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"}}>
                  <div
                    className="card-body p-4"
                    //
                  >
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label htmlFor="firstName" className="form-label">
                            First Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="middleName" className="form-label">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="middleName"
                            placeholder="Enter Middle Name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="lastName" className="form-label">
                            Last Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="emailId" className="form-label">
                            Email Id
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${
                              emailError ? "is-invalid" : ""
                            }`}
                            id="emailId"
                            placeholder="Enter email address"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                          />
                          {emailError && (
                            <div className="invalid-feedback">{emailError}</div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="contactNo" className="form-label">
                            Mobile Number
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="tel"
                            className={`form-control ${
                              contactNoError ? "is-invalid" : ""
                            }`}
                            id="contactNo"
                            placeholder="Enter Mobile Number"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            required
                            pattern="\d{10}"
                            onInput={(e) =>
                              (e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              ))
                            }
                            title="Please enter 10 numbers"
                            maxLength="10"
                          />
                          {contactNoError && (
                            <div className="invalid-feedback">
                              {contactNoError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="company" className="form-label">
                            Company Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>
                          <select
                            className="form-select"
                            id="company"
                            value={company}
                            onChange={handleCompanyChange}
                            required
                          >
                            <option value="">Select Company Name</option>
                            {companies.map((c, index) => (
                              <option key={index} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="site" className="form-label">
                            Site Name
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>
                          <select
                            className="form-select"
                            id="site"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                            required
                          >
                            <option value="">Select Site Name</option>
                            {sites.map((s, index) => (
                              <option key={index} value={s.site}>
                                {s.site}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="role" className="form-label">
                            Role
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {" "}
                              *
                            </span>
                          </label>

                          <Select
                            isMulti
                            value={role}
                            onChange={(selectedOptions) =>
                              setRole(selectedOptions)
                            }
                            options={roles}
                            isSearchable
                            placeholder="Select Role"
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button
                          type="button"
                          className="btn btn-danger me-4 btn-hover"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            border: "1px solid #cccccc",
                            width: "100px",
                          }}
                          onClick={handleClear}
                        >
                          <FontAwesomeIcon icon={faEraser} className="me-1" />
                          Clear
                        </button>
                        <button
                          type="button"
                          className="btn btn-success-1 btn-hover"
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            border: "1px solid #cccccc",
                            width: "100px",
                          }}
                          onClick={handleSave}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SideBar>
  );
}

export default CreateUser;
