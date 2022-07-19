import { Table } from "react-bootstrap";
import {
  formatAsDate,
  formatAsTime,
  next,
  previous,
  today,
} from "../utils/date-time";
import { useHistory } from "react-router";

function ReservationsTable({ data, date }) {
  const history = useHistory();
  const currentDate = formatAsDate(today());

  let table = data.map((line, index) => {
    return (
      <tr key={index}>
        <td>{line.reservation_id}</td>
        <td>{line.first_name}</td>
        <td>{line.last_name}</td>
        <td>{formatAsDate(line.reservation_date)}</td>
        <td>{formatAsTime(line.reservation_time)}</td>
        <td>{line.mobile_number}</td>
      </tr>
    );
  });

  return (
    <div className="reservations-display">
      <div className="container">
        <h4 className="mb-0">
          Reservations for date <span>{date}</span></h4>
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
              <th>Mobile Number</th>
            </tr>
          </thead>
          <tbody>{table}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default ReservationsTable;
