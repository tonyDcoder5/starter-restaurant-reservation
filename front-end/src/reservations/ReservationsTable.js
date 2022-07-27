import {
  formatAsDate,
  next,
  previous,
  today,
} from "../utils/date-time";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import ResTableDisplay from "./ResTableDisplay";

function ReservationsTable({ data, date }) {
  const history = useHistory();
  const currentDate = formatAsDate(today());
  const [reservations, setReservations] = useState(data);

  useEffect(()=>{
    setReservations(data);
  }, [data]);

  return (
    <div className="reservations-display">
      <div className="container">
        <h4 className="mb-0">
          Reservations for date <span>{date}</span>
        </h4>
        <button
          className="btn btn-secondary m-1"
          onClick={() => {
            history.push(`/dashboard?date=${previous(date)}`);
          }}
        >
          Yesterday
        </button>
        <button
          className="btn btn-success m-1"
          onClick={() => {
            history.push(`/dashboard?date=${currentDate}`);
          }}
        >
          {" "}
          Today{" "}
        </button>
        <button
          className="btn btn-primary m-1"
          onClick={() => {
            history.push(`/dashboard?date=${next(date)}`);
          }}
        >
          Tomorrow
        </button>
      </div>
      <div className="container">

        <ResTableDisplay data={data || reservations} />

      </div>
    </div>
  );
}

export default ReservationsTable;
