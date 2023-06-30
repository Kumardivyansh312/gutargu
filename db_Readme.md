\*\*\* Creating Database

- Install Postgres in your system
- Add postgres path in .zsrch in home for postgres
  export PATH=/usr/local/share/npm/bin:$PATH
  export PATH=/Library/PostgreSQL/15/bin:$PATH

- Then open Terminal and run
  > psql postgres <USERNAME>
  > current user is :-postgres
  > current user password:- 123456
  > This will start postgres in terminal
- Then check how many databases are present
  alter user postgres password 'admin@123';

  > \l
  > Then open ui for postgres and start the service

- Create new database than

  > CREATE DATABASE <database_name>

- Now start using the database

  > \c <database_name>

- Now You can crete table and do your operations in your database

\*\*\* Notes

- to clear the terminal

  > \! clear for mac \! cls for other

  ----- Dummy user
  {

  "Sab ka password yahi hai ": "123456",

}
