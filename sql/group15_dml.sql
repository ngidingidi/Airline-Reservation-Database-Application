/*
CS340 Group 15
CRUD operations for Airline Reservation System Project
By Sicelo Masango and Ivan Thieu

*/

-- Get all Customer IDs and Names to populate Flight Bookings dropdown
SELECT Customers.customer_id, CONCAT(Customers.first_name, " ", Customers.last_name) AS "Customer Name" FROM Customers;

--Select Bookings associated to Flights and Customers
SELECT Bookings.booking_id, Bookings.customer_id, Customers.first_name, 
       Customers.last_name, Bookings.booking_price, Bookings.booking_date, 
       Flights.flight_id, Flights.departure_city, Flights.arrival_city
FROM Bookings
LEFT JOIN Tickets ON Tickets.booking_id = Bookings.booking_id
LEFT JOIN Flights ON Tickets.flight_id = Flights.flight_id
LEFT JOIN Customers ON Bookings.customer_id = Customers.customer_id;

-- Insert Booking details for Add New Booking button
INSERT INTO Bookings
(
    customer_id,
    booking_price,
    booking_date
)
VALUES
(
    :customer_id_from_dropdown,
    :booking_price_from_user_input,
    :booking_date_from_user_input
);

-- Associate a flight with the booking. Query for booking_id and flight_id already defined
INSERT INTO Tickets
(
    booking_id,
    flight_id
)
VALUES
(
    :booking_id_from_dropdown,
    :flight_id_from_dropdown
);

-- Update Booking date
UPDATE Bookings
SET booking_date = :booking_date_from_user_input
WHERE booking_id = :booking_id_from_update_form;

-- Delete a Flight or Booking
DELETE FROM Flights WHERE Flights.flight_id = :flight_id_selected_from_browse_flights_page;
DELETE FROM Bookings WHERE Bookings.booking_id = :booking_id_selected_from_browse_bookings_page;

-- Select Flights for View Flights page
SELECT Flights.flight_id, Flights.departure_city, Flights.arrival_city,
       Flights.departure_time, Flights.arrival_time, Flights.flight_status, Flights.available_seats
FROM Flights;

-- Update Flight Status for Flights Table Edit button
UPDATE Flights 
SET flight_status = :flight_status_selected_from_flight_status_dropdown,
    departure_time = :flight_departure_time_from_user_input,
    arrival_time = :flight_arrival_time_from_user_input,
    available_seats = :flight_available_seats_from_user_input
WHERE flight_id = :flight_status_entry_from_edit_button;

-- SELECT for Airplanes table
SELECT * FROM Airplanes;

-- SELECT for Airlines
SELECT * FROM Airlines

-- SELECT for Customers table
SELECT customer_id, first_name, last_name, email, phone_number
FROM Customers;

-- Add a Customer
INSERT INTO Customers (first_name, last_name, email, phone_number)
VALUES (:first_name_from_user_input, :last_name_from_user_input,
        :email_from_user_input, :phone_number_from_user_input);

-- Update Customer Email
UPDATE Customers 
SET email = :new_email_from_user_input,
    phone_number = :new_phone_from_user_input
WHERE customer_id = :customer_id_from_edit_form;

-- Delete Customer Name
DELETE FROM Customers 
WHERE customer_id = :customer_id_from_delete_form;
