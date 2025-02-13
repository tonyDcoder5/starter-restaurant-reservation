import {useHistory} from "react-router-dom";

function ReservationForm({ res, handleChange, submitHandler }) {
  const history = useHistory();
 
  return (
    <div className="container mt-3 mb-5">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <div className="row mt-2">
            <div className="col">
              <label>First Name</label>
              <input
                required={true}
                className="form-control"
                type="text"
                name="first_name"
                id="first_name"
                placeholder="Enter First Name"
                value={res.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label>Last Name</label>
              <input
                className="form-control"
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Enter Last Name"
                value={res.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              <label>Mobile Number</label>
              <input
                required={true}
                className="form-control"
                type="text"
                name="mobile_number"
                id="mobile_number"
                placeholder="Enter Mobile Number"
                value={res.mobile_number}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-4">
              <label>Date of Reservation</label>
              <input
                required={true}
                className="form-control"
                type="date"
                placeholder="YYYY-MM-DD" 
                pattern="\d{4}-\d{2}-\d{2}"
                name="reservation_date"
                id="reservation_date"
                value={res.reservation_date}
                onChange={handleChange}
              />
            </div>
            <div className="col-4">
              <label>Time of Reservation</label>
              <input
                required={true}
                className="form-control"
                type="time"
                placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}"
                name="reservation_time"
                id="reservation_time"
                value={res.reservation_time}
                onChange={handleChange}
              />
            </div>
            <div className="col-3">
              <label>Size of Party</label>
              <input
                required={true}
                className="form-control"
                min= {1}
                type="number"
                name="people"
                id="people"
                placeholder="Enter # in Party"
                value={res.people}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <button 
              className="btn btn-secondary" onClick={()=> {history.goBack()}}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary ml-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
