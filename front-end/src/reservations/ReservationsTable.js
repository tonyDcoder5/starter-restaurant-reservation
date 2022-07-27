import { Table } from "react-bootstrap";
import {
  formatAsDate,
  formatAsTime,
  next,
  previous,
  today,
} from "../utils/date-time";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ReservationsTable({ data, date }) {
  const history = useHistory();
  const currentDate = formatAsDate(today());
  const [reservations, setReservations] = useState(data);

  const resDisplay = (data) => {
    let arr = [...data];
   
    return arr.map((line, index) => {
    return (
      <tr key={index}>
        <td>{line.reservation_id}</td>
        <td>{line.first_name}</td>
        <td>{line.last_name}</td>
        <td>{formatAsDate(line.reservation_date)}</td>
        <td>{formatAsTime(line.reservation_time)}</td>
        {line.status !== "finished" && 
        <td data-reservation-id-status={line.reservation_id}>{line.status}</td>}
        
        <td>{line.mobile_number}</td>
        
        {line.status === "booked" && 
        <td>
          <Link
            className="btn btn-success"
            to={`/reservations/${line.reservation_id}/seat`}
          >
            Seat
          </Link>
        </td>}
      </tr>
    );
  });}

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
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Reservation Date</th>
              <th>Reservation Time</th>
              <th>Status</th>
              <th>Mobile Number</th>
              <th>Party Here?</th>
            </tr>
          </thead>
          <tbody>{reservations ? resDisplay(data) : resDisplay(reservations)}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default ReservationsTable;
