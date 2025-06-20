-- =========================
-- Travel Booking Platform
-- SQLite Schema
-- =========================

-- USERS
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT,
    passport_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AIRLINES
CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    iata_code TEXT UNIQUE NOT NULL
);

-- AIRPORTS
CREATE TABLE airports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL
);

-- FLIGHTS
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    source_airport_id INTEGER NOT NULL,
    destination_airport_id INTEGER NOT NULL,
    aircraft_type TEXT,
    departure_time TEXT,
    arrival_time TEXT,
    base_price INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (source_airport_id) REFERENCES airports(id),
    FOREIGN KEY (destination_airport_id) REFERENCES airports(id)
);

-- HOTELS
CREATE TABLE hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    star_rating INTEGER,
    amenities TEXT,
    check_in_time TEXT,
    check_out_time TEXT,
    images TEXT,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0
);

-- HOTEL ROOMS
CREATE TABLE hotel_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    room_type TEXT NOT NULL,
    price_per_night INTEGER NOT NULL,
    max_occupancy INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    amenities TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- HOLIDAY PACKAGES
CREATE TABLE holiday_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration_days INTEGER,
    duration_nights INTEGER,
    destinations TEXT,
    inclusions TEXT,
    price_per_person INTEGER,
    max_group_size INTEGER,
    highlights TEXT,
    images TEXT
);

-- FLIGHT BOOKINGS
CREATE TABLE flight_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    flight_id INTEGER NOT NULL,
    journey_date TEXT NOT NULL,
    travel_class TEXT,
    total_fare INTEGER NOT NULL,
    status TEXT DEFAULT 'booked',
    contact_email TEXT,
    contact_phone TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

-- PASSENGERS
CREATE TABLE passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    title TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    passport_number TEXT,
    FOREIGN KEY (booking_id) REFERENCES flight_bookings(id) ON DELETE CASCADE
);

-- HOTEL BOOKINGS
CREATE TABLE hotel_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    room_type_id INTEGER NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    rooms INTEGER,
    total_amount INTEGER NOT NULL,
    booking_status TEXT DEFAULT 'booked',
    special_requests TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_type_id) REFERENCES hotel_rooms(id)
);

-- PACKAGE BOOKINGS
CREATE TABLE package_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    travel_date TEXT NOT NULL,
    travelers INTEGER NOT NULL,
    total_cost INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES holiday_packages(id)
);

-- PAYMENTS
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_type TEXT NOT NULL, -- flight/hotel/package
    booking_id INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    amount INTEGER NOT NULL,
    transaction_id TEXT UNIQUE,
    transaction_status TEXT DEFAULT 'pending',
    transaction_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
