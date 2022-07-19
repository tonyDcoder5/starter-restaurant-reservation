import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function TableForm({ table, handleChange, submitHandler }) {
  const history = useHistory();

  return (
    <div className="container mt-3 ml-3">
      <h2 className="mt-4">New Table</h2>
      <div className="m-2">
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="table_name" className="mt-3">
            <Form.Label>Table Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter table name"
              required={true}
              minLength="2"
              name="table_name"
              id="table_name"
              value={table.table_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="capacity" className="mt-3">
            <Form.Label>Table Capcity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Table capacity"
              required={true}
              className="form-control"
              min={1}
              name="capacity"
              id="capacity"
              value={table.capacity}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="mt-3">
            <Button
              variant="secondary"
              className="mr-3"
              onClick={() => {
                history.goBack();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default TableForm;