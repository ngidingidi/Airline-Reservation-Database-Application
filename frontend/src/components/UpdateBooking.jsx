const UpdateBooking = ({ customers, backendURL, refreshBookings }) => {

    return (
        <>
        <h2>Update a Booking</h2>

        <h3>Flight to be Replaced (Required)</h3>
        <form className='bookingForm'>
            <label htmlFor="flight_depart_city">Departure City: </label>
            <input
                type="text"
                name="flight_depart_city"
                id="flight_depart_city"
            />

            <label htmlFor="flight_arrival_city">Arrival City: </label>
            <input
                type="text"
                name="flight_arrival_city"
                id="flight_arrival_city"
            />

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
            
            <h3>Replacement Flight Information</h3>

            <label htmlFor="flight_depart_city">Departure City: </label>
            <input
                type="text"
                name="flight_depart_city"
                id="flight_depart_city"
            />

            <label htmlFor="flight_arrival_city">Arrival City: </label>
            <input
                type="text"
                name="flight_arrival_city"
                id="flight_arrival_city"
            />

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

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateBooking;