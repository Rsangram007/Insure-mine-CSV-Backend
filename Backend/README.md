# Nodejs-Asssessment-InsuredMine Documentation

## Introduction

The InsuredMine project is a backend application developed in Node.js that handles insurance-related data. It provides APIs to upload insurance data from XLSX/CSV files into MongoDB and perform CRUD operations on various collections like User, Account, and Policy.

## Features

- API to upload XLSX/CSV data into MongoDB using worker threads.
- CRUD operations for User, Account, and Policy collections
- Separates data into different MongoDB collections (Agent, User, User's Account, LOB, Carrier, Policy)
- Utilizes MongoDB for efficient storage and retrieval
 

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone : https://github.com/Rsangram007/Insure-mine-CSV-Backend.git
2. Install the required dependencies using npm:
    npm install
3. Start the application using nodemon:
    npm start
## Running the Application
To run the application, ensure you have MongoDB running and properly configured. Also, create a .env file in the root directory (inside 'Backend' folder) with the following details:
 ##
 ```bash
PORT = 3000
MONGODB_ATLAS_URL = 'mongodb+srv://sangram:sangram@sangram.44sfsmu.mongodb.net/BackendInsuremine'
```

### API Documentation
## User Endpoints

### Upload insurance policy data as csv/xlsx

 ```bash
 POST /localhost:3000/api/upload
 ```

### Search a user from db to take policy details
```bash
GET /localhost:3000/api/username?username=Torie Buchanan
```

### Get policy details of a user
```bash
GET /localhost:3000/api/userpolicyinfo?username=Torie Buchanan %26 Glenda Ruiz
```
### Get all users policy details aggregated
```bash
GET /localhost:3000/api/alluserpoliciesinfo
```

```bash
Postman Collection https://documenter.getpostman.com/view/26402935/2sAY518zni
```
