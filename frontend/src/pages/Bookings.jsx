// Bookings page
// Displays bookings data within the database
// Has CREATE, READ, UPDATE, and DELETE functionality

import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import DeleteRow from '../components/DeleteRow';
import CreateBooking from '../components/CreateBooking';

function Bookings({backendURL, onDelete}) {

    // Set up state variables
    // bookings is used to display the bookings data on pageload, refresh, etc
    // customers is used to pass into CreateBookings for dropdown functionality
    const [bookings, setBookings] = useState([]);
    const [customers, setCustomers] = useState([]);

    // Get all the bookings and customers when the page first loads
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/bookings');
            
            // Convert the response into JSON format
            const {bookings} = await response.json();
            
            // Update the state with the response data
            setBookings(bookings);

            // Get the customers
            const response_customer = await fetch(backendURL + '/customers');
            const {customers} = await response_customer.json();

            // Add a full name key to every customer
            customers.forEach(customer => {
                customer["Full Name"] = `${customer["First Name"]} ${customer["Last Name"]}`
            });

            // Set the customers
            setCustomers(customers);

        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }
    };

    // Get data on page load
    useEffect(() => {
        getData();
    }, []);

    // Render the HTML
    return (
        <>
            <h1>Bookings</h1>
            <h2>Browse Bookings</h2>

            <table>
                <thead>
                    <tr>
                        {bookings.length > 0 && Object.keys(bookings[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}

                        {/* Additional headers to cancel a booking */}
                        <th>Cancel Booking</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each booking row into the TableRow component for rendering
                        Also pass the onDelete and onEdit component for DELETE and UPDATE functionality  */}
                    {bookings.map((booking, index) => (
                        <TableRow key={index} rowObject={booking}
                                // Pass the individual booking information to the DeleteRow component
                                // DeleteRow requires the individual booking information, id name, entity type for the url, delete method, and setBookings from getData method
                                onDelete={<DeleteRow rowItem={booking} idName={"Booking ID"} entityType={"booking"} onDelete={onDelete} refreshData={getData} />}        
                            />
                    ))}
                </tbody>
            </table>

            {/* Create Booking component 
                Requires customer data for dropdown functionality to select a customer, backendURL to call the backend, and refreshBooking to update the data
            */}
            {<CreateBooking customers={customers} backendURL={backendURL} refreshBookings={getData}/>}
            
            <h3>Notes</h3>
            <ul>
                <li>Booking date is displayed as local time in the form, but the entity table will display it as UTC time</li>
                <li>After creating a booking, please create tickets to link it to one of more of the available flights</li>
            </ul>
        </>
    );

} export default Bookings;