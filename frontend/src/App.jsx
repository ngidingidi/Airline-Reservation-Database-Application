import { Routes, Route } from 'react-router-dom';

// Get the port and host from the .env file
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
//const HOST = import.meta.env.VITE_HOST_LOCAL;

const HOST = import.meta.env.VITE_HOST;

// Pages
import Home from './pages/Home';
import GetAirlines from './pages/GetAirlines';
import GetAirplanes from './pages/GetAirplanes';
import Flights from './pages/Flights';
import GetTickets from './pages/GetTickets';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = BACKEND_PORT;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `${HOST}:${backendPort}`;

function App() {

    // Delete method to pass down to the different pages and ultimately the DeleteRow component
    const onDelete = async (_entityType, _id) => {

        // Show a confirmation message
        const userConfirmed = window.confirm("Are you sure you want to delete the row?");
        
        // Do nothing if user cancels
        if (!userConfirmed) {
            console.log("Delete action canceled by user.");
            return; 
        }

        // Otherwise, connect to the backend to delete the id
        const response = await fetch(`${backendURL}/${_entityType}/${_id}`, {method: "DELETE"});

        // If the delete was successful, reload the page
        if (response.status === 204) {
            alert("Deletion successful. Please reload the page.");
        }
        else {
            alert("Deletion unsuccessful");
            console.error(`id=${_id}, status code = ${response.status}`);
        }
    }

    return (
        <>
            <Navigation backendURL={backendURL} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/airlines" element={<GetAirlines backendURL={backendURL} />} />
                <Route path="/airplanes" element={<GetAirplanes backendURL={backendURL} />} />
                <Route path="/flights" element={<Flights backendURL={backendURL}  onDelete={onDelete}/>} />
                <Route path="/tickets" element={<GetTickets backendURL={backendURL} />} />
                <Route path="/bookings" element={<Bookings backendURL={backendURL} onDelete={onDelete}/>} />
                <Route path="/customers" element={<Customers backendURL={backendURL} onDelete={onDelete}/>} />
            </Routes>
        </>
    );

} export default App;