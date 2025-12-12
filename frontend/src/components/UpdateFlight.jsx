const UpdateFlight = ({ airplanes, flights, backendURL, refreshFlights }) => {

    return (
        <>
        <h2>Update a Flight</h2>

        <form className='flightForm'>
            <label htmlFor="flight_id">Flight ID: </label>
            <select
                name="flight_id"
                id="flight_id"
            >
                <option value="">Select a Flight ID</option>
                {flights.map((flight, index) => (
                    <option value={flight["Flight ID"]} key={index}>{flight["Flight ID"]}</option>
                ))}
            </select>

            <label htmlFor="flight_departure_time">Departure Time: </label>
            <input
                type="text"
                name="flight_departure_time"
                id="flight_departure_time"
            />

            <label htmlFor="flight_arrival_time">Arrival Time: </label>
            <input
                type="text"
                name="flight_arrival_time"
                id="flight_arrival_time"
            />
            
            <p></p>

            <label htmlFor="flight_status">Flight Status: </label>
            <select
                name="flight_status"
                id="flight_status"
            >
                <option value="on_schedule">ON SCHEDULE</option>
                <option value="delayed">DELAYED</option>
                <option value="arrived">ARRIVED</option>
            </select>

            <label htmlFor="flight_avail_seats">Available Seats: </label>
            <input
                type="number"
                name="flight_avail_seats"
                id="flight_avail_seats"
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateFlight;