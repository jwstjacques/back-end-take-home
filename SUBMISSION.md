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
