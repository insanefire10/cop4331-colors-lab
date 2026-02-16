# Colors Lab
This application allows users to keep track of a list of colors that they can add to and search.

## Technologies used
This application is built on a LAMP stack
* Linux: Digital Ocean Instance running Ubuntu
* Apache: Apache web server hosts pages and processes PHP logic
* MySQL: Database used to keep track of records
* PHP: Used as main API for adding/searching the DB

## Setup instructions

1. Configure a local Linux system with Apache, PHP and MySQL applications, or subscribe to a preconfigured Digital Ocean LAMP droplet online
2. Install Git and clone the contents of the repo into `/var/www/html` (or optionally download the ZIP directly from this GitHub)
3. Launch the MySQL shell with `mysql -u root -p` and set a secure admin username/password
4. Configure the MySQL DB schema by opening the MySQL shell and copying/pasting the lines from `db.sql`. (Delete this file afterwards to prevent internet users from seeing the schema)
5. In the shell, create a standard MySQL user that the API will use (do NOT use the root user for a production environment, always make a separate MySQL user). You can close the MySQL shell now.
```
Use COP4331;
create user '{API_USERNAME}' identified by '{API_PASSWORD}';
grant all privileges on COP4331.* to '{API_USERNAME}'@'%';
```

6. Create a `db.php` file on the root of the directory with these lines:
```php
<?php
$conn = new mysqli('localhost', API_USERNAME, API_PASSWORD, 'COP4331');
```
7. Restart the server
8. (Only if self-hosting) Configure your infrastructure to make the site publically accessible
