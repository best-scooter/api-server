/**
 * Script som populerar databasen med 1000 kunder
 */

export async function populateDatabaseCustomers(token) {
    await fetch(`http://localhost:1337/customer`, {
        method: 'DELETE',
        headers: {
            "X-Access-Token": token,
            "Content-Type": "application/json"
        }
    }).then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    for (let i = 1; i < 10001; i++) {
        var myHeaders = new Headers();
        myHeaders.append("X-Access-Token", token);
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
};