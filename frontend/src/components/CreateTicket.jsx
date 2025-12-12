// CreateTicket component to create a ticket

import { useState } from 'react';

const CreateTicket = ({ backendURL, refreshTickets, bookings, flights }) => {

    // Function to find booking information for a given a booking id. booking_id is a string, so is not strictly equal
    const findBooking = (booking_id) => {
        const booking = bookings.find((booking) => booking["Booking ID"] == booking_id);

        // Returns the booking
        return booking;
    }

    // Function to find flight data for a given a flight id. flight_id is a string, so is not strictly equal
    const findFlight = (flight_id) => {
        const flight = flights.find((flight) => flight["Flight ID"] == flight_id);

        // Returns the flight
        return flight;
    }

    // Define the states
    const [bookingID, setBookingID] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [flightID, setFlightID] = useState("");
    const [selectedDepartureCity, setSelectedDepartureCity] = useState("");
    const [selectedArrivalCity, setSelectedArrivalCity] = useState("");
    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedArrivalTime, setSelectedArrivalTime] = useState("");

    // Handle changes to the form
    const handleChange = (e) => {
        // Get the name and value of the target form field that changed
        // name matches the name of the element
        const {name, value} = e.target;

        // Set the corresponding value based on what changed
        if (name === "booking_id") {
            setBookingID(value);

            // Get the associated booking information if the value is not the default Select option
            if (value) {
                const booking = findBooking(value);
                setCustomerName(booking["Customer Name"]);
            }
        }
        if (name === "flight_id") {
            setFlightID(value);

            // Update associated flight information if value is not the default Select option
            if (value) {
                const flight = findFlight(value);
                setSelectedDepartureCity(flight["Departure City"]);
                setSelectedArrivalCity(flight["Arrival City"]);
                setSelectedDepartureTime(flight["Departure Time"]);
                setSelectedArrivalTime(flight["Arrival Time"]);
            }
        }
    };

    // Function to clear the form after creating a ticket
    const clearForm = async() => {
        setBookingID("");
        setCustomerName("");
        setFlightID("");
        setSelectedDepartureCity("");
        setSelectedArrivalCity("");
        setSelectedDepartureTime("");
        setSelectedArrivalTime("");
    }

    // onSubmit to create the customer
    const handleSubmit = async (bookingID, flightID) => {

        // Create the object to send
        const data = {bookingID, flightID}

        // Create ticket via POST request to /tickets
        try {
            const response = await fetch(backendURL + '/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // Send alert and refresh the data on success
        if (response.status === 200) {
            alert(`Ticket created!`);
            refreshTickets();
            clearForm();
        } else {
            alert("Creation unsuccessful");
        }
        } catch (error) {
            alert("Creation unsuccessful");
            console.error('Error during form submission:', error);
        }
    };

    // Render HTML
    return (
        <>
        <h2>Create a Ticket</h2>

        <form 
            className='ticketForm'
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(bookingID, flightID);
            }}
        >
            <label htmlFor="booking_id">Booking ID: </label>
            <select
                name="booking_id"
                id="booking_id"
                value={bookingID}
                onChange={handleChange}
            >
                {/* Map the booking id as the value to allow the corresponding model to pre-populate on update */}
                <option value="">Select a Booking ID</option>
                {bookings.map((booking, index) => (
                    <option value={booking["Booking ID"]} key={index}>{booking["Booking ID"]}</option>
                ))}
            </select>

            {/* Display the corresponding customer (Uneditable) */}
            <label htmlFor="booking_customer">Customer Name: {customerName}</label>
            <p></p>

            {/* Display the flight options */}
            <label htmlFor="flight_id">Flight ID: </label>
            <select
                name="flight_id"
                id="flight_id"
                value={flightID}
                onChange={handleChange}
            >
                {/* Map the flight id as the value to allow the corresponding model to pre-populate on update */}
                <option value="">Select a Flight ID</option>
                {flights.map((flight, index) => (
                    <option value={flight["Flight ID"]} key={index}>{flight["Flight ID"]}</option>
                ))}
            </select>

            {/* Uneditable flight information to display for reference */}
            <label htmlFor="flight_depart_city" className="label-space">Departure City: {selectedDepartureCity}</label>
            <label htmlFor="flight_arrive_city" className="label-space">Arrival City: {selectedArrivalCity}</label>
            <label htmlFor="flight_depart_time" className="label-space">Departure Time: {selectedDepartureTime}</label>
            <label htmlFor="flight_arrive_time" className="label-space">Arrival Time: {selectedArrivalTime}</label>
            <p></p>

            <input type="submit" value="Create Ticket" />
        </form>
        </>
    );
};

export default CreateTicket;