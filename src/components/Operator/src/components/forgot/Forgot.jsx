import React from "react";
import "./forgot.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Forgot = () => {

    const navigate=useNavigate();
    const backToLogin = () =>{
        navigate('/login');
    }
  return (
    <div className="forgot_main_div container-fluid w-100">
      <br />
      <br />
      <h1 className="text-center">Weighbridge Management System</h1>
      <br />
      <h3 className="text-center">Forgot Password</h3>
      <br />
      <p className="text-center">
        Enter your email and we'll send you a link to reset you password.
      </p>
      <br />
      <div className="forgot_in">
        <div className="box">
          <div className="eicon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <input type="email" className="w-50" id="emaill" required />
        </div>
        <span>
            <p className="a1" onClick={backToLogin}>
              &lt; Back to Login
            </p>
          </span>
        <div className="mb-3 submit_btn">
          <button type="submit" className="btn btn-dark  w-50">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
