# api-server

REST API server till best-scooter.

## Scripts

### `npm run dev`

Kör servern i development mode.

### `npm test`

Kör all enhetstester med hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Kör ett enskild enhetstest.

### `npm run test:no-reloading`

Kör alla tester utan hot-reloading.

### `npm run lint`

Kör lintern.

### `npm run build`

Bygg projektet för production.

### `npm start`

Kör production-builden (måste vara byggt först).

### `npm start -- --env="name of env file" (default is production).`

Kör production-builden med en annan .env-fil.


## API-referens

- [/customer](#customer)
  - [/customer/{customerId}](#customercustomerid)
  - [/customer/auth](#customerauth)
  - [/customer/token](#customertoken)
- [/admin](#admin)
  - [/admin/{adminId}](#adminadminid)
  - [/admin/token](#admintoken)
- [/scooter](#scooter)
  - [/scooter/{scooterId}](#scooterscooterid)
  - [/scooter/token](#scootertoken)
- [/trip](#trip)
  - [/trip/{tripId}](#triptripid)
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
> ➡️ Request header:
> ```
> X-Access-Token: string <admins>
> ```
> 
> ⬅️ Response body:
> ```javascript
> { data: [
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
> Ta bort alla kunder.
>
> ➡️ Request header:
> ```
> X-Access-Token: string <admins>
> ```

#### /customer/{customerId}

> __GET__
>
> Hämta en kund med id `customerId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   id: number,
>   name: string,
>   email: string,
>   positionX: number,
>   positionY: number,
>   balance: number
> }}
>```

> __POST__
>
> Lägg till kund med id `customerId`. Ange customerId `0` för att få ett automatiskt tilldelat id.
>
> ➡️ Request body:
> ```typescript
> {
>   name: string,
>   email: string
> }
> ```

> __PUT__
>
> Uppdatera kund med id `customerId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
> 
> ➡️ Request body:
> ```typescript
> {
>   name?: string,
>   email?: string,
>   positionX?: number,
>   positionY?: number,
>   balance?: number
> }
> ```

> __DELETE__
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> Ta bort kund med id `customerId`.

#### /customer/auth

> __GET__
>
> Hämtar url för autentisering.
>
> Redirect säger åt Oauth-autentiseringer var användaren ska skickas efter har fått sin `code`. Default: "http://localhost:3000/authcallback". Alla värden förutom default-värdet måste läggas till på en whitelist i GitHubs inställningar för appen.
>
> ➡️ Request query:
> ```typescript
> ?redirectUrl=<string>
> ```
> 
> ⬅️ Response body:
> ```typescript
> { data: {
>   url: string
> }}
> ```

> __POST__
>
> Byter ut `code` från autentiseringen mot en oAuthToken
>
> ➡️ Request body:
> ```typescript
> {
>   code: string
> }
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   oAuthToken: string
> }}
> ```

#### /customer/token

> __POST__
>
> Autentiserar kunden och checkar ut en token, samt visar vad den autentiserade användaren epost-adress är.
>
> ➡️ Request body:
> ```typescript
> {
>   oAuthToken: string
> }
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   token: string,
>   email: string
> }}
> ```

> __DELETE__
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <kunden>
> ```
>
> Sätt ut den aktuella tokenen.

### /admin

> __GET__
>
> Hämta alla admins.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: [
>     {
>       id: number,
>       username: string,
>       level: string
>     },
>     ...
> ]}
> ```

> __DELETE__
>
> Ta bort alla admins
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /admin/{adminId}

> __GET__
>
> Hämta admin med id `adminId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   id: number,
>   username: string,
>   level: string
> }}
> ```

> __POST__
>
> Lägg till admin med id `adminId`. Ange adminId `0` för att få ett automatiskt tilldelat id.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <superadmins>
> ```
> 
> ➡️ Request body:
> ```typescript
> {
>   username: string,
>   password: string,
>   level: string
> }
> ```

> __PUT__
>
> Uppdatera admin med id `adminId`. Enbart superadmins kan ange `level` = `superadmin`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <superadmins|adminen>
> ```
> 
> ➡️ Request body:
> ```typescript
> {
>   username?: string,
>   password?: string,
>   level?: string
> }
> ```

> __DELETE__
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <superadmins>
> ```
>
> Ta bort admin med id `adminId`.

#### /admin/token

> __POST__
>
> Autentiserar admin och checkar ut en token.
>
> ➡️ Request body:
> ```typescript
> {
>   username: string,
>   password: string
> }
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   token: string
> }}
> ```

> __DELETE__
>
> Sätt ut den aktuella tokenen.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <adminen>
> ```

### /scooter

> __GET__
>
> Hämta alla elsparkcyklar.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunder>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: [
>   {
>     id: number,
>     positionX: number,
>     positionY: number,
>     battery: number,
>     maxSpeed: number,
>     status: string,
>     charging: boolean,
>     connected: boolean
>   },
>   ...
> ]}
> ```

> __DELETE__
>
> Ta bort alla elsparkcyklar.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /scooter/{scooterId}

> __GET__
>
> Hämta elsparkcykel med id `scooterId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunder>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   id: number,
>   positionX: number,
>   positionY: number,
>   battery: number,
>   max_speed: number,
>   status: string,
>   charging: boolean,
>   connected: boolean
> }}
> ```

> __POST__
>
> Lägg till ny elsparkcykel med id `scooterId`. Ange scooterId `0` för att få ett automatiskt tilldelat id.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ➡️ Request body:
> ```typescript
> {
>   max_speed: number,
>   status: string,
>   password: string
> }
> ```

> __PUT__
>
> Uppdatera elsparkcykel med id `scooterId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <scootrar>
> ```
> 
> ➡️ Request body:
> ```typescript
> {
>   max_speed?: number,
>   status?: string,
>   positionX?: number,
>   positionY?: number,
>   battery?: number,
>   charging?: boolean,
>   connected?: boolean,
>   password? string
> }
> ```

> __DELETE__
>
> Ta bort elsparkcykel med id `scooterId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /scooter/token

> __POST__
>
> Autentiserar elsparkcykeln och checkar ut en token.
>
> ➡️ Request body:
> ```typescript
> {
>   scooterId: number,
>   password: string
> }
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   token: string
> }}
> ```

> __DELETE__
>
> Sätt ut den aktuella tokenen.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <scootern>
> ```

### /trip

> __GET__
>
> Hämta alla resor.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: [
>   {
>     id: number,
>     customerId: number,
>     scooterId: number,
>     bestParkingZone: number,
>     bestPickupZone: number,
>     parkedCharging: boolean,
>     timeStarted: string,
>     timeEnded: string,
>     distance: number,
>     route: [number, number][],
>     priceInitial: number,
>     priceTime: number,
>     priceDistance: number
>   },
>   ...
> ]}
> ```

> __DELETE__
>
> Ta bort alla resor.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /trip/{tripId}

> __GET__
>
> Hämta resa med id `tripId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   id: number,
>   customerId: number,
>   scooterId: number,
>   bestParkingZone: number,
>   bestPickupZone: number,
>   parkedCharging: boolean,
>   timeStarted: string,
>   timeEnded: string,
>   distance: number,
>   route: [number, number][],
>   priceInitial: number,
>   priceTime: number,
>   priceDistance: number
> }}
> ```

> __POST__
>
> Lägg till ny resa med id `tripId`. Ange tripId `0` för att få ett automatiskt tilldelat id.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> ➡️ Request body:
> ```typescript
> {
>   customerId: number,
>   scooterId: number,
>   bestPickupZone: number,
>   startPosition: [number, number],
>   priceInitial: number,
>   priceTime: number,
>   priceDistance: number
> }
> ```

> __PUT__
>
> Uppdatera trip med id `tripId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> ⬅️ Request body:
> 
> `routeAppend` lägger till nya punkter till resans rutt, `route` ersätter hela resans rutt.
>
> > [!WARNING]
> > Använd inte `routeAppend` och `route` i samma PUT, det kan få oförutsedda resultat.
> 
> ```typescript
> {
>   bestParkingZone?: number,
>   parkedCharging?: boolean,
>   timeEnded?: string,
>   distance?: number,
>   route?: [number, number][],
>   routeAppend?: [number, number][]
> }
> ```

> __DELETE__
>
> Ta bort resa med id `tripId`.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ``` 

### /zone

> __GET__
>
> Hämta alla zoner.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunder>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: [
>   {
>     id: number,
>     type: string,
>     area: [number, number][],
>     colour: string,
>     name: string,
>     description: string,
>     parkingValue: number
>   },
>   ...
> ]}
> ```

> __DELETE__
>
> Ta bort alla zoner.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /zone/{zoneId}

> __GET__
>
> Hämta zon med id `zoneId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunder>
> ```

> __POST__
>
> Lägg till zon med id `zoneId`. Ange zoneId 0 för att få ett automatiskt tilldelat id.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
> 
> ⬅️ Response body:
> ```typescript
> { data: {
>   type: string,
>   area: [number, number][],
>   colour: string,
>   name: string,
>   description: string,
>   parkingValue: number
> }}
> ```

> __PUT__
>
> Uppdatera zon med id `zoneId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
> 
> ➡️ Request body:
> ```typescript
> {
>   type?: string,
>   area?: [number, number][],
>   colour?: string,
>   name?: string,
>   description?: string,
>   parkingValue?: number
> }
> ```

> __DELETE__
> 
> Ta bort zon med id `zoneId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

### /parking

Representerar en cykels parkering på en zon. Om en cykel är parkerad i flera zoner kommer cykeln ha många rader i datasetet.

> __GET__
>
> Hämta alla parkeringar.
>
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: [
>   {
>     customerId: number,
>     scooterId: number
>   },
>   ...
> ]}
> ```

> __DELETE__
>
> Ta bort alla parkeringar.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /parking/{parkingId}

> __GET__
>
> Hämta parkering med id `parkingId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
> ```typescript
> { data: {
>   customerId: number,
>   scooterId: number
> }}
> ```

> DELETE Ta bort parkering med id `parkingId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /parking/zone/{zoneId}

>  __GET__
>
> Hämta alla parkeringar i zon med id `zoneId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
>
> Se [/parking](#parking)

> __DELETE__
>
> Ta bort alla parkeringar i zon med id `zoneId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```

#### /parking/scooter/{scooterId}

> __GET__
>
> Hämta alla parkeringar för cykel med id `scooterId`.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins>
> ```
>
> ⬅️ Response body:
>
> Se [/parking](#parking)

> __POST__
>
> Lägg till parkeringar för cykeln med id `scooterId` i alla aktuella zoner.
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```

> __DELETE__
> 
> ➡️ Request header:
> ```typescript
> X-Access-Token: string <admins|kunden>
> ```
>
> Ta bort alla parkeringar för cykel med id `scooterId`.

## Om

Projektet genererades med hjälp av [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).
