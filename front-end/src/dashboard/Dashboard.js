import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";
import { formatAsDate, next, previous, today } from "../utils/date-time";
import ReservationsTable from "../reservations/ReservationsTable";
import TablesDisplay from "../tables/TablesDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // listTables({ date }, abortController.signal)
    //   .then(setTables)
    //   .catch(setTablesError);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <ErrorAlert error={reservationsError || tablesError} />
      </div>
      <div className="container row">
        <div className="row">
          <TablesDisplay data={tables} date={date} />
        </div>
        <div className="row mt-5">
          <ReservationsTable data={reservations} date={date} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
