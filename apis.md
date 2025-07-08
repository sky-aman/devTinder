## authRouter
- POST /signup ✅
- POST /login ✅
- POST /logout ✅

## profileRouter
- GET /profile/view ✅
- PATCH /profile/edit ✅
- PATCH /profile/password ✅

## connectionRequestRouter
- POST /request/send/:status[interested, ignored]/:userId ✅
- POST /request/review/:status[accepted, rejected]/:userId ✅

## userRouter
- GET /user/requests/received ✅
- GET /user/connections ✅
- GET /user/feed

Status: ignore, interested, accepted, rejected