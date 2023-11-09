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

> __GET__
>
> Hämta alla kunder.
>
> _Request header:_
> ```
> X-Access-Token: [admins]
> ```
> 
> _Response body:_
> ```javascript
> {[
>   {
>     id: number,
>     name: string,
>     email: string,
>     password: string,
>     positionX: number,
>     positionY: number,
>     balance: number    
>   }
>   ...
> ]}
>```

> __DELETE__
>
> _Request header:_
> ```
> X-Access-Token: [admin]
> ```
>
> Ta bort alla kunder.

Enbart admins

#### /customer/{customerId}

> __GET__
>
> Hämta en kund med id `customerId`.
>
> _Request header:_
> ```typescript
> X-Access-Token: [admins|kunden]
> ```
>
> _Response body:_
> ```typescript
> {
>   id: number,
>   name: string,
>   email: string,
>   password: string,
>   positionX: number,
>   positionY: number,
>   balance: number    
> }
>```

> __POST__
>
> _Request body:_
> ```typescript
> {
>   name: string,
>   email: string,
>   password: string
> }
> ```
>
> Lägg till kund med id `customerId`. Ange customerId `0` för att få ett automatiskt tilldelat id.

> __PUT__
>
> 
> Uppdatera kund med id `customerId`.
>
> _Request header:_
> ```typescript
> X-Access-Token: [admins|kunden själv]
> ```
> 
> _Request body:_
> ```typescript
> {
>   name?: string,
>   email?: string,
>   password?: string,
>   positionX?: number,
>   positionY?: number,
>   balance?: number
> }
> ```

> __DELETE__
>
> _Response header:_
> ```typescript
> X-Access-Token: [admins|kunden]
> ```
>
> Ta bort kund med id `customerId`.

#### /customer/token

> __GET__
>
> Autentiserar kunden och checkar ut en token.
>
> _Request body:_
> ```typescript
> {
>   email: string,
>   password: string
> }
> ```
>
> _Response body:_
> ```typescript
> {
>   token: string
> }
> ```

> __DELETE__
>
> _Response header:_
> ```typescript
> X-Access-Token: [kunden]
> ```
>
> Sätt ut den aktuella tokenen.

### /admin

> GET
>
> Hämta alla admins. Enbart admins.

> DELETE Ta bort alla admins

#### /admin/{adminId}

> GET Hämta admin med id `adminId`.

> POST Lägg till admin med id `adminId`. Ange adminId `0` för att få ett automatiskt tilldelat id.

> PUT Uppdatera admin med id `adminId`. Förutom adminId är de andra fälten optionella.

> DELETE Ta bort admin med id `adminId`.

#### /admin/token

> GET Autentiserar admin och checkar ut en token.

> DELETE Sätt ut den aktuella tokenen.

### /trip

> GET Hämta alla resor.

> DELETE Ta bort alla resor.

#### /trip/{tripId}

> GET Hämta resa med id `tripId`.

> POST Lägg till ny resa med id `tripId`. Ange tripId `0` för att få ett automatiskt tilldelat id.

> PUT Uppdatera trip med id `tripId`. Förutom adminId är de andra fälten optionella.

> DELETE Ta bort resa med id `tripId`.

### /scooter

> GET Hämta alla elsparkcyklar.

> DELETE Ta bort alla elsparkcyklar.

#### /scooter/{scooterId}

> GET Hämta elsparkcykel med id `scooterId`.

> POST Lägg till ny elsparkcykel med id `scooterId`. Ange scooterId `0` för att få ett automatiskt tilldelat id.

> PUT Uppdatera elsparkcykel med id `scooterId`. Förutom scooterId är de andra fälten optionella.

> DELETE Ta bort elsparkcykel med id `scooterId`.

### /zone

> GET Hämta alla zoner.

> DELETE Ta bort alla zoner.

#### /zone/{zoneId}

> GET Hämta zon med id `zoneId`.

> POST Lägg till zon med id `zoneId`. Ange zoneId 0 för att få ett automatiskt tilldelat id.

> PUT Uppdatera zon med id `zoneId`. Förutom zoneId är de andra fälten optionella.

> DELETE Ta bort zon med id `zoneId`.

### /parking

Representerar en cykels parkering på en zon. Om en cykel är parkerad i flera zoner kommer cykeln ha många rader i datasetet.

> GET Hämta alla parkeringar.

> DELETE Ta bort alla parkeringar.

#### /parking/{parkingId}

> GET Hämta parkering med id `parkingId`.

> DELETE Ta bort parkering med id `parkingId`.

#### /parking/zone/{zoneId}

> GET Hämta alla parkeringar i zon med id `zoneId`.

> DELETE Ta bort alla parkeringar i zon med id `zoneId`.

#### /parking/scooter/{scooterId}

> GET Hämta alla parkeringar för cykel med id `scooterId`.

> POST Lägg till parkeringar för cykeln med id `scooterId` i alla aktuella zoner.

> DELETE Ta bort alla parkeringar för cykel med id `scooterId`.
