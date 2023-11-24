import { populateDatabaseCustomers } from "./populateDatabaseCustomers.mjs";
import { populateDatabaseScooters } from "./populateDatabaseScooters.mjs";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
    method: 'POST',
    headers: myHeaders
};

let token;

await fetch(`http://localhost:1337/admin/setup`, requestOptions)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((result) => {
        console.log(result)
        token = result.data.token
        populateDatabaseCustomers(token);
        populateDatabaseScooters(token);
    })
    .catch(error => console.log('error', error));
