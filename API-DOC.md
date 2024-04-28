## Models :

_User_

- Id: integer (primary key)
- username: string (validation: required, unique)
- password: string (validation: required, minimum length 5), need to be hashed
- balance: decimal (12,2)

_Fund_

- id: uuid (primary key)
- name: string
- manager: string
- minInvestment: integer
- NAV: decimal (12,4)
- NAVDate: date
- fees: decimal (12,2)

_Transaction_

- id: uuid (primary key)
- userId: integer (foreign key, validation: required)
- fundId: uuid (foreign key, validation: required)
- dateTime: date
- type: string
- method: string
- unit: decimal (12,4)
- amount: decimal (12,2)
- totalAmount: decimal (12,2)

_Investment_

- id: uuid (primary key)
- userId: integer (foreign key, validation: required)
- fundId: uuid (foreign key, validation: required)
- currentUnit: decimal (12,4)

## List of available endpoints:

- `POST /login`
- `POST /add-user`

And routes below need authentication

- `PATCH /topup`
- `GET /funds`
- `GET /funds/:id`
- `GET /investments`
- `GET /transactions`
- `POST /transactions/buy`

And routes below need authorization

> You can only put investment with the same logged in user id

- `POST /transactions/sell`
- `POST /transactions/switch`

&nbsp;

## 1. POST /login

