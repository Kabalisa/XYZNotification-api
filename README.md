# Notification system API rate limiter
Notification system API rate limiter is a system designed to limit the number requests made to the notification API. the limit is applied on three level. the first one is on a global level where the number of requests made by all clients in a second is limited, the second one is on a monthly basis where the number of requests made by a perticular client in a month are limited, and the third is where the number of requests made by a particular client in a second are limited. in a addition, a client has an endpoint to buy more requests per second. 

## Tools used

- NodeJs/Express
- MongoDB
- Mongoose
- Redis

## Tests tool
- Jest

# Installation
## Prerequesite
- you must have NodeJs installed on your system.
- if you do not have redis installed on your machine, you can follow the instructions [here](https://redis.io/docs/getting-started/installation/) to install it.

## Installation steps

- ```git clone https://github.com/Kabalisa/XYZNotification-api.git```
- ```cd XYZNotification-api && npm i```
- run ```redis-server```
- ```npm run dev```
- you can then test the endpoints with ```http://localhost:3000``` being your basic URL.

## How to test the API rate limit
When the server running you can test the API with these steps:
- create a user by using this endpoint: ```http://localhost:3000/api/v1/users/signup```. provide the name, phoneNumber, email, and password.
- if you already have a user, you can login on this endpoint: ```http://localhost:3000/api/v1/users/signin```. provide the phoneNumber and password.
- to test how the rate limiter middlewares work, use this notification endpoint: ```http://localhost:3000/api/v1/notifications/send```. you need to provide the token field in the headers to authorize the current user.
- if you need to buy more requests per second, you need to use this endpoint: ```http://localhost:3000/api/v1/requests/buy```. you also need to provide the token in the headers and also an amount in the body.

## How run the unit tests of the system
- run ```redis-server```
- run ```npm run test```