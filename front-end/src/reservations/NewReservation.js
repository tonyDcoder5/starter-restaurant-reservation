import ReservationForm from "./ReservationForm"
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createReservations } from "../utils/api";

export const NewReservation = ({resList, setResList}) => {

    const history = useHistory();

    let newReserv = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "0",
    }

    const [formData, setFormData] = useState(newReserv);

    const handleChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      const newRes = await createReservations(formData, abortController.signal);
      console.log(newRes);
    //   setResList([...resList, newRes]);
      history.push(`/dashboard`);
    } catch (error) {
      console.log(error.message);
    }
  };

    return(
        <div>
            <ReservationForm 
            res={formData} submitHandler={submitHandler} handleChange={handleChange} />
        </div>
    )
}