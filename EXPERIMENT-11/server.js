const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/'; // Replace 'localhost' and '27017' with your MongoDB server details
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    const query = url.parse(req.url).query;
    const params = querystring.parse(query);
    const customername = params["customername"];
    const appointmentEmail = params["appointmentEmail"];
    const appointmentDate = params["appointmentDate"];
    const appointmentTime = params["appointmentTime"];
    const appointmentReason = params["appointmentReason"];

    if (req.url.includes("/insert")) {
        await insertData(req, res, customername, appointmentEmail, appointmentDate, appointmentTime, appointmentReason, params);
    } else if (req.url.includes("/delete")) {
        await deleteData(req, res, appointmentEmail);
    } else if (req.url.includes("/update")) {
        await updateData(req, res, appointmentEmail, appointmentDate, appointmentTime);
    } else if (req.url.includes("/display")) {
        await displayTable(req, res);
    }
}

async function insertData(req, res, customername, appointmentEmail, appointmentDate, appointmentTime, appointmentReason, params) {
    try {
        const database = client.db('appointment'); // Replace 'appointment' with your actual database name
        const collection = database.collection('appointments');

        const appointment = {
            customername,
            appointmentEmail,
            appointmentDate,
            appointmentTime,
            appointmentReason
        };

        if (appointmentReason === 'passport') {
            appointment.passportNumber = params["passportNumber"];
            appointment.nationality = params["nationality"];
            appointment.dob = params["dob"];
        } else if (appointmentReason === 'license') {
            appointment.licenseNumber = params["licenseNumber"];
            appointment.licenseType = params["licenseType"];
            appointment.issuingState = params["issuingState"];
        }

        await collection.insertOne(appointment);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h2>Data Inserted</h2>');
        res.write('<p>Inserted Data:</p>');
        res.write('<table border="1"><tr><th>Name</th><th>Email</th><th>Date</th><th>Time</th><th>Reason</th><th>Additional Info</th></tr>');
        res.write(`<tr>
            <td>${customername}</td>
            <td>${appointmentEmail}</td>
            <td>${appointmentDate}</td>
            <td>${appointmentTime}</td>
            <td>${appointmentReason}</td>
            <td>${appointmentReason === 'passport' ? `Passport Number: ${appointment.passportNumber}, Nationality: ${appointment.nationality}, DOB: ${appointment.dob}` : `License Number: ${appointment.licenseNumber}, Type: ${appointment.licenseType}, Issuing State: ${appointment.issuingState}`}</td>
        </tr>`);
        res.write('</table>');
        res.end();
    } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('Internal Server Error');
        res.end();
    }
}

async function deleteData(req, res, appointmentEmail) {
    try {
        const database = client.db('appointment'); // Replace 'appointment' with your actual database name
        const collection = database.collection('appointments');

        await collection.deleteOne({ appointmentEmail });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('Data Deleted');
        res.end();
    } catch (error) {
        console.error('Error deleting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('Internal Server Error');
        res.end();
    }
}

async function updateData(req, res, appointmentEmail, appointmentDate, appointmentTime) {
    try {
        const database = client.db('appointment'); // Replace 'appointment' with your actual database name
        const collection = database.collection('appointments');

        await collection.updateOne(
            { appointmentEmail },
            { $set: { appointmentDate, appointmentTime } }
        );
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('Data Updated');
        res.end();
    } catch (error) {
        console.error('Error updating data:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('Internal Server Error');
        res.end();
    }
}

async function displayTable(req, res) {
    try {
        const database = client.db('appointment'); // Replace 'appointment' with your actual database name
        const collection = database.collection('appointments');

        const appointments = await collection.find().toArray();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h2>Appointments Table</h2>');
        res.write('<table border="1"><tr><th>Name</th><th>Email</th><th>Date</th><th>Time</th><th>Reason</th><th>Additional Info</th></tr>');

        appointments.forEach(appointment => {
            res.write(`<tr>
                <td>${appointment.customername}</td>
                <td>${appointment.appointmentEmail}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.appointmentTime}</td>
                <td>${appointment.appointmentReason}</td>
                <td>${appointment.appointmentReason === 'passport' ? `Passport Number: ${appointment.passportNumber}, Nationality: ${appointment.nationality}, DOB: ${appointment.dob}` : `License Number: ${appointment.licenseNumber}, Type: ${appointment.licenseType}, Issuing State: ${appointment.issuingState}`}</td>
            </tr>`);
        });

        res.write('</table>');
        res.end();
    } catch (error) {
        console.error('Error displaying data:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('Internal Server Error');
        res.end();
    }
}

const server = http.createServer(onRequest);
server.listen(8050);
console.log('Server has started and is listening on port 8050');
