# api-server

REST API server for best-scooter.

## API reference

- [/customer](#customer)
  - [/customer/{customerId}](#customercustomerid)
  - [/customer/login](#customerlogin)
- [/admin](#admin)
  - [/admin/{adminId}](#adminadminid)
  - [/admin/login](#adminlogin)
- [/trip](#trip)
  - [/trip/{tripId}](#triptripid)
- [/scooter](#scooter)
  - [/scooter/{scooterId}](#scooternscooterid)
- [/zone](#zone)
  - [/zone/{zoneId}](#zonezoneid)
- [/parking](#parking)
  - [/parking/{parkingId}](#parkingparkingid)
  - [/parking/zone/{zoneId}](#parkingzonezoneid)
  - [/parking/scooter/{scooterId}](#parkingscooterscooterid)

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
