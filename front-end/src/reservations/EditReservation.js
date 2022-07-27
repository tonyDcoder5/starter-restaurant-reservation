import ReservationForm from "./ReservationForm";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation() {
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({})
    const [update, setUpdate] = useState({});
    const [err, setError] = useState(null);
    const history = useHistory();
    const abortController = new AbortController();
  
    const loadPage = (id) => {
      setError(null);
      readReservation(id, abortController.signal)
        .then(setReservation)
        .catch(setError);
      return () => abortController.abort();
    };

    useEffect(() => {
        loadPage(reservation_id);
      }, [reservation_id]);
  
  const handleChange = (event) =>
    setUpdate({ ...reservation, [event.target.name]: event.target.value });

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        update = {...update, people: parseInt(update.people)};
        await editReservation(update, abortController.signal);
        history.goBack();
      }
    catch (error) {
        setError(error); }
  };

  return (
    <div>
      <div className="container">
        <h2>Edit Reservation</h2>
        {/* {err.message ? <ErrorAlert error={err} /> : null} */}
      </div>
      <ReservationForm
        res={reservation}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
