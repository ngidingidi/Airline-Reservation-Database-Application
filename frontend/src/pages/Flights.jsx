// Flights page
// Displays flight data within the database
// Has CREATE, READ, UPDATE, and DELETE functionality

// Import necessary components along with useState and useEffect
import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import DeleteRow from '../components/DeleteRow';
import UpdateRow from '../components/UpdateRow';
import CreateFlight from '../components/CreateFlight';
import UpdateFlight from '../components/UpdateFlight';

function Flights({ backendURL, onDelete}) {

    // Set up state variables
    // flights is used to display the flights data on pageload, refresh, etc
    // airplanes is used to link an airplane with a flight when creating a flight
    // showUpdate is a flag used to display the UpdateRow component 
    //            Defaults to false and is set to true when the update button linked to a row is clicked
    // flightInfo is used to get the corresponding flight information linked to the update row
    const [flights, setFlights] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [flightInfo, setFlightInfo] = useState({});

    // Get all the flights and airplanes data when the page first loads
    const getData = async function () {
        try {
            // GET flight information and save response as a JSON
            const response_flights = await fetch(backendURL + '/flights');
            const {flights} = await response_flights.json();
                        
            // GET airplane information and save response as a JSON
            const response_airplanes = await fetch(backendURL + '/airplanes');
            const {airplanes} = await response_airplanes.json();

            // Update the states with the response data to update the UI
            setFlights(flights);
            setAirplanes(airplanes);
            
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        }
    };

    // Get data on page load
    useEffect(() => {
        getData();
    }, []);

    // Function to display the UpdateRow component once the update button is clicked by setting showUpdate state variable to true
    const handleShowUpdate = () => {
        setShowUpdate(true);
    };

    // Function to update flightInfo state variable once the update button is clicked for a certain row
    const getUpdateInfo = async function (flight) {
        setFlightInfo(flight);
    }

    // Render the HTML
    return (
        <>
            <h1>Flights</h1>
            <h2>Browse Flights</h2>

            <table>
                <thead>
                    <tr>
                        {flights.length > 0 && Object.keys(flights[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}

                        {/* Additional headers to cancel and update a flight */}
                        <th>Cancel Flight</th>
                        <th>Update Flight</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each flight row into the TableRow component for rendering
                        Also pass the onDelete and onEdit component for DELETE and UPDATE functionality  */}
                    {flights.map((flight, index) => (
                        <TableRow key={index} rowObject={flight}

                                  // Pass the individual flight information to the DeleteRow and UpdateRow components
                                  // DeleteRow requires the individual flight information, id name, entity type for the url, delete method, and setFlights from getData
                                  // UpdateRow requires the individual flight information, getUpdateInfo to update the state, and showUpdate to show the component
                                  onDelete={<DeleteRow rowItem={flight} idName={"Flight ID"} entityType={"flight"} onDelete={onDelete} refreshData={getData} />}
                                  onEdit={<UpdateRow rowItem={flight} getUpdateInfo={getUpdateInfo} showUpdate={handleShowUpdate} />}
                                />
                          ))}
                </tbody>
            </table>

            {/* Create Flight component to be worked on */}
            {<CreateFlight airplanes={airplanes} backendURL={backendURL} refreshFlights={getData}/>}

            {/* Show the update component when the update button is pressed */}
            {/* Individual flightInfo data is passed to pre-populate the data UpdateFlight */}
            {/* Airplanes data is passed to allow users to change the airplane model */}
            {/* Backend URL is the url to connect to the backend */}
            {showUpdate && (
                <UpdateFlight flightInfo={flightInfo} airplanes={airplanes} backendURL={backendURL} refreshFlights={getData}/>
            )}
            <h3>Notes</h3>
            <ul>
                <li>Departure time and arrival time is displayed as local time in the form, but the entity table will display it as UTC time</li>
            </ul>
        </>
    );

} export default Flights;