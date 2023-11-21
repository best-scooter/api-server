/**
 * Script som populerar databasen med 1000 kunder
 */

for (let i = 1; i < 1001; i++) {
    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJhZG1pblVzZXJuYW1lIjoiY2hlZmVuIiwiYWRtaW5MZXZlbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3MDA1NjkxOTMsImV4cCI6MTcwMDU4MzU5M30.V2Yf4NpWtaxwNSbnyRxrVTMwyK0muYtkwYmqAar1L9s");
    myHeaders.append("Content-Type", "application/json");

    const id = i.toString();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
        "email": `customer${id}@test.com`,
        "customerName": `Customer ${id}`
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    await fetch(`http://localhost:1337/customer/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}