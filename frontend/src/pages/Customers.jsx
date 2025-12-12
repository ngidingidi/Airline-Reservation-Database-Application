// Customers page
// Displays customers data within the database
// Has CREATE, READ, UPDATE, and DELETE functionality

import { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';
import UpdateRow from '../components/UpdateRow';
import DeleteRow from '../components/DeleteRow';
import CreateCustomer from '../components/CreateCustomer';
import UpdateCustomer from '../components/UpdateCustomer';

function Customers({ backendURL, onDelete }) {

    // Set up state variables
    // customers is used to display the customers data on pageload, refresh, etc
    // showUpdate is a flag used to display the UpdateRow component 
    //            Defaults to false and is set to true when the update button linked to a row is clicked
    // customerInfo is used to get the corresponding customer information linked to the update row
    const [customers, setCustomers] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({});

    // Get all the customer info
    const getData = async function () {
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL + '/customers');
            
            // Convert the response into JSON format
            const {customers} = await response.json();
    
            // Update the people state with the response data
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

    // Function to display the UpdateRow component once the update button is clicked by setting showUpdate state variable to true
    const handleShowUpdate = () => {
        setShowUpdate(true);
    };

    // Function to update customerInfo state variable once the update button is clicked for a certain row
    const getUpdateInfo = async function (customer) {
        setCustomerInfo(customer);
    }

    // Render the HTML
    return (
        <>
            <h1>Customers</h1>
            <h2>Browse Customers</h2>

            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}

                        {/* Additional headers to delete and update a customer */}
                        <th>Delete Customer</th>
                        <th>Update Customer</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Pass each customer row into the TableRow component for rendering
                        Also pass the onDelete and onEdit component for DELETE and UPDATE functionality  */}
                    {customers.map((customer, index) => (
                        <TableRow key={index} rowObject={customer}
                                // Pass the individual customer information to the DeleteRow and UpdateRow components
                                // DeleteRow requires the individual customer information, id name, entity type for the url, delete method, and setCustomers from getData method
                                // UpdateRow requires the individual customer information, getUpdateInfo to update the state variable, and showUpdate to show the component
                                onDelete={<DeleteRow rowItem={customer} idName={"Customer ID"} entityType={"customer"} onDelete={onDelete} refreshData={getData} />}
                                onEdit={<UpdateRow rowItem={customer} getUpdateInfo={getUpdateInfo} showUpdate={handleShowUpdate}/>}
                            />
                    ))}
                </tbody>
            </table>

            {/* Create Customer component */}
            {<CreateCustomer backendURL={backendURL} refreshCustomers={getData}/>}

            {/* Show the update component when the update button is pressed 
                Requires customerInfo for pre-select functionality, backendURL to access that db, and getData to refresh */}
            {showUpdate && (
                <UpdateCustomer customerInfo={customerInfo} backendURL={backendURL} refreshCustomers={getData} />
            )}
        </>
    );

} export default Customers;