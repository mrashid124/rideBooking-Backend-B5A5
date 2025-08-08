

User register:
http://localhost:5000/api/v1/users/register
exm:
{
  "name": "Sakib",
  "email": "sakib@example.com",
  "password": "123456",
   "phone": "01987654321",
  "role": "rider"
}


{
  "name": "Abu Taleb",
  "email": "abu@example.com",
    "phone": "06857924325",
  "password": "123460",
  "role": "rider"
}


Example:
{
  "email": "john@example.com",
  "password": "123456"
}

Output:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwMjIwNDgxMmZmZTRjZmJhODU0MSIsInJvbGUiOiJyaWRlciIsImlhdCI6MTc1NDEzNzY1MCwiZXhwIjoxNzU0NzQyNDUwfQ.bdV50B1d_wgU4pxFeeX2GpOyHv9DvpSo5KskCb8ma8w",
    "user": {
        "id": "688e02204812ffe4cfba8541",
        "name": "John Doe",
        "role": "rider",
        "email": "john@example.com"
    }
}

User Login:
http://localhost:5000/api/v1/auth/login

Body:
{

  "email": "rafi4@example.com",
  "password": "444444"
  

}

Output:
{
    "success": true,
    "message": "User Logged In Successfully!",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxZTM4YjY5ZTRiZDdiYzc5MTNkNzUiLCJlbWFpbCI6InJhZmk0QGV4YW1wbGUuY29tIiwicm9sZSI6InJpZGVyIiwiaWF0IjoxNzU0NTgxODQ3LCJleHAiOjE3NTQ2NjgyNDd9.CO0u4e3s87E_e8qTZvph4Dcmb3RhSQesJkYbGgQt8mo",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxZTM4YjY5ZTRiZDdiYzc5MTNkNzUiLCJlbWFpbCI6InJhZmk0QGV4YW1wbGUuY29tIiwicm9sZSI6InJpZGVyIiwiaWF0IjoxNzU0NTgxODQ3LCJleHAiOjE3NTUxODY2NDd9.5CsuzZz912h5WmH9uIdErrSnX22aWAxEQu3QpgjGxTs",
        "user": {
            "isActive": "ACTIVE",
            "cancelAttempts": 0,
            "_id": "6891e38b69e4bd7bc7913d75",
            "name": "Rafi4",
            "email": "rafi4@example.com",
            "phone": "12345444444",
            "role": "rider",
            "isBlocked": false,
            "isApproved": false,
            "createdAt": "2025-08-05T10:57:15.901Z",
            "updatedAt": "2025-08-05T10:57:15.901Z",
            "__v": 0
        }
    }
}




<!-- Use parseInt when using salt round
In your bcrypt logic (e.g., in User Model or Auth Service):

ts

import { envVars } from '../config/env'; // adjust path accordingly
const saltRounds = parseInt(envVars.BCRYPT_SALT_ROUND, 10);
const hashedPassword = await bcrypt.hash(password, saltRounds); -->