import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ResTableDisplay from "../reservations/ResTableDisplay";
import ErrorAlert from "../layout/ErrorAlert";
import { searchReservations } from "../utils/api";

function SearchPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState({mobile_number: ''});
  const [error, setError] = useState(null);

  const handleChange = (event) =>
    setSearch({ [event.target.name]: event.target.value });

  const submitHandler = async (event) => {
    setError(null);
    setReservations([])
    event.preventDefault();
    const abortController = new AbortController();
    try {
      let result = await searchReservations(search, abortController.signal);
      if(result.length !== 0){
      setReservations(result);
    }
    else{
        setError({message: `No reservations found`})
    }
    } catch (err) {
      if (!error[error.message]) {
        setError(err);
      }
    }
  };

  return (
    <div className="container mt-3 ml-3">
      <h2 className="mt-4">Search Reservation</h2>
      <div>{error ? <ErrorAlert error={error} /> : null}</div>
      <div className="mb-3">
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>
              <h4>Enter mobile number: </h4>
            </Form.Label>
            <div className="row ml-1">
              <Form.Control
                type="input"
                placeholder="Enter a customer's phone number"
                required={true}
                name="mobile_number"
                value={search.mobile_number}
                onChange={handleChange}
                className="col-8"
              />
              <Button type="submit" className="btn btn-primary col-2 ml-4">
                Find
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
      <div className="mt-5">
        <ResTableDisplay data={reservations} />
      </div>
    </div>
  );
}

export default SearchPage;
