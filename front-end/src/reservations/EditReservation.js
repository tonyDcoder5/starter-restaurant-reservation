import ReservationForm from "./ReservationForm";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

export default function EditReservation() {
  let initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  
  const { reservation_id } = useParams();
  let [reservation, setReservation] = useState(initialForm);
  const [err, setError] = useState(null);
  const history = useHistory();
  const abortController = new AbortController();

  const loadPage = async (id) => {
    setError(null);
    try{
      let data = await readReservation(id, abortController.signal);
      setReservation(data);
    }
    catch(error){
      setError(error);
    }
    return () => abortController.abort();
  };

  useEffect(() => {
    loadPage(reservation_id);
  }, [reservation_id, err]);

  const handleChange = (event) =>
    setReservation({ ...reservation, [event.target.name]: event.target.value });

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      reservation["reservation_date"] = reservation.reservation_date.split("T")[0];
      let update = { ...reservation, people: parseInt(reservation.people) };
      await editReservation(update, abortController.signal);
      history.push(`/dashboard?date=${update.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <div className="container">
        <h2>Edit Reservation</h2>
        {err?.message ? <ErrorAlert error={err} /> : null}
      </div>
      <ReservationForm
        res={reservation}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
