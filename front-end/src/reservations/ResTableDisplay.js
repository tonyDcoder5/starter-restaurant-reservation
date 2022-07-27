import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {formatAsTime, formatAsDate} from "../utils/date-time";


function ResTableDisplay({data}) {

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
            <td data-reservation-id-status={line.reservation_id}>
              {line.status}
            </td>
          <td>{line.mobile_number}</td>

          {line.status === "booked" && (
            <td>
              <Link
                className="btn btn-success"
                to={`/reservations/${line.reservation_id}/seat`}
              >
                Seat
              </Link>
            </td>
          )}
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
          <th>Party Here?</th>
        </tr>
      </thead>
      <tbody>
        {data ? resDisplay(data) : "No reservations found"}
      </tbody>
    </Table>
  );
}

export default ResTableDisplay;
