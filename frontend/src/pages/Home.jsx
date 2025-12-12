function Home() {
    return (
        <>
            <h1>Airline Reservation System</h1>
            <div className="homepageDescription">
                <p>Welcome to the Airline Reservation System. Please use the navigation bar above to access the different entity tables. Below are some notes to assist with utilizing the system</p>
            </div>
            <h2>Airlines</h2>
                <ul>
                    <li>Airlines only has READ functionality</li>
                    <li>The company has no interest in buying or selling new airlines</li>
                </ul>
            <h2>Airplanes</h2>
                <ul>
                    <li>Airplanes only has READ functionality</li>
                    <li>The company has not interest in buying, retiring, or modifying any of the existing planes</li>
                </ul>
            <h2>Flights</h2>
                <ul>
                    <li>Flights has CREATE, READ, UPDATE, and DELETE functionality</li>
                    <li>Dates and times are shown on the table in <b>UTC Time</b>. However, selecting a date and time in the form uses <b>Local Time</b></li>
                    <ul><li>The timezone is automatically converted from local time and displayed in the table as UTC time when creating or updating a flight</li></ul>
                    <li>Updating a Flight will update the associated Ticket information</li>
                    <li>The city codes should have a max of 3 letters</li>
                </ul>
            <h2>Tickets</h2>
                <ul>
                    <li>Tickets has CREATE, READ, and UPDATE functionality</li>
                    <li>To delete a ticket, either the corresponding flight needs to be deleted or the corresponding booking needs to be deleted</li>
                    <li>The tickets allow a flight to be linked to multiple bookings and a booking to be linked to multiple flights</li>
                    <li>Assigning a flight to a booking should be handled by creating a ticket in the Tickets page</li>
                    <li>It is not a requirement for two different flights with the same booking id to have the same arrival/departure city</li>
                    <ul>
                        <li>Customers can travel to another airport to reach their second flight</li>
                    </ul>
                    <li>It is possible for there to be unique tickets with the same flight id and booking id</li>
                    <ul>
                        <li>This is for cases where a customer is buying multiple tickets for a family trip</li>
                    </ul>
                </ul>
            <h2>Bookings</h2>
                <ul>
                    <li>Bookings has CREATE, READ, and DELETE functionality</li>
                    <li>There is no functionality to update a booking because a booking should not change once created</li>
                    <li>Flights associated to a booking can be updated through Tickets</li>
                    <li>After creating a booking, the user should link it with one or more flights by creating the necessary tickets</li>
                </ul>
            <h2>Customers</h2>
                <ul>
                    <li>Customers has CREATE, READ, UPDATE, and DELETE functionality</li>
                    <li>When creating a customer, the phone number needs to be a number or there will be an error message</li>
                </ul>
        </>
    )
} export default Home;