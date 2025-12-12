/*
CS340 Group 15
Schema DDL for Airline Reservation System Project
By Sicelo Masango and Ivan Thieu
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create the Airlines table

DROP TABLE IF EXISTS Airlines;

CREATE TABLE Airlines (
    airline_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    airline_name varchar(45) NOT NULL,
    country varchar(45) NOT NULL
);

-- Create the Airplanes table

DROP TABLE IF EXISTS Airplanes;

CREATE TABLE Airplanes (
    airplane_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    airplane_model varchar(45) NOT NULL,
    airline_id int(11) NOT NULL,
    total_seats int(4) NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES Airlines(airline_id)
    ON DELETE CASCADE
);

-- Create the Flights Table

DROP TABLE IF EXISTS Flights;

CREATE TABLE Flights (
    flight_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    airplane_id int(11) NOT NULL,
    departure_city varchar(3) NOT NULL,
    arrival_city varchar(3) NOT NULL,
    departure_time datetime NOT NULL,
    arrival_time datetime NOT NULL,
    flight_status varchar(45) NOT NULL,
    available_seats int(4) NOT NULL,
    FOREIGN KEY (airplane_id) REFERENCES Airplanes(airplane_id)
    ON DELETE CASCADE
);

-- Create Customers table

DROP TABLE IF EXISTS Customers;

CREATE TABLE Customers (
    customer_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    email varchar(45),
    phone_number bigint(11) NOT NULL
);

-- Create Bookings table

DROP TABLE IF EXISTS Bookings;

CREATE TABLE Bookings (
    booking_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id int(11) NOT NULL,
    booking_price decimal(8,2) NOT NULL,
    booking_date datetime NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create Tickets table

DROP TABLE IF EXISTS Tickets;

CREATE TABLE Tickets (
    ticket_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id int(11) NOT NULL,
    flight_id int(11) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
    ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
    ON DELETE CASCADE
);

-- Add sample data to Airlines

INSERT INTO Airlines
(
    airline_name,
    country
)
VALUES
(
    'SkyBlue',
    'United States'
),
(
    'JetFly',
    'United States'
),
(
    'Air Canada',
    'Canada'
);

-- Add sample data to Airplanes

INSERT INTO Airplanes
(
    airline_id,
    airplane_model,
    total_seats
)
VALUES
(
    3,
    'Airbus A320',
    460
),
(
    1,
    'Boeing 737',
    400
),
(
    2,
    'Airbus A380',
    520
),
(
    1,
    'Boeing 747',
    380
);

-- Add sample data to Flights

INSERT INTO Flights
(
    airplane_id,
    departure_city,
    arrival_city,
    departure_time,
    arrival_time,
    flight_status,
    available_seats
)
VALUES
(
    2,
    'LAX',
    'PHX',
    '2025-10-26 00:00:00',
    '2025-10-26 01:30:00',
    'ARRIVED',
    26
),
(
    1,
    'PDX',
    'JFK',
    '2025-10-27 03:15:00',
    '2025-10-27 09:15:00',
    'DELAYED',
    45
),
(
    3,
    'SFO',
    'MSP',
    '2025-10-28 05:15:00',
    '2025-10-28 08:45:00',
    'ON SCHEDULE',
    130
),
(
    2,
    'PHX',
    'MSP',
    '2025-10-29 05:15:00',
    '2025-10-29 08:20:00',
    'ON SCHEDULE',
    130
);

-- Add sample data to Customers

INSERT INTO Customers
(
    first_name,
    last_name,
    email,
    phone_number
)
VALUES
(
    'Sam',
    'Willis',
    'samwillis@hotmail.com',
    9712028737
),
(
    'Jane',
    'Strong',
    'janestrong@gmail.com',
    7239450278
),
(
    'Tim',
    'Alberg',
    'timalberg@gmail.com',
    2348974256 
);

-- Add sample data to Bookings

INSERT INTO Bookings
(
    customer_id,
    booking_price,
    booking_date
)
VALUES
(
    1,
    150,
    '2025-01-05'
),
(
    2,
    390,
    '2025-02-15'
),
(
    3,
    530,
    '2025-10-11'
),
(
    2,
    430,
    '2025-10-12'
);

-- Add sample data to Tickets

INSERT INTO Tickets
(
    booking_id,
    flight_id
)
VALUES
(
    3,
    2
),
(
    1,
    1
),
(
    1,
    4
),
(
    2,
    3
),
(
    4,
    2
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

