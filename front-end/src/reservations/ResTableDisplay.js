import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";
import { formatAsTime, formatAsDate } from "../utils/date-time";

function ResTableDisplay({ data }) {

  const history = useHistory();
  const [reservations, setReservations] = useState(data)

  const cancelHandler = async (data) => {
    const abortController = new AbortController();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )) {
      await cancelReservation(data, abortController.signal);
      history.go(0);
    }
    else{
      
    }
  }

  const resDisplay = (data) => {
    let arr = [...data];

    return arr.map((line) => {
      return (
        <tr key={line.reservation_id}>
          <td>{line.reservation_id}</td>
          <td>{line.first_name}</td>
          <td>{line.last_name}</td>
          <td>{formatAsDate(line.reservation_date)}</td>
          <td>{formatAsTime(line.reservation_time)}</td>
          <td data-reservation-id-status={line.reservation_id}>
            {line.status}
          </td>
          <td>{line.mobile_number}</td>
          <td>
            <Button
              className="btn btn-warning"
              onClick={()=> history.go(`/reservations/${line.reservation_id}/edit`)}
              href={`/reservations/${line.reservation_id}/edit`}
            >
              Edit
            </Button>
          </td>
          <td>
            <Button
              className="btn btn-danger"
              onClick={()=> cancelHandler(line)}
              data-reservation-id-cancel={line.reservation_id}
            >
              Cancel
            </Button>
          </td>
          {line.status === "booked" ? (
            <td>
              <Link
                className="btn btn-success"
                to={`/reservations/${line.reservation_id}/seat`}
              >
                Seat
              </Link>
            </td>
          ) : null}
        </tr>
      );
    });
  };

  return (
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
          <th>Edit Reservation</th> 
          <th>Cancel Reservation</th>   
          <th>Party Here?</th>
        </tr>
      </thead>
      <tbody>{reservations ? resDisplay(data) : resDisplay(reservations)}</tbody>
    </Table>
  );
}

export default ResTableDisplay;
