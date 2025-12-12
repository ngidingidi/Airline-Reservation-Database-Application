// ########################################
// ########## SETUP
// Establishes server for the backend
// Handles different route requests sent from the front end
// Calls information from the database to send back to the front end

// Database
import db from './database/db-connector.mjs';
import express from 'express';
import cors from 'cors';

// Express
const app = express();

// Middleware
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests

const PORT = 7230;

// Generic messages
const QUERY_ERROR = {Error: "An error occurred while executing the database queries. Please check inputs"}
const NOT_FOUND = {Error: "Not found"}
const RESET_SUCCESS = {Success: "Reset successful"}

// ########################################
// ########## ROUTE HANDLERS

// ################### READ ROUTES ###################
// Airlines
app.get('/airlines', async (req, res) => {
    try {
        // Create and execute our queries
        // Get the airline data from the database
        const query = `SELECT airline_id as "Airline ID", airline_name as "Airline Name", country as "Country" FROM Airlines\ 
                        ORDER BY airline_id ASC;`;
        const [airlines] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ airlines });

    } catch (error) {
        // Send an error message to the browser and console 
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// Airplanes
app.get('/airplanes', async (req, res) => {
    try {
        // Create and execute our queries
        // Get the airplanes data. Airplanes left joins with Airlines to get airline information
        const query = `SELECT Airplanes.airplane_id as "Airplane ID", Airplanes.airplane_model as "Airplane Model", Airplanes.total_seats as "Total Seats",\
                        Airlines.airline_name as "Airline"\
                        FROM Airplanes LEFT JOIN Airlines on Airplanes.airline_id = Airlines.airline_id\
                        ORDER BY Airplanes.airplane_id ASC;`;
        const [airplanes] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ airplanes });

    } catch (error) {
        // Send an error message to the browser and console 
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// Flights
app.get('/flights', async (req, res) => {
    try {
        // Get flight data. Flights left join with Airplanes to get model information
        const query = `SELECT Flights.flight_id as "Flight ID", Airplanes.airplane_model as "Airplane Model", Flights.departure_city as "Departure City",\
                        Flights.arrival_city as "Arrival City", Flights.departure_time as "Departure Time", Flights.arrival_time as "Arrival Time",\
                        Flights.flight_status as "Flight Status", Flights.available_seats as "Available Seats", Airplanes.total_seats as "Total Seats"\ 
                        FROM Flights LEFT JOIN Airplanes on Airplanes.airplane_id = Flights.airplane_id\
                        ORDER BY Flights.flight_id ASC;`;
        const [flights] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ flights });

    } catch (error) {
        // Send an error message to the browser and console
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// Tickets
app.get('/tickets', async (req, res) => {
    try {
        // Get ticket data. Tickets inner join with bookings, flights, and customers
        // Inner join vs left join shouldn't matter since a ticket needs a flight and booking to be linked
        // But inner join was chosen because a ticket needs both a flight and a booking to be linked and booking requires a customer  
        const query = `SELECT Tickets.ticket_id as "Ticket ID", Flights.flight_id as "Flight ID", Bookings.booking_id as "Booking ID", Bookings.booking_date as "Booking Date",\
                        CONCAT(Customers.first_name, " ", Customers.last_name) as "Customer Name",\
                        Flights.departure_city as "Departure City", Flights.arrival_city as "Arrival City"\
                        FROM Tickets\
                        INNER JOIN Bookings on Tickets.booking_id = Bookings.booking_id\
                        INNER JOIN Customers on Bookings.customer_id = Customers.customer_id\
                        INNER JOIN Flights on Tickets.flight_id = Flights.flight_id
                        ORDER BY Tickets.ticket_id ASC;`;
        const [tickets] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ tickets });

    } catch (error) {
        // Send an error message to the browser and console
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// Bookings
app.get('/bookings', async (req, res) => {
    try {
        // Get bookings data. Bookings left joins with customers
        const query = `SELECT Bookings.booking_id as "Booking ID", CONCAT(Customers.first_name, " ", Customers.last_name) as "Customer Name",\
                        Bookings.booking_price as "Booking Price", Bookings.booking_date as "Booking Date"\
                        FROM Bookings\
                        LEFT JOIN Customers on Bookings.customer_id = Customers.customer_id\
                        ORDER BY Bookings.booking_id ASC;`;
        const [bookings] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ bookings });

    } catch (error) {
        // Send an error message to the browser and console
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// Customers
app.get('/customers', async (req, res) => {
    try {
        // Get customers data.
        const query = `SELECT Customers.customer_id as "Customer ID", Customers.first_name as "First Name", Customers.last_name as "Last Name",\
                        Customers.email as "Email", Customers.phone_number as "Phone Number"\
                        FROM Customers\
                        ORDER BY Customers.customer_id ASC;`;
        const [customers] = await db.query(query);
    
        // Send the results to the frontend
        res.status(200).json({ customers });

    } catch (error) {
        // Send an error message to the browser and console
        console.error("Error executing queries:", error);
        res.status(500).json(QUERY_ERROR);
    }
});

// ################### RESET ROUTES ###################
// Route to reset data. Looks for a POST request to /reset-data
app.post('/reset-data', async(req, res) => {
    try {
        // Calls sp_load_data() procedure in the database
        const query = `CALL sp_load_data();`;
        await db.query(query);
    
        // Sends a success message to the frontend if it was successfully executed
        res.status(200).json(RESET_SUCCESS);

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).json(QUERY_ERROR);
    }
});

// ################### DELETE ROUTES ###################
// Delete a booking
app.delete('/booking/:id', async function (req, res) {
    try {
        // Call the sp_DeleteBooking procedure using the id passed from the frontend
        const query = `CALL sp_DeleteBooking(?);`;
        await db.query(query, [req.params.id]);
        
        // Send back an empty 204 to signal a successful delete
        res.status(204).send()

    } catch (error) {
        // Otherwise, send a 404 with an error message
        res.status(404).json(NOT_FOUND);
    }
});

// Delete a flight
app.delete('/flight/:id', async function (req, res) {
    try {
        // Call the sp_DeleteFlight procedure using the id passed from the frontend
        const query = `CALL sp_DeleteFlight(?);`;
        await db.query(query, [req.params.id]);
        
        // Send back an empty 204 to signal a successful delete
        res.status(204).send()

    } catch (error) {
        // Send a 404 if the ID was not found
        res.status(404).json(NOT_FOUND);
    }
});

// Delete a customer
app.delete('/customer/:id', async function (req, res) {
    try {
        // Call the sp_DeleteCustomer procedure using the id passed from the frontend
        const query = `CALL sp_DeleteCustomer(?);`;
        await db.query(query, [req.params.id]);
        
        // Send back an empty 204 to signal a successful delete
        res.status(204).send()

    } catch (error) {
        // Send a 404 if the ID was not found
        res.status(404).json(NOT_FOUND);
    }
});

// ################### UPDATE ROUTES ###################
// Update a flight
app.put('/flight/:id', async function (req, res) {
    // Get the flight information from the request body
    const flight = req.body;

    try {
        // Call the sp_update_flight procedure
        const query = `CALL sp_update_flight(?, ?, ?, ?, ?, ?, ?, ?)`
        await db.query(query, [req.params.id, flight.airplane_id, flight.departure_city,
            flight.arrival_city, flight.departure_time, flight.arrival_time, flight.flight_status, flight.available_seats]);

        // Send back a 200 along with the updated data if successful
        res.status(200).json(flight);
    } catch (error) {
        // Otherwise send a 400
        res.status(400).json(QUERY_ERROR);
    }
});

// Update a customer
app.put('/customer/:id', async function (req, res) {
    // Get the customer information from the request body
    const customer = req.body;
    
    try {
        // Call the sp_update_customer procedure
        const query = `CALL sp_update_customer(?, ?, ?, ?, ?)`
        await db.query(query, [req.params.id, customer.first_name, customer.last_name, customer.email, customer.phone_number]);

        // Send back a 200 along with the updated data if successful
        res.status(200).json(customer);
    } catch (error) {
        // Otherwise send a 400
        res.status(400).json(QUERY_ERROR);
    }
});

// Update a ticket
app.put('/ticket/:id', async function (req, res) {   
    try {
        // Call the sp_update_ticket procedure
        const query = `CALL sp_update_ticket(?, ?)`
        await db.query(query, [req.params.id, req.body.flight_id]);

        // Send back a 200 along with the updated data if successful
        res.status(200).json(req.body);
    } catch (error) {
        // Otherwise send a 400
        res.status(400).json(QUERY_ERROR);
    }
});

// ################### CREATE ROUTES ###################
// Create a customer
app.post('/customers', async function (req, res) {
    
    // Get the request
    const customer = req.body;

    try {
        // Call sp_CreateCustomer
        const query = `CALL sp_CreateCustomer(?, ?, ?, ?, @new_id)`
        const [result] = await db.query(query, [customer.first_name, customer.last_name, customer.email, customer.phone_number]);

        // Get the id that was created
        const [new_id] = await db.query('SELECT @new_id as new_id');

        // Send back a 200 along with the updated data if an id was created successful
        if (new_id) {
            res.status(200).json(customer);
        }
    } catch (error) {
        // Send a 400 if failed
        res.status(400).json(QUERY_ERROR);
    }
});

// Create a booking
app.post('/bookings', async function (req, res) {
    
    // Get the request
    const booking = req.body;

    try {
        // Call sp_CreateCustomer
        const query = `CALL sp_CreateBooking(?, ?, ?, @new_id)`
        const [result] = await db.query(query, [booking.customerID, booking.bookingPrice, booking.bookingDate]);

        // Get the id that was created
        const [new_id] = await db.query('SELECT @new_id as new_id');

        // Send back a 200 along with the updated data if an id was created successful
        if (new_id) {
            res.status(200).json(booking);
        }
    } catch (error) {
        // Send a 400 if failed
        res.status(400).json(QUERY_ERROR);
    }
});

// Create a ticket
app.post('/tickets', async function (req, res) {
    
    // Get the request
    const ticket = req.body;

    try {
        // Call sp_CreateTicket
        const query = `CALL sp_CreateTicket(?, ?, @new_id)`
        const [result] = await db.query(query, [ticket.bookingID, ticket.flightID]);

        // Get the id that was created
        const [new_id] = await db.query('SELECT @new_id as new_id');

        // Send back a 200 along with the updated data if an id was created successful
        if (new_id) {
            res.status(200).json(ticket);
        }
    } catch (error) {
        // Send a 400 if failed
        res.status(400).json(QUERY_ERROR);
    }
});

// Create a flight
app.post('/flights', async function (req, res) {
    
    // Get the request
    const flight = req.body;

    try {
        // Call sp_CreateFlight
        const query = `CALL sp_CreateFlight(?, ?, ?, ?, ?, ?, ?, @new_id)`
        const [result] = await db.query(query, [flight.airplane_id, flight.departure_city, flight.arrival_city,
            flight.departure_time, flight.arrival_time, flight.flight_status, flight.available_seats]);

        // Get the id that was created
        const [new_id] = await db.query('SELECT @new_id as new_id');

        // Send back a 200 along with the updated data if an id was created successful
        if (new_id) {
            res.status(200).json(flight);
        }
    } catch (error) {
        // Send a 400 if failed
        res.status(400).json(QUERY_ERROR);
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log('Express started on https://www.freesqldatabase.com:' + PORT + '; press Ctrl-C to terminate.');
});