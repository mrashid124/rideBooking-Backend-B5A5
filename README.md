

User register:

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
http://localhost:5000/api/auth/login




<!-- Use parseInt when using salt round
In your bcrypt logic (e.g., in User Model or Auth Service):

ts

import { envVars } from '../config/env'; // adjust path accordingly
const saltRounds = parseInt(envVars.BCRYPT_SALT_ROUND, 10);
const hashedPassword = await bcrypt.hash(password, saltRounds); -->