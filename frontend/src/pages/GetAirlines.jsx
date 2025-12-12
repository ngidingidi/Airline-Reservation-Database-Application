// Airlines page
// Displays airline data within the database
// Only has READ functionality

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function GetAirlines({ backendURL }) {

    // Set up a state variable `airlines` to store and display the backend response
    const [airlines, setAirlines] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/airlines');
            
            // Convert the response into JSON format
            const {airlines} = await response.json();
    
            // Update the state with the response data
            setAirlines(airlines);
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }
    };

    // Get the data on page load
    useEffect(() => {
        getData();
    }, []);

    // Render the HTML
    return (
        <>
            <h1>Airlines</h1>
            <h2>Browse Airlines</h2>

            <table>
                <thead>
                    {/* Make sure that airlines is rendered via length and display the headers */}
                    <tr>
                        {airlines.length > 0 && Object.keys(airlines[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each airline row into the TableRow component for rendering */}
                    {airlines.map((airline, index) => (
                        <TableRow key={index} rowObject={airline}/>
                    ))}
                </tbody>
            </table>

        </>
    );

} export default GetAirlines;