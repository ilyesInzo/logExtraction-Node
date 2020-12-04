


#  ANOMALY DETECTION - LOCAL TEST

The main goal is allow local tests by using sqlite db and the default CDS server.js to display changes instantly.

## SQLITE DB CONNECTION

#### 1- Generate the sqlite.db 

Run the following command : cds deploy --to sqlite 

P.S. this will update the package.json file -> so revert those changes.

#### 1- Add connection to sqlite

Like what was done with HANA connection, we will add sqlite connection section in the connection in setting.json 

* file > settings > open Preferences

![](images/goto_to_settings.PNG)

* open setting.json under workspace

![](images/edit_setting.PNG)

* add connection pool

![](images/add_db_connection.PNG)

now we are able to connect to our local db

![](images/connect_to_db.PNG)

## Local test

#### 1- Envirement variable set

create a .env file and add your credentials to be able to get logs from kibana later


![](images/add_credentials.PNG)

P.S. CDS_RUN_DEFAULT=true will allow us to run the default server.js and use cds watch later

#### 2- runnig the application

* in the root folder run the commande: npm install

* then run the commande: cds watch

the port is exposed, you can run open and run the app

![](images/running_app_console.PNG)

![](images/running_app.PNG)

when testings the logs you have to enter another credentials (not yours) that belongs to fake users allowed (have different scopes and roles) to access services.

![](images/enter_local_user_credentials.PNG)

you can find those credentials in the .cdsrc.json file (e.g user alice and pw 123)

![](images/check_credential_to_access_services.PNG)


