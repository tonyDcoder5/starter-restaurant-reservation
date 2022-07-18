import {Table} from 'react-bootstrap';

function ReservationsTable({data}){

    let table = data.map((line, index)=>{
      return(
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
      )
    })

    return (
        <div className='table'>
            <div className='row'>
                <span>
                    <p>Headers</p>
                </span>
            </div>
            <div className='tbody'>
            {table}
            </div>
        </div>
      );
  }

export default ReservationsTable;