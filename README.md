# MARAB

A simple solution for quickly integrating a registration, login, and authorization system into your server.

# Configuration
It's important to configure the **.env** file for the application to work. Below, I'll list the correct way to complete the package configuration:

 - **MONGO_URI**: This is the link that should connect to your MongoDB Atlas cluster. It is important to create a database with the name you want.
 - **PORT**: This is the port through which the server will run. For this, you can temporarily connect to a local port, but in production, it is important to associate it directly with the deployment service you use.
 - **TOKENS_SECRETS**: These are the secret keys used by the JWT to sign the tokens used by the application, ensuring its security. Here, you must create a secret key; it can be anything, even completely random letters and numbers.
 - **TOKENS_EXPIRES**: These are the token expiration times. It is important that the access token expires in 10 minutes or less, the refresh token in 7 days, and the verify email token in 24 hours.
 - **MAILER_CREDENTIALS**: For the mailer credentials, you can temporarily use Mailtrap, but in production it is important that you use a real email service, such as Gmail, Outlook, or both.
 - **FRONTEND_URL**: This is the front-end URL. It's used for some future implementations. If the front-end doesn't share the same URL as the back-end, it's important to implement CORS on the server.

# Endpoints
This is a list of the endpoints found in the package. It's important to follow the instructions to use it properly.

## Register

For registration, it is important to comply with the following validation rules:

1. No field can be empty.
2. The email must be in email format.
3. The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
4. The verification password must match.

For example:

    {
      "user": "JuanPerez",
      "email": "juan@ejemplo.com",
      "password": "Abc12345!",
      "confirmPassword": "Abc12345!"
    }

The request type must be **POST** to the following link:

    {URL}/api/auth/register

For example, in a local environment:

    http://localhost:3000/api/auth/register
## Login
For the login request, you must follow these validations:

1. No fields must be empty.
2. It is important that the user has previously verified themselves.
3. The type of device the user uses must be included from the frontend.
4. The credentials must match existing ones in the database.

For example:

    {
	   "email": "juan@ejemplo.com",
	   "password": "Abc12345!",
	   "device": "Samsung"
    }
## VerifyEmail
On this endpoint, you just need to click on the link sent to your email.
