# Outvio test

Pseudo auth behaviour is created by signing JWT token with USER_ID and JWT_SECRET from env.

Total of 3 api routes are created: /public, /private and /weighted. All routes can be tested with different rate limits and weighted points using env variables.

Note that the weighted api route is using req.ip as key in redis which is the same key for public route. So incase you test public route first then you need to clear the redis records before testing weighted and vice versa.

## How to run

- Make sure node and redis is installed on your machine
- create a .env file from the .env.example
- run yarn at the root directory
- run it locally by the command: yarn start
- use postman or any similar tool to make requests
