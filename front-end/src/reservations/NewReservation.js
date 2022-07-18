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
  const [errors, setErrors] = useState([]);

  const handleChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const errorHandler = async () => {
    
    return(
      <div className="alert alert-danger">
        <p>Please try again, following errors occured:</p>
        <ul>
        {errors.map((error)=>{
          return <li>{error}</li>
        })}
        </ul>
      </div>
    )
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        await createReservations(formData, abortController.signal);
        history.push(`/dashboard`);
      }
    catch (error) {
      setErrors(error); }
  };

  return (
    <div>
      {errors.length > 0 && 
      errorHandler()
      }
      <ReservationForm
        res={formData}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