Description: Get access token by sending registered username and password

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required!"
}
OR
{
  "message": "Password is required!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid Username or Password"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Username not found"
}
```

&nbsp;

## 2. POST /register

Description: Create new user

Request:

- body:

```json
{
  "username": "string (required",
  "password": "string (required)"
}
```

_Response (201 - Created)_

```json
{
  "newUser": {
    "balance": "0.00",
    "id": 5,
    "username": "budi",
    "password": "$2a$10$ofvn3RU50KTm0GEjyYh1X.jUzUi5zCYioWOg23d3JyN.zLpvPKSHi"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required!"
}
OR
{
  "message": "Password is required!"
}
OR
{
  "message": "Username is already taken"
}
OR

{
  "message": "Minimal password length is 5!"
}
```

&nbsp;

## 3. PATCH /topup

Description: Increase User's Balance

Request:

- body:

```json
{
  "amount": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "Topup success"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid Amount, please input a positive number!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

&nbsp;

## 4. GET /funds

Description: Show all mutual funds

_Response (200 - OK)_

```json
{
 {
  "funds": [
        {
            "id": "4c2802d3-95bb-4c7e-a8be-940960575afc",
            "name": "Manulife Dana Kas II",
            "manager": "MAMI",
            "minInvestment": 100000,
            "NAV": "1163.0000",
            "NAVDate": "2024-04-28T07:25:59.473Z",
            "fees": "0.03"
        },
        {
            "id": "8a31e8ab-1a2c-408d-9a1d-56b87df54ea6",
            "name": "Manulife Dana Saham Kelas A",
            "manager": "MAMI",
            "minInvestment": 100000,
            "NAV": "1259.0000",
            "NAVDate": "2024-04-28T07:25:59.473Z",
            "fees": "0.03"
        },
        .....,
  ]
}
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

&nbsp;

## 5. GET /funds:id

Description: Show one mutual funds by id

_Response (200 - OK)_

```json
{
  "funds": {
    "id": "4c2802d3-95bb-4c7e-a8be-940960575afc",
    "name": "Manulife Dana Kas II",
    "manager": "MAMI",
    "minInvestment": 100000,
    "NAV": "1163.0000",
    "NAVDate": "2024-04-28T07:25:59.473Z",
    "fees": "0.03"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid Data Type"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "There are no Mutual Funds with that ID!"
}
```

&nbsp;

## 6. POST /transactions/buy

Description: Buy a mutual fund with the desired amount and create new transaction

Request:

- body:

```json
{
  "fundId": "uuid (required)",
  "amount": "integer (required)"
}
```

_Response (201 - OK)_

```json
{
  "transaction": {
    "id": "1472c7ec-f792-488a-a224-0e2e7911b733",
    "userId": 4,
    "fundId": "4c2802d3-95bb-4c7e-a8be-940960575afc",
    "dateTime": "2024-04-28T09:07:31.070Z",
    "type": "buy",
    "method": "QR Code",
    "unit": "85.9845",
    "amount": "100000.00",
    "totalAmount": "103000.00",
    "Fund": {
      "NAV": "1163.0000",
      "NAVDate": "2024-04-28T07:25:59.473Z",
      "fees": "0.03"
    }
  },
  "message": "Successfully bought 85.9845 unit of Manulife Dana Kas II with total amount Rp 103.000,00 "
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Minimum Investment is Rp. 100.000!"
}
OR
{
  "message": "Not Enough Balance!"
}
OR
{
  "message": "Invalid Amount, please input a positive number!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "There are no Mutual Funds with that ID!"
}
```

&nbsp;

## 7. POST /transactions/sell

Description: Sell your current investment unit and create new transaction

Request:

- body:

```json
{
  "investmentId": "uuid (required)",
  "unit": "integer (required)"
}
```

_Response (201 - OK)_

```json
{
  "transaction": {
    "id": "00d6dc25-f1b2-4d5c-a70b-22c643b2cbc1",
    "userId": 4,
    "fundId": "4c2802d3-95bb-4c7e-a8be-940960575afc",
    "dateTime": "2024-04-28T09:47:56.432Z",
    "type": "sell",
    "method": "Bank Transfer",
    "unit": "100.0000",
    "amount": "116300.00",
    "totalAmount": "112811.00",
    "Fund": {
      "NAV": "1163.0000",
      "NAVDate": "2024-04-28T07:25:59.473Z",
      "fees": "0.03"
    }
  },
  "message": "Successfully sold 100.0000 unit of Manulife Dana Kas II with total amount Rp 112.811,00 "
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Transaction is Invalid! Please check the inputs are correct!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You don't have access"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "There are no Mutual Funds with that ID!"
}
OR
{
  "message": "You don't have an investment with that id!"
}
```

&nbsp;

## 8. POST /transactions/switch

Description: Switch your invested fund to another with the same manager investment
Request:

- body:

```json
{
  "investmentId": "uuid (required)",
  "switchFundId": "uuid (required)",
  "unit": "integer (required)"
}
```

_Response (201 - OK)_

```json
{
  "transaction": {
    "id": "27a74900-ea05-490a-89e7-58b6edf47293",
    "userId": 4,
    "fundId": "8a31e8ab-1a2c-408d-9a1d-56b87df54ea6",
    "dateTime": "2024-04-28T09:54:38.215Z",
    "type": "switch",
    "method": "Switch Funds",
    "unit": "0.1000",
    "amount": "125.90",
    "totalAmount": "122.12",
    "Fund": {
      "NAV": "1259.0000",
      "NAVDate": "2024-04-28T07:25:59.473Z",
      "fees": "0.03"
    }
  },
  "message": "Successfully switched 0.1000 unit of Manulife Dana Kas II to Manulife Dana Saham Kelas A with total amount Rp 122,12 "
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Transaction is Invalid! Please check the inputs are correct!"
}
OR
{
  "message": "You can't switch to a different manager's fund!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You don't have access"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "There are no Mutual Funds with that ID!"
}
OR
{
  "message": "You don't have an investment with that id!"
}
```

&nbsp;

## 9. GET /transactions

Description: Show current logged in user's transactions list
_Response (200 - OK)_

```json
{
    "transactions": [
        {
            "id": "60215158-3309-48d4-aa96-1e4be3ec1267",
            "userId": 3,
            "fundId": "4c2802d3-95bb-4c7e-a8be-940960575afc",
            "dateTime": "2024-04-28T09:42:19.702Z",
            "type": "buy",
            "method": "QR Code",
            "unit": "85.9845",
            "amount": "100000.00",
            "totalAmount": "103000.00",
            "User": {
                "id": 3,
                "username": "wahyu"
            }
        },
        {
            "id": "a5635292-9a1c-4ecc-a1a0-59f52c6546a7",
            "userId": 3,
            "fundId": "4c2802d3-95bb-4c7e-a8be-940960575afc",
            "dateTime": "2024-04-28T09:42:22.770Z",
            "type": "buy",
            "method": "QR Code",
            "unit": "85.9845",
            "amount": "100000.00",
            "totalAmount": "103000.00",
            "User": {
                "id": 3,
                "username": "wahyu"
            }
        },
       ....
    ]
}
OR
{
 "message": "You don't have any investments yet!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "No transactions has been made"
}
```

&nbsp;

## 10. GET /investments

Description: Show current logged in user's investment
_Response (200 - OK)_

```json
{
 "investment": [
        {
            "id": "c5c09a8b-eee5-45f1-89fb-dd04fbb3db21",
            "userId": 3,
            "fundId": "4c2802d3-95bb-4c7e-a8be-940960575afc",
            "currentUnit": "257.9535"
        }
    ]
}
OR
{
 "message": "You don't have any investments yet!"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, please login first!"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Authentication Error, invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```
