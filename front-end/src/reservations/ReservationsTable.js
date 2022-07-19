import { Table } from "react-bootstrap";
import { formatAsDate, formatAsTime } from "../utils/date-time";

function ReservationsTable({ data }) {
  let table = data.map((line, index) => {
    return (
      <tr>
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
  );
}

/*
<>
        <div key={index} className='col'>
        <p>{line.reservation_id}</p>
        </div>
        <div className='col'>
        <p>{line.reservation_date}</p>
        </div>
        <div className='col'>
        <p>{line.reservation_time}</p>
        </div>
        <div className='col'>
        <p>{line.last_name}</p>
        </div>
        <div className='col'>
        <p>{line.first_name}</p></div>
        <div className='col'>
        <p>{line.mobile_number}</p></div>
        <div className='col'>
        <p>{line.people}</p>   
        </div>
</>
*/

export default ReservationsTable;
