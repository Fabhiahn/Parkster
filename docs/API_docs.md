# API documentation

**POST**  login-login-service:5000/signup

Parameters:

    • username
    • email
    • password
Responses:

    • 201, User registered successfully
    • 400, All fields are required
    • 401, User already exists

**POST** login-login-service:5000/login

Parameters:

    • username
    • password
Responses:

    • 200, JWToken
    • 400, All fields are required
    • 401, Invalid username or password

**GET** parking-parking-service:5001/parking

Parameters: none

Authorization: Bearer $JWToken

Responses:

    • 200, parking data
    • 401, Unauthorized
    • 500, erorr