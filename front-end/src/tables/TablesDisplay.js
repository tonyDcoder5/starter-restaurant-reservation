import { useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { finishTable, listTables } from "../utils/api";


function TablesDisplay({ data }) {
  const history = useHistory(); 
  const [tables, setTables] = useState(data);

  const finishClickHandler = async (table) => {
    const abortController = new AbortController();
    if (
      window.confirm(
        `Is this table ready to seat new guests?`
      )) {
      await finishTable(table.table_id, abortController.signal);
      let update = await listTables(abortController.signal);
      setTables(update);
      history.push("/");
    }
    else{
      history.push("/");
    }
  }


  function tableDisplay(tables){
    let arr = [...tables]; 

    return arr.map((line, index) => {
      return (
        <tr key={line.table_id}>
          <td>{line.table_id}</td>
          <td>{line.table_name}</td>
          <td>{line.capacity}</td>
          <td data-table-id-status={line.table_id}>
            {line.reservation_id ? "Occupied" : "Free"}
          </td>
          <td>
            {line.reservation_id && 
            <button
              data-table-id-finish={line.table_id}
              className="btn btn-danger"
              onClick={()=>{
                finishClickHandler(line);
              }}
            >
              Finish
            </button>}
          </td>
        </tr>
      );
    })}

  

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
              <th>Finished?</th>
            </tr>
          </thead>
          <tbody>{tables ? tableDisplay(data) : tableDisplay(tables)}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default TablesDisplay;
