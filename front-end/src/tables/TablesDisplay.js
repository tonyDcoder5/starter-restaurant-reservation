import { Table } from "react-bootstrap";


function TablesDisplay({ data }) {

  let table = data.map((line, index) => {
    return (
      <tr key={index}>
        <td>{line.table_id}</td>
        <td>{line.table_name}</td>
        <td>{line.capacity}</td>
        <td data-table-id-status={line.table_id}>
          {line.reservation_id ? "Occupied" : "Free"}
        </td>
      </tr>
    );
  });

  return (
    <div className="tables-display">
      <div className="container ml-3">
        <h2>Tables</h2>
        <Table striped>
          <thead>
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
