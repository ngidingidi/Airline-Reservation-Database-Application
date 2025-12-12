// Tickets page
// Displays ticket data within the database
// Has CREATE, READ, and UPDATE functionality
// DELETE functionality will be handled through cancelling flights and bookings

import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import UpdateRow from '../components/UpdateRow';
import UpdateTicket from '../components/UpdateTicket';
import CreateTicket from '../components/CreateTicket';

function Tickets({ backendURL }) {

    // Set up state variables
    // tickets is used to display the ticket data on pageload, refresh, etc
    // showUpdate is a flag used to display the UpdateRow component 
    //            Defaults to false and is set to true when the update button linked to a row is clicked
    // ticketInfo is used to get the corresponding ticket information linked to the update row
    // flights is used to get corresponding flight information to update a ticket/booking to
    // bookings is used to get corresponding booking information to create a ticket
    const [tickets, setTickets] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [ticketInfo, setTicketInfo] = useState({});
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    
    // Get all of the ticket information
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/tickets');
            
            // Convert the response into JSON format
            const {tickets} = await response.json();
    
            // Update the state with the response data
            setTickets(tickets);
            
            // Make a GET request for flight information
            const response_flights = await fetch(backendURL + '/flights');        
            const {flights} = await response_flights.json();
            setFlights(flights);

            // Make a GET request for booking information
            const response_bookings = await fetch(backendURL + '/bookings');        
            const {bookings} = await response_bookings.json();
            setBookings(bookings);

        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }
    };

    // Get the data on page load
    useEffect(() => {
        getData();
    }, []);

    // Function to display the UpdateRow component once the update button is clicked by setting showUpdate state variable to true
    const handleShowUpdate = () => {
        setShowUpdate(true);
    };

    // Function to update ticketInfo state variable once the update button is clicked for a certain row
    const getUpdateInfo = async function (ticket) {
        setTicketInfo(ticket);
    }

    // Render the HTML
    return (
        <>
            <h1>Tickets</h1>
            <h2>Browse Tickets</h2>

            <table>
                <thead>
                    <tr>
                        {/* Make sure that tickets is rendered via length and display the headers */}
                        {tickets.length > 0 && Object.keys(tickets[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}

                        {/* Additional headers to update a ticket */}
                        <th>Update Ticket</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each ticket row into the TableRow component for rendering */}
                    {tickets.map((ticket, index) => (
                        <TableRow key={index} rowObject={ticket} 
                                // Pass the individual ticket information to the UpdateRow component
                                // UpdateRow requires the individual ticket information, getUpdateInfo to update the state variables, and showUpdate to show the component
                                onEdit={<UpdateRow rowItem={ticket} getUpdateInfo={getUpdateInfo} showUpdate={handleShowUpdate}/>}
                            />
                    ))}
                </tbody>
            </table>

            {/* Create Ticket component 
                Sends over backendURL to make requests to database, getData to update the table, bookings/flights to get info */}
            {<CreateTicket backendURL={backendURL} refreshTickets={getData} bookings={bookings} flights={flights} />}

            {/* Show the update component when the update button is pressed 
                Requires ticketInfo for pre-select functionality, backendURL to access that db, and getData to refresh */}
            {showUpdate && (
                <UpdateTicket ticketInfo={ticketInfo} backendURL={backendURL} refreshTickets={getData} flights={flights} />
            )}
        </>
    );

} export default Tickets;