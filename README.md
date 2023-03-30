# Group-A-social-media-project
OAMK project for social media app

# Create Local Database.

Download and install postgresQL
For local server set: 
password: `postgrespw`
User: `postgres`
host: `localhost`
port: 5432 // this is default postgres port

create new database with name `twitter`
open query tool in the database and run `001_db.sql` content and all the other migrations files in order.

# Initialize server

Clone this repository.
Navigate to `/server`.
Run `npm install` to get you node_modules
Run `npm run devStart` to start the server.
Server should be running on localhost:3001

Make sure that you postgres database is running.
On VS Code install the extension `Rest client`.

Go to `client.rest` and test the GET api.
