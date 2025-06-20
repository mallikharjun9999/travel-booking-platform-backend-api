# Travel Booking Platform API Documentation

**Created by:** Penugonda Mallikharjunarao

## 🌍 Overview

The Travel Booking Platform API is a comprehensive backend service for managing travel bookings including flights, hotels, and holiday packages. Built with Node.js and Express, it provides secure authentication, booking management, and payment processing capabilities.

**Base URL:** `http://localhost:4000`  
**API Version:** v1  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- SQLite3

### How to Clone and Run the API

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd travel-booking-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   ```

4. **Initialize the database:**
   ```bash
   node ./src/config/init.mjs
   ```
  **if you got error like (❌ Error during DB initialization: SQLITE_ERROR: table users already exists), that means already your db intialized**


5. **Start the server by running below command :**
``` node ./src/app.js ```

The API will be running at `http://localhost:4000`

### Base URL
```
http://localhost:4000/api
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### 🔑 Authentication

#### Register User
- **POST** `/api/auth/register`
- **Description:** Register a new user account
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "phone": "9876543210",
  "date_of_birth": "1990-01-01",
  "passport_number": "P1234567"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```
- **Error Responses:**
  - `400`: Missing required fields
  - `409`: Email already exists

#### Login User
- **POST** `/api/auth/login`
- **Description:** Authenticate user and receive JWT token
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
}
```
- **Error Responses:**
  - `400`: Missing email or password
  - `401`: Invalid credentials

### ✈️ Flights

#### Search Flights
- **POST** `/api/flights/search`
- **Description:** Search for available flights
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "from": "DEL",
  "to": "BOM",
  "departDate": "2025-07-01"
}
```
- **Response (200):**
```json
{
    "success": true,
    "flights": [
        {
            "id": 1,
            "flight_number": "6E203",
            "airline_id": 1,
            "source_airport_id": 1,
            "destination_airport_id": 2,
            "aircraft_type": "Airbus A320",
            "departure_time": "2025-07-01 09:00",
            "arrival_time": "2025-07-01 11:15",
            "base_price": 4500,
            "total_seats": 180,
            "available_seats": 178,
            "airline_name": "IndiGo",
            "source_code": "DEL",
            "source_city": "Delhi",
            "dest_code": "BOM",
            "dest_city": "Mumbai"
        }
    ]
}
```

#### Get Flight Details
- **GET** `/api/flights/:id`
- **Description:** Get detailed information about a specific flight
- **Parameters:** 
  - `id` (path): Flight ID
- **Response (200):**
```json
{
    "success": true,
    "flight": {
        "id": 1,
        "flight_number": "6E203",
        "airline_id": 1,
        "source_airport_id": 1,
        "destination_airport_id": 2,
        "aircraft_type": "Airbus A320",
        "departure_time": "2025-07-01 09:00",
        "arrival_time": "2025-07-01 11:15",
        "base_price": 4500,
        "total_seats": 180,
        "available_seats": 178,
        "airline_name": "IndiGo",
        "source_code": "DEL",
        "source_city": "Delhi",
        "dest_code": "BOM",
        "dest_city": "Mumbai"
    }
}
```
-----

### 🏨 Hotels

