import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";
import { next, previous } from "../utils/date-time";
import ReservationsTable from "../reservations/ReservationsTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="container">
        <div className="row">
          <button className="btn btn-default" onClick={()=>{
            history.push(`/dashboard?date=${previous(date)}`)
          }}>Yesterday</button>
          <p>{date}</p>
          <button className="btn btn-primary" onClick={()=>{
            history.push(`/dashboard?date=${next(date)}`)
          }}>Tomorrow</button>
        </div>
        <ReservationsTable data={reservations} />
      </div>
    </main>
  );
}

export default Dashboard;
