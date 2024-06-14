var http = require('http');
var querystring = require('querystring');

function onRequest(req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      var params = querystring.parse(body);
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
    <title> Details1</title>
    <style>
      table 
      {
        font-family: Arial, sans-serif;
        border-collapse: collapse;
        width: 50%;
        margin: 20px auto;
      }
      body
      {
        background-color:#ffb3b3;
      }
      h2
      {
        text-align:center;
      }
      td, th
       {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      th 
      {
        background-color: #ff00bf;
      }
    </style>
    </head>
    <body>
    <h2>Details(post)</h2>
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
        <td>MOBILE NUM</td>
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
    });
  } else {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('Method not allowed');
  }
}

http.createServer(onRequest).listen(8060);
console.log('Server is running...');