#### Search Hotels
- **POST** `/api/hotels/search`
- **Description:** Search for available hotels
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "city": "Delhi",
  "rooms": 1,
  "adults": 2,
  "minPrice": 3000,
  "maxPrice": 10000,
  "starRating": 5
}
```
- **Response (200):**
```json
{
  "success": true,
  "hotels": [
    {
      "id": 1,
      "name": "The Leela Palace",
      "location": "Delhi",
      "star_rating": 5,
      "amenities": "WiFi,Pool,Spa,Gym",
      "check_in_time": "14:00",
      "check_out_time": "12:00",
      "rooms": [
        {
          "room_type": "Deluxe Room",
          "price_per_night": 6000,
          "max_occupancy": 2,
          "available_quantity": 10
        }
      ]
    }
  ]
}
```

#### Get Hotel Details
- **GET** `/api/hotels/:id`
- **Description:** Get detailed information about a specific hotel
- **Parameters:** 
  - `id` (path): Hotel ID
- **Response (200):**
```json
{
  "success": true,
  "hotel": {
    "id": 1,
    "name": "The Leela Palace",
    "location": "Delhi",
    "star_rating": 5,
    "amenities": "WiFi,Pool,Spa,Gym",
    "check_in_time": "14:00",
    "check_out_time": "12:00",
    "images": "leela.jpg",
    "rooms": [
      {
        "id": 1,
        "room_type": "Deluxe Room",
        "price_per_night": 6000,
        "max_occupancy": 2,
        "available_quantity": 10,
        "amenities": "AC,TV,Mini Bar"
      }
    ]
  }
}
```

### 🎒 Holiday Packages

#### Search Packages
- **POST** `/api/packages/search`
- **Description:** Search for available holiday packages
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "destination": "Delhi",
  "duration": 5,
  "maxPrice": 20000,
  "groupSize": 4
}
```
- **Response (200):**
```json
{
  "success": true,
  "packages": [
    {
      "id": 1,
      "name": "Golden Triangle Tour",
      "duration_days": 5,
      "duration_nights": 4,
      "destinations": "Delhi,Agra,Jaipur",
      "inclusions": "Hotel,Transport,Guide,Breakfast",
      "price_per_person": 15000,
      "max_group_size": 20,
      "highlights": "Taj Mahal, Amber Fort, Red Fort"
    }
  ]
}
```

#### Get Package Details
- **GET** `/api/packages/:id`
- **Description:** Get detailed information about a specific package
- **Parameters:** 
  - `id` (path): Package ID
- **Response (200):**
```json
{
  "success": true,
  "package": {
    "id": 1,
    "name": "Golden Triangle Tour",
    "duration_days": 5,
    "duration_nights": 4,
    "destinations": "Delhi,Agra,Jaipur",
    "inclusions": "Hotel,Transport,Guide,Breakfast",
    "price_per_person": 15000,
    "max_group_size": 20,
    "highlights": "Taj Mahal, Amber Fort, Red Fort",
    "images": "goldentriangle.jpg"
  }
}
```

#### Book Package
- **POST** `/api/packages/book`
- **Description:** Book a holiday package (requires authentication)
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "packageId": 1,
  "travelDate": "2025-08-15",
  "travelers": 2
}
```
- **Response (201):**
```json
{
    "success": true,
    "bookingId": 2,
    "bookingReference": "PKG-c515177c-b1f1-4ef8-91c0-75bce3dfcdfc",
    "totalCost": 30000
}
```
-----

### 💳 Payments

#### Initiate Payment
- **POST** `/api/payments/initiate`
- **Description:** Initiate payment for a booking
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "bookingType": "flight",
  "bookingId": 1,
  "paymentMethod": "Credit Card"
}
```
- **Response (200):**
```json
{
    "success": true,
    "transactionId": "TXN-74ccc683-e1f8-401b-bdac-bcbecc4629be",
    "amount": 4500,
    "paymentUrl": "https://dummy-payment-gateway.example.com/pay?txn=TXN-74ccc683-e1f8-401b-bdac-bcbecc4629be",
    "paymentId": 5
}
```

#### Confirm Payment
- **POST** `/api/payments/confirm`
- **Description:** Confirm payment completion
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Request Body:**
```json
{
    "transactionId": "TXN-74ccc683-e1f8-401b-bdac-bcbecc4629be" 
}
```
- **Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

## 📋 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## 🔒 Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in Indian Rupees (INR)
- Authentication tokens expire after 24 hours
- Database uses SQLite for development

## 🛠️ Development

To access the endpoints during development:

1. Start the server: `node index.js`
2. Use tools like Postman, curl, or any HTTP client
3. Base URL: `http://localhost:4000/api`

### Example curl request:
```bash
# Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "phone": "9876543210",
    "date_of_birth": "1990-01-01",
    "passport_number": "P1234567"
  }'
```

---

**Created by:** Penugonda Mallikharjunarao  
**Last Updated:** June
