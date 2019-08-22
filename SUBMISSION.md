# Create database & user

1. **Install postgres**
   Mac: brew install postgresql
   Windows: _YIKES_

2. **Create db**
   In terminal run:

   > createdb flight-routes

3. **Create user with full access priveleges**
   From either a database client like Postico, or from command line using /psql:
   i. CREATE USER "flight-routes" WITH ENCRYPTED PASSWORD '1234';
   ii. GRANT ALL PRIVIELEGES ON DATABASE "flight-routes" TO "flight-routes";

4. **Maybe get Postico at this point**
   https://eggerapps.at/postico/

5. **Install dependencies**
   npm install

6. **Create Schema**
   sequelize db:migrate

7. **Add seed data**
   sequelize db:seed:all

8. **See if server is working**
   npm run server

9. **Run tests**
   i. kill the server
   ii. npm run test (34 tests should pass)

10. **Test routes**
    i. restart server -- npm run server

###Working Routes
Toronto -> Los Angeles
<http://localhost:5500/api/flights?origin=yyz&destination=lax>
"YYZ -> JFK -> LAX"

### ON Heroku

<https://jw-flight-routes.herokuapp.com/api/flights?origin=yyz&destination=lax>

### No Route

<https://jw-flight-routes.herokuapp.com/api/flights?origin=yyz&destination=ord>
