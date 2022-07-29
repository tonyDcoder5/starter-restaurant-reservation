# Restaurant Reservations Fullstack Web Application

## Completed fullstack mono-repo for the Thinkful Engineering Immersion Final Capstone project

### Installation  
See [./README.md](./README.md) for detailed instructions.

### Dashboard
Dashboard displays two tables: 
1. Tables data from backend database (all created table names with capacity and their status: Free or occupied)
2. Reservations data from database for current date query (default to today, all reservations from database matching date parameter)
![Dashboard](/final_screenshots/dashboard_initial.png)


### API ENDPOINTS/Routes  

#### US-01 Create and list reservations

![New Reservation Form](/final_screenshots/new_reservation_form_1.png)

![Dashboard - New Reservations](/final_screenshots/dashboard_view_1.png)

#### US-02 Create reservation on a future, working date
- Cannot create reservation in the past
![New Reservation Form Error-1](/final_screenshots/new_reservation_form_2_error.png)


- Cannot create reservation on Tuesday (closed on tuesdays)
![New Reservation Form Error-2](/final_screenshots/new_reservation_form_3_error.png)

#### US-03 Create reservation within eligible timeframe
- Cannot create reservation outside of business hours 10:30-21:30
![New Reservation Form Error-3](/final_screenshots/new_reservation_form_4_error.png)

#### US-04 Seat reservation
- Click on reservation seat button to navigate to Seat Reservation page
![Seat Reservation Form -1](/final_screenshots/seat_reservation_1.png)

- Select table from list of tables from database 
![Seat Reservation Form -2](/final_screenshots/seat_reservation_select.png)

- must have sufficient capacity to seat reservation
![Seat Reservation Form -3](/final_screenshots/seat_reservation_error.png)


#### US-05 Finish an occupied table
- Finish button shows window message to confirm finish action, cancel makes no changes
![Finish Reservation](/final_screenshots/dashboard_finish_1.png)


#### US-06 Reservation Status
- reservation table shows status booked or seated for reservations depending on current status
![Reservation Statuses](/final_screenshots/dashboard_statuses.png)


#### US-07 Search for a reservation by phone number
- search page allows user to search reservations (regardless of status) database by mobile number
![Search Reservations](/final_screenshots/search_res_1.png)

![Search Reservations -2](/final_screenshots/search_res_2.png)


#### US-08 Change an existing reservation
- Edit an existing reservation by clicking on the edit button 
![Edit Reservations -1](/final_screenshots/edit_reservation_form.png)


TODO: 
- add additional styling to make more personalized 
- add logic to allow for same day reservations 
- optimize time & space complexity of API functions 