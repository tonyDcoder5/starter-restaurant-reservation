import ReservationForm from "./ReservationForm";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createReservations } from "../utils/api";

export default function NewReservation() {
  const history = useHistory();

  let newReserv = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState(newReserv);
  const [viewErrors, setViewErrors] = useState(false);

  const handleChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const verifyRes = () => {

  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        verifyRes(formData);
        await createReservations(formData, abortController.signal);
        history.push(`/dashboard`);
      }
    catch (error) {
      setViewErrors(true);
      console.log(error.message);
      return error;
    }
  };

  return (
    <div>
      {viewErrors && <>
      <div className="alert alert-danger">
        <h4>Please try again, received following errors</h4>
        <ul>
          
        </ul>
      </div>
      </>}
      <ReservationForm
        res={formData}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
