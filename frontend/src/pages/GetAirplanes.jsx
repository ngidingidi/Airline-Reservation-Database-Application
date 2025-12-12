// Airplanes page
// Displays airplane data within the database
// Only has READ functionality

import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import TableRow from '../components/TableRow';

function GetAirplanes({ backendURL }) {

    // Set up a state variable `airplanes` to store and display the backend response
    const [airplanes, setAirplanes] = useState([]);

    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/airplanes');
            
            // Convert the response into JSON format
            const {airplanes} = await response.json();
    
            // Update the state with the response data
            setAirplanes(airplanes);
            
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
            <h1>Airplanes</h1>
            <h2>Browse Airplanes</h2>

            <table>
                <thead>
                    <tr>
                        {/* Make sure that airplanes is rendered via length and display the headers */}
                        {/* REACT requires a unique key prop in the rows */}
                        {airplanes.length > 0 && Object.keys(airplanes[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each airplane row into the TableRow component for rendering */}
                    {airplanes.map((airplane, index) => (
                        <TableRow key={index} rowObject={airplane}/>
                    ))}
                </tbody>
            </table>

        </>
    );

} export default GetAirplanes;