import TableForm from "./TableForm";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { createTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { createTables } from "../utils/api";

export default function NewTable() {
  const history = useHistory();

  let newTable = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState(newTable);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
        let form = {...formData, capacity: parseInt(formData.capacity)};
        await createTables(form, abortController.signal);
        history.push(`/dashboard`);
      }
    catch (error) {
      if(!errors[error.message])
      {
        setErrors(error);
    } }
  };

  return (
    <div>
      <div>
        {errors.message ? <ErrorAlert error={errors} /> : null}
      </div>
      <TableForm
        table={formData}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </div>
  );
}
