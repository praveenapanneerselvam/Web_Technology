var http = require('http');
var url = require('url');
var querystring = require('querystring');

function onRequest(req, res) {
  var path = url.parse(req.url).pathname;
  console.log('Request for ' + path + ' received');
  
  var query = url.parse(req.url).query;
  console.log(query);
  var params = querystring.parse(query);
  var  username = params["username"];
  var rollnum= params["rollnum"];
  var year = params["year"];
  var gender = params["gender"];
  var branch = params["branch"];
  var mobileNo = params["phno"];
  var address = params["address"]

  // HTML content for displaying the message in a table
  var htmlResponse = `
    <html>
    <head>
    <title> Details</title>
    <style>
      table 
      {
        font-family: Arial, sans-serif;
        border-collapse: collapse;
        width: 50%;
        margin: 20px auto;
        border: 1px solid black;
      }
      body
      {
        background-color:beige;
      }
      h2
      {
        text-align:center;
      }
      td, th
       {
        border: 1px solid black;
        text-align: left;
        padding: 8px;
      }
      th 
      {
        background-color: skyblue;
      }
    </style>
    </head>
    <body>
    <h2>Details(get)</h2>
    <table>
      <tr>
        <th>Field</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>NAME</td>
        <td>${username}</td>
      </tr>
      <tr>
        <td>ROLL NUM</td>
        <td>${rollnum}</td>
      </tr>
      <tr>
        <td>YEAR</td>
        <td>${year}</td>
      </tr>
      <tr>
        <td>GENDER</td>
        <td>${gender}</td>
      </tr>
      <tr>
        <td>BRANCH</td>
        <td>${branch}</td>
      </tr>
      <tr>
        <td>MOBILE</td>
        <td>${mobileNo}</td>
      </tr>
      <tr>
        <td>ADDRESS</td>
        <td>${address}</td>
      </tr>
    </table>
    </body>
    </html>
  `;
  
  // Write the HTML response
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(htmlResponse);
  res.end();
}

http.createServer(onRequest).listen(8000);
console.log('Server is running...');

