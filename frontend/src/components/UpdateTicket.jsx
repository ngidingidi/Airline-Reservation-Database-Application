// Component to Update a Ticket
// Purpose is to allow users to update the flight information associated with a particular booking/ticket

import { useState, useEffect } from 'react';

const UpdateTicket = ({ ticketInfo, backendURL, refreshTickets, flights }) => {

    // Function to find flight data for a given a flight id. flight_id is a string, so is not strictly equal
    const findFlight = (flight_id) => {
        const flight = flights.find((flight) => flight["Flight ID"] == flight_id);

        // Returns the flight
        return flight;
    }

    // Define the states
    const [selectedTicketID, setSelectedTicketID] = useState("");
    const [selectedBookingID, setSelectedBookingID] = useState("");
    const [selectedCustomerName, setSelectedCustomerName] = useState("");
    const [selectedFlightID, setSelectedFlightID] = useState("");
    const [selectedDepartureCity, setSelectedDepartureCity] = useState("");
    const [selectedArrivalCity, setSelectedArrivalCity] = useState("");
    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedArrivalTime, setSelectedArrivalTime] = useState("");

    // Initialize the info from the selected row
    useEffect(() => {
        setSelectedTicketID(ticketInfo["Ticket ID"]);
        setSelectedBookingID(ticketInfo["Booking ID"]);
        setSelectedCustomerName(ticketInfo["Customer Name"]);
        setSelectedFlightID(ticketInfo["Flight ID"]);
        setSelectedDepartureCity(ticketInfo["Departure City"]);
        setSelectedArrivalCity(ticketInfo["Arrival City"]);

        // Find the initial flight info and initialize the departure and arrival time
        const flight = findFlight(ticketInfo["Flight ID"]);
        setSelectedDepartureTime(flight["Departure Time"]);
        setSelectedArrivalTime(flight["Arrival Time"]);
    }, [ticketInfo]);

    // Handle changes to the form
    const handleChange = (e) => {
        // Get the name and value of the target form field that changed
        // name matches the name of the element
        const {name, value} = e.target;

        // Set the corresponding value based on what changed
        if (name === "flight_id") {
            setSelectedFlightID(value);

            // Update associated flight information
            const flight = findFlight(value);
            setSelectedDepartureCity(flight["Departure City"]);
            setSelectedArrivalCity(flight["Arrival City"]);
            setSelectedDepartureTime(flight["Departure Time"]);
            setSelectedArrivalTime(flight["Arrival Time"]);
        }
    };

    // onUpdate function to send the updated ticket info to the backend
    // _id is the ticket id
    // flight_id is the new associated flight_id
    const onUpdate = async (_id, flight_id) => {
        // Create the object to send
        const data = {flight_id}

        // Send a PUT request to /ticket/id url in the backend
        const response = await fetch(`${backendURL}/ticket/${_id}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        });

        // If the request was successful, refresh the data after confirmation
        if (response.status === 200) {
            alert("Data successfully updated");
            refreshTickets();
        }
        else {
            alert("Update unsuccessful");
            console.error(`id=${_id}, status code = ${response.status}`);
        }
    }

    // HTML
    return (
        <>
        <h2>Update a Ticket</h2>

        <h3>Booking to be Modified</h3>
        <form 
            className='bookingForm'
            onSubmit={(e) => {
                e.preventDefault();
                onUpdate(selectedTicketID, selectedFlightID);
            }}
        >
            {/* Display the Ticket id (Uneditable) */}
            <label htmlFor="ticket_id" className="label-space">Ticket ID: {selectedTicketID}</label>

            {/* Display the booking id (Uneditable) */}
            <label htmlFor="booking_id" className="label-space">Booking ID: {selectedBookingID}</label>

            {/* Display the corresponding customer (Uneditable) */}
            <label htmlFor="booking_customer">Customer Name: {selectedCustomerName}</label>
             
            <h3>Updated Flight Information</h3>

            <label htmlFor="flight_id">Flight ID: </label>
            <select
                name="flight_id"
                id="flight_id"
                value={selectedFlightID}
                onChange={handleChange}
            >
                {/* Map the flight id as the value to allow the corresponding model to pre-populate on update */}
                <option value="">Select a Flight ID</option>
                {flights.map((flight, index) => (
                    <option value={flight["Flight ID"]} key={index}>{flight["Flight ID"]}</option>
                ))}
            </select>

            <label htmlFor="flight_depart_city" className="label-space">Departure City: {selectedDepartureCity}</label>
            <label htmlFor="flight_arrive_city" className="label-space">Arrival City: {selectedArrivalCity}</label>
            <label htmlFor="flight_depart_time" className="label-space">Departure Time: {selectedDepartureTime}</label>
            <label htmlFor="flight_arrive_time" className="label-space">Arrival Time: {selectedArrivalTime}</label>

            <p></p>

            <input type="submit" value="Update Ticket" />
        </form>
        </>
    );
};

export default UpdateTicket;