const UpdateCustomer = ({ customers, backendURL, refreshCustomers }) => {

    return (
        <>
        <h2>Update a Customer</h2>

        <form className='customerForm'>
            <label htmlFor="first_name">First Name: </label>
            <select
                name="first_name"
                id="first_name"
            >
                <option value="">Select the first name</option>
                {customers.map((customer, index) => (
                    <option value={customer["Customer ID"]} key={index}>{customer["First Name"]}</option>
                ))}
            </select>

            <label htmlFor="last_name">Last Name: </label>
            <select
                name="last_name"
                id="last_name"
            >
                <option value="">Select the last name</option>
                {customers.map((customer, index) => (
                    <option value={customer["Customer ID"]} key={index}>{customer["Last Name"]}</option>
                ))}
            </select>

            <label htmlFor="email">Email: </label>
            <input
                type="text"
                name="email"
                id="email"
            />

            <label htmlFor="phone_number">Phone Number: </label>
            <input
                type="phone_number"
                name="phone_number"
                id="phone_number"
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateCustomer;