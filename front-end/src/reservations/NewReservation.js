import ReservationForm from "./ReservationForm";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

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

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        let form = {...formData, people: parseInt(formData.people)};
        let date = form.reservation_date;
        await createReservations(form, abortController.signal);
        history.push(`/dashboard?date=${date}`);
      }
    catch (error) {
      if(!errors[error.message])
      {
        setErrors(error);
    } }
  };

  return (
    <div>
      <div className="mt-3 container">
        <h2>Create Reservation</h2>
        {errors.message ? <ErrorAlert error={errors} /> : null}
      </div>
      <ReservationForm
        res={formData}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
