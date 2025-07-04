authRouter
POST /signup
POST /login
POST /logout

profileRouter
GET /profile
POST /profile
PATCH /password

requestRouter
POST /request/like/:userId
POST /request/ignore/:userid

POST /request/accept/:userId
POST /request/reject/:userId

userRouter
GET /user/connections
GET /user/requests
GET /user/feed
