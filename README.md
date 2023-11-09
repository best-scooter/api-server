# api-server

REST API server till best-scooter.

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
  - [/scooter/{scooterId}](#scooterscooterid)
- [/zone](#zone)
  - [/zone/{zoneId}](#zonezoneid)
- [/parking](#parking)
  - [/parking/{parkingId}](#parkingparkingid)
  - [/parking/zone/{zoneId}](#parkingzonezoneid)
  - [/parking/scooter/{scooterId}](#parkingscooterscooterid)

### /customer

> GET Hämta alla kunder

> DELETE Ta bort alla kunder

#### /customer/{customerId}

> GET Hämta en kund med id `customerId`

> POST Lägg till kund med id `customerId`. Ange customerId `0` för att få ett automatiskt tilldelat id.

> PUT Uppdatera kund med id `customerId`. Förutom customerId är de andra fälten optionella.

> DELETE Ta bort kund med id `customerId`.

#### /customer/login

> GET Autentiserar användaren och checkar ut en token.

> DELETE Sätt ut den utcheckade tokenen.

### /admin

> GET Hämta alla admins

> DELETE Ta bort alla admins

#### /admin/{adminId}

> GET Hämta admin med id `adminId`.

> POST Lägg till admin med id `adminId`. Ange adminId `0` för att få ett automatiskt tilldelat id.

> PUT Uppdatera admin med id `adminId`. Förutom adminId är de andra fälten optionella.

> DELETE Ta bort admin med id `adminId`.

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

#### /zone/{zoneId}

GET, POST, PUT, DELETE

### /parking

GET, DELETE

#### /parking/{parkingId}

POST, DELETE

#### /parking/zone/{zoneId}

GET

#### /parking/scooter/{scooterId}

GET, DELETE
