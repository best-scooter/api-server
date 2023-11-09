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

### /customer {#customer}

GET, DELETE

#### /customer/{customerId} {#customer-one}

GET, POST, PUT, DELETE

#### /customer/login {#customer-login}

GET, POST, DELETE

### /admin {#admin}

GET, DELETE

#### /admin/{adminId} {#admin-one}

GET, POST, PUT, DELETE

#### /admin/login {#admin-login}

GET, POST, DELETE

### /trip {#trip}

GET, DELETE

#### /trip/{tripId} {#trip-one}

GET, POST, PUT, DELETE

### /scooter {#scooter}

GET, DELETE

#### /scooter/{scooterId} {#scooter-one}

GET, POST, PUT, DELETE

### /zone {#zone}

GET, DELETE

#### /zone/{zoneId} {#zone-one}

GET, POST, PUT, DELETE

### /parking {#parking}

GET, DELETE

#### /parking/{parkingId} {#parking-one}

POST, DELETE

#### /parking/zone/{zoneId} {#parking-zone}

GET

#### /parking/scooter/{scooterId} {#parking-scooter}

GET, DELETE
