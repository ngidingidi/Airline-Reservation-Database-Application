import { useNavigate } from 'react-router-dom';

function Navigation({backendURL}) {

    // Function to reset the data
    // Uses POST request to reset-data endpoint
    const resetData = async () => {
        const response = await fetch(backendURL + `/reset-data`, {
            method: "POST",
            headers: {"Content-type": "application/json"}
        });
        
        // Send an alert that the data was reset
        if (response.status === 200) {
            alert("Data has been reset. Please refresh the page.");
        } 
        else {
            alert("An error has occurred");
        }
    }

    return (
        <nav>
            Navigation:
            <a href="/">Home</a>
            <a href="/airlines">Airlines</a>
            <a href="/airplanes">Airplanes</a>
            <a href="/flights">Flights</a>
            <a href="/tickets">Tickets</a>
            <a href="/bookings">Bookings</a>
            <a href="/customers">Customers</a>
            <button id="reset-data" onClick={resetData}>Reset Data</button>
        </nav>
    )

} export default Navigation;