/**
 * Script som populerar databasen med 1000 elsparkcyklar
 */

for (let i = 1; i < 1001; i++) {
    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJhZG1pblVzZXJuYW1lIjoiY2hlZmVuIiwiYWRtaW5MZXZlbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3MDA1NjkxOTMsImV4cCI6MTcwMDU4MzU5M30.V2Yf4NpWtaxwNSbnyRxrVTMwyK0muYtkwYmqAar1L9s");
    myHeaders.append("Content-Type", "application/json");

    const id = i.toString();
    
    var raw = JSON.stringify({
        "password": id
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    await fetch(`http://localhost:1337/scooter/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}