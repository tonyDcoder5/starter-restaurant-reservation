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
        <td>{line.table_id}</td>
        <td>{line.table_name}</td>
        <td>{line.capacity}</td>
        <td data-table-id-status={line.table_id} >{line.status === "seated" ? "Occupied" : "Free"}</td>
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
              <th>Table ID</th>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{table}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default TablesDisplay;
