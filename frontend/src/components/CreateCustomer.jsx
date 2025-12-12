// CreateCustomer component to create a customer

import { useState } from 'react';

const CreateCustomer = ({ backendURL, refreshCustomers }) => {

    // Define the states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Handle changes to the form
    const handleChange = (e) => {
        // Get the name and value of the target form field that changed
        // name matches the name of the element
        const {name, value} = e.target;

        // Set the corresponding value based on what changed
        if (name === "first_name") {
            setFirstName(value);
        }
        if (name === "last_name") {
            setLastName(value);
        }
        if (name === "email") {
            setEmail(value);
        }
        if (name === "phone_number") {
            setPhone(value);
        }
    };

    // Function to clear the form after creating a customer
    const clearForm = async() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
    }

    // onSubmit to create the customer
    const handleSubmit = async (first_name, last_name, email, phone_number) => {

        // Create the object to send
        const data = {first_name, last_name, email, phone_number}

        // Create customer via POST request to /customers
        try {
            const response = await fetch(backendURL + '/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        // Send alert and refresh the data on success
        if (response.status === 200) {
            console.log("Customer created successfully.");
            alert(`Customer created!\nFirst Name: ${first_name}\nLast Name: ${last_name}\nEmail: ${email}\nPhone: ${phone_number}`);
            refreshCustomers();
            clearForm();
        } else {
            alert("Creation unsuccessful. Make sure the phone number is a valid number");
            console.error("Error creating customer.");
        }
        } catch (error) {
            alert("Creation unsuccessful");
            console.error('Error during form submission:', error);
        }
    };

    // Render HTML
    return (
        <>
        <h2>Create a Customer</h2>

        <form 
            className='customerForm'
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(firstName, lastName, email, phone);
            }}
        >
            <label htmlFor="first_name">First Name: </label>
            <input
                type="text"
                name="first_name"
                id="first_name"
                value={firstName}
                onChange={handleChange}
            />

            <label htmlFor="last_name">Last Name: </label>
            <input
                type="text"
                name="last_name"
                id="last_name"
                value={lastName}
                onChange={handleChange}
            />

            <label htmlFor="email">Email: </label>
            <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={handleChange}
            />

            <label htmlFor="phone_number">Phone Number: </label>
            <input
                type="phone_number"
                name="phone_number"
                id="phone_number"
                value={phone}
                onChange={handleChange}
            />

            <input type="submit" value="Create Customer" />
        </form>
        </>
    );
};

export default CreateCustomer;