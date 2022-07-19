import { Table } from "react-bootstrap";
import {
  formatAsDate,
  next,
  previous,
  today,
} from "../utils/date-time";
import { useHistory } from "react-router";

function TablesDisplay({ data, date }) {
  const history = useHistory();
  const currentDate = formatAsDate(today());

  let table = data.map((line, index) => {
    return (
      <tr key={index}>
        <td>{line.table_name}</td>
        <td>{line.capacity}</td>
        <td>{line.reservation_status}</td>
        
      </tr>
    );
  });

  return (
    <div className="tables-display">
      <div className="container ml-3">
        <Table striped>
          <thead>
            <h2>Tables</h2>
            <tr>
              <th></th>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Status</th>
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

export default TablesDisplay;
