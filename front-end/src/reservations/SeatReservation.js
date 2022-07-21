import { useHistory, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { listTables, readReservation, readTable, seatTable } from "../utils/api";
import { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState({});
  const [err, setError] = useState(null);
  const history = useHistory();
  const abortController = new AbortController();


  const loadPage = (id) => {
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    readReservation(id, abortController.signal).then(setReservation).catch(setError);

    return () => abortController.abort();
  };

  useEffect(() => {
    loadPage(reservation_id);
  }, [reservation_id]);

  const handleChange = async (event) =>
  {
    const id = event.target.value;
    const data = await readTable(id, abortController.signal);
    setTable(data);
    console.log(table, reservation);
    return table;

  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      if(table.capcity >= reservation.people){
      await seatTable(table, reservation, abortController.signal);
      history.push(`/dashboard`);
    }
    } catch (error) {
      setError(error);
    }
  };

  if (Object.keys(reservation).length && tables.length) {
    return (
      <div className="container mt-3 ml-3">
        <h2 className="mt-4">Seat Reservation</h2>
        <ErrorAlert error={err} />
        <h4>Seating reservation ID# {reservation && reservation.reservation_id}</h4>
        <p>{reservation.last_name}, {reservation.first_name} - {reservation.mobile_number}</p>
        <p>Party size: {reservation.people}</p>
        <div className="m-2">
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="table_id" className="select-form mt-3 mb-5">
              <Form.Label>Table number</Form.Label>
              <Form.Select
                size="sm"
                className="ml-3 table-select"
                onChange={handleChange}
              >
                <option>Please select an available table</option>
                {tables.length > 0 &&
                  tables.map((table, index) => {
                    return (
                      <option key={index} value={table.table_id}>
                        {table.table_name} - {table.capacity}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>
            <div className="mt-3">
              <Button
                variant="secondary"
                className="mr-3"
                onClick={() => {
                  history.goBack();
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}

export default SeatReservation;
