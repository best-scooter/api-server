# api-server

REST API server for best-scooter.

## API reference

- [/customer](#customer)
  - [/customer/{customerId}](#customer-one)
  - [/customer/login](#customer-login)
- [/admin](#admin)
  - [/admin/{adminId}](#admin-one)
  - [/admin/login](#admin-login)
- [/trip](#trip)
  - [/trip/{tripId}](#trip-one)
- [/scooter](#scooter)
  - [/scooter/{scooterId}](#scooter-one)
- [/zone](#zone)
  - [/zone/{zoneId}](#zone-one)
- [/parking](#parking)
  - [/parking/{parkingId}](#parking-one)
  - [/parking/zone/{zoneId}](#parking-zone)
  - [/parking/scooter/{zoneId}](#parking-scooter)

### /customer

GET, DELETE

#### /customer/{customerId}

GET, POST, PUT, DELETE

#### /customer/login

GET, POST, DELETE

### /admin

GET, DELETE

#### /admin/{adminId}

GET, POST, PUT, DELETE

#### /admin/login

GET, POST, DELETE

### /trip

GET, DELETE

#### /trip/{tripId}

GET, POST, PUT, DELETE

### /scooter

GET, DELETE

#### /scooter/{scooterId}

GET, POST, PUT, DELETE

### /zone

GET, DELETE

#### /zone/{zoneId} {#zone-one}

GET, POST, PUT, DELETE

### /parking

GET, DELETE

#### /parking/{parkingId}

POST, DELETE

#### /parking/zone/{zoneId}

GET

#### /parking/scooter/{scooterId}

GET, DELETE
