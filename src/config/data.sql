-- Seed USERS
INSERT INTO users (first_name, last_name, email, password, phone, date_of_birth, passport_number)
VALUES 
('Ravi', 'Kumar', 'ravi.k@example.com', 'hashedpassword1', '9123456789', '1990-04-15', 'M1234567'),
('Asha', 'Patel', 'asha.p@example.com', 'hashedpassword2', '9876543210', '1985-12-01', 'L7654321');

-- Seed AIRLINES
INSERT INTO airlines (name, iata_code)
VALUES 
('IndiGo', '6E'),
('Air India', 'AI');

-- Seed AIRPORTS
INSERT INTO airports (code, name, city, country)
VALUES 
('DEL', 'Indira Gandhi International Airport', 'Delhi', 'India'),
('BOM', 'Chhatrapati Shivaji International Airport', 'Mumbai', 'India'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India');

-- Seed FLIGHTS
INSERT INTO flights (flight_number, airline_id, source_airport_id, destination_airport_id, aircraft_type, departure_time, arrival_time, base_price, total_seats, available_seats)
VALUES 
('6E203', 1, 1, 2, 'Airbus A320', '2025-07-01 09:00', '2025-07-01 11:15', 4500, 180, 178),
('AI450', 2, 2, 3, 'Boeing 737', '2025-07-02 18:00', '2025-07-02 20:15', 5200, 150, 145);

-- Seed HOTELS
INSERT INTO hotels (name, location, star_rating, amenities, check_in_time, check_out_time, images)
VALUES 
('The Leela Palace', 'Delhi', 5, 'WiFi,Pool,Spa,Gym', '14:00', '12:00', 'leela.jpg'),
('ITC Kohenur', 'Hyderabad', 5, 'WiFi,Pool,Restaurant', '13:00', '11:00', 'itc.jpg');

-- Seed HOTEL ROOMS
INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, max_occupancy, available_quantity, amenities)
VALUES 
(1, 'Deluxe Room', 6000, 2, 10, 'AC,TV,Mini Bar'),
(2, 'Executive Suite', 8500, 3, 5, 'AC,TV,Jacuzzi');

-- Seed HOLIDAY PACKAGES
INSERT INTO holiday_packages (name, duration_days, duration_nights, destinations, inclusions, price_per_person, max_group_size, highlights, images)
VALUES 
('Golden Triangle Tour', 5, 4, 'Delhi,Agra,Jaipur', 'Hotel,Transport,Guide,Breakfast', 15000, 20, 'Taj Mahal, Amber Fort, Red Fort', 'goldentriangle.jpg');

-- Seed FLIGHT BOOKINGS
INSERT INTO flight_bookings (booking_reference, user_id, flight_id, journey_date, travel_class, total_fare, contact_email, contact_phone)
VALUES 
('FB12345', 1, 1, '2025-07-01', 'Economy', 4500, 'ravi.k@example.com', '9123456789');

-- Seed PASSENGERS
INSERT INTO passengers (booking_id, title, first_name, last_name, date_of_birth, passport_number)
VALUES 
(1, 'Mr', 'Ravi', 'Kumar', '1990-04-15', 'M1234567');

-- Seed HOTEL BOOKINGS
INSERT INTO hotel_bookings (booking_reference, user_id, hotel_id, room_type_id, check_in, check_out, rooms, total_amount, special_requests)
VALUES 
('HB67890', 2, 2, 2, '2025-07-10', '2025-07-12', 1, 17000, 'Late check-in');

-- Seed PACKAGE BOOKINGS
INSERT INTO package_bookings (booking_reference, user_id, package_id, travel_date, travelers, total_cost)
VALUES 
('PB45678', 1, 1, '2025-08-15', 2, 30000);

-- Seed PAYMENTS
INSERT INTO payments (booking_type, booking_id, payment_method, amount, transaction_id, transaction_status)
VALUES 
('flight', 1, 'Credit Card', 4500, 'TXN001', 'successful'),
('hotel', 1, 'UPI', 17000, 'TXN002', 'successful'),
('package', 1, 'Net Banking', 30000, 'TXN003', 'pending');