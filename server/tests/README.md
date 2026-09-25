# StudySnap Backend Test Suite

## 1. Final Test Status

This README documents the **actual automated test cases present in the uploaded StudySnap test suite**.

```text
Test Files: 23
Tests:      297
Status:     PASS
```

**23 test files and 297 test cases are documented below.**

The hierarchy follows the backend's functional areas: application, validation, authentication, authorization, Redis, users, departments, subjects, notes, history, and administration.

---

## 2. Testing Stack

| Technology | Role |
|---|---|
| Vitest | Test runner and assertion framework |
| Supertest | HTTP/API testing |
| MongoDB/Mongoose | Persistence-related behavior where required |
| Redis | JWT blacklist behavior |
| Cloudinary | Upload-related behavior where required |
| Express | Backend application under test |

---

## 3. Complete Test Hierarchy

```text
tests/
├── app.test.js
├── validation/
│   ├── auth.validation.test.js
│   ├── user.validation.test.js
│   ├── note.validation.test.js
│   ├── subject.validation.test.js
│   ├── tag.validation.test.js
│   └── department.test.js
├── auth/
│   ├── register.test.js
│   ├── login.test.js
│   ├── refresh.test.js
│   └── logout.test.js
├── authorization/
│   ├── authMiddleware.test.js
│   └── roles.test.js
├── redis/
│   └── blacklist.test.js
├── users/
│   └── user.test.js
├── departments/
│   └── department.test.js
├── subjects/
│   └── subject.test.js
├── notes/
│   ├── note.test.js
│   ├── note-search.test.js
│   └── note-tags.test.js
├── history/
│   ├── uploads.test.js
│   └── downloads.test.js
└── admin/
    └── admin.test.js
```

---
## 1. Application

### `app.test.js`

**Test count: 1**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should confirm that StudySnap API is running` | Verifies the application behavior described by the test case. |

---

## 2. Validation

### `validation/auth.validation.test.js`

**Test count: 18**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should accept a valid STUDENT registration` | Verifies the application behavior described by the test case. |
| 2 | `should accept a valid FACULTY registration without semester` | Verifies the application behavior described by the test case. |
| 3 | `should reject STUDENT registration when semester is missing` | Verifies that the stated invalid or unauthorized input is rejected. |
| 4 | `should reject an invalid role` | Verifies that the stated invalid or unauthorized input is rejected. |
| 5 | `should reject a password that does not satisfy password requirements` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should reject an invalid mobile number` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should accept semester 1` | Verifies the application behavior described by the test case. |
| 8 | `should accept semester 8` | Verifies the application behavior described by the test case. |
| 9 | `should reject semester 0` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject semester 9` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should accept semester provided as a numeric string` | Verifies the application behavior described by the test case. |
| 12 | `should reject a decimal semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 13 | `should reject a non-numeric semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 14 | `should trim whitespace from email` | Verifies request-data normalization before the value is used by the application. |
| 15 | `should trim whitespace from name` | Verifies request-data normalization before the value is used by the application. |
| 16 | `should accept valid login credentials` | Verifies the application behavior described by the test case. |
| 17 | `should reject an invalid email format` | Verifies that the stated invalid or unauthorized input is rejected. |
| 18 | `should reject a missing password` | Verifies that the stated invalid or unauthorized input is rejected. |

---

### `validation/user.validation.test.js`

**Test count: 15**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should accept a valid name update` | Verifies the application behavior described by the test case. |
| 2 | `should accept a valid mobile update` | Verifies the application behavior described by the test case. |
| 3 | `should accept a valid semester update` | Verifies the application behavior described by the test case. |
| 4 | `should accept a valid password update` | Verifies the application behavior described by the test case. |
| 5 | `should accept multiple valid fields` | Verifies the application behavior described by the test case. |
| 6 | `should trim the name` | Verifies request-data normalization before the value is used by the application. |
| 7 | `should trim the mobile number` | Verifies request-data normalization before the value is used by the application. |
| 8 | `should reject an empty update body` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should reject an unknown field` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject an invalid name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should reject an invalid mobile number` | Verifies that the stated invalid or unauthorized input is rejected. |
| 12 | `should reject an invalid semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 13 | `should reject a non-integer semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 14 | `should reject an invalid password` | Verifies that the stated invalid or unauthorized input is rejected. |
| 15 | `should call next exactly once for valid data` | Verifies the expected middleware/service invocation behavior. |

---

### `validation/note.validation.test.js`

**Test count: 19**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should accept valid note data` | Verifies the application behavior described by the test case. |
| 2 | `should trim the title` | Verifies request-data normalization before the value is used by the application. |
| 3 | `should convert semester to a number` | Verifies request-data normalization before the value is used by the application. |
| 4 | `should convert department ID to a number` | Verifies request-data normalization before the value is used by the application. |
| 5 | `should convert subject ID to a number` | Verifies request-data normalization before the value is used by the application. |
| 6 | `should reject a missing title` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should reject a non-string title` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should reject an invalid title format` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should reject a title shorter than 2 characters` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject a title longer than 150 characters` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should reject a missing semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 12 | `should reject a non-positive or non-integer semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 13 | `should reject a semester outside 1 to 8` | Verifies that the stated invalid or unauthorized input is rejected. |
| 14 | `should reject a missing department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 15 | `should reject an invalid department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 16 | `should reject a missing subject ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 17 | `should reject an invalid subject ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 18 | `should reject a missing PDF file` | Verifies that the stated invalid or unauthorized input is rejected. |
| 19 | `should call next exactly once for valid data` | Verifies the expected middleware/service invocation behavior. |

---

### `validation/subject.validation.test.js`

**Test count: 29**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should accept valid subject data` | Verifies the application behavior described by the test case. |
| 2 | `should trim subject name` | Verifies request-data normalization before the value is used by the application. |
| 3 | `should convert department IDs to numbers` | Verifies request-data normalization before the value is used by the application. |
| 4 | `should accept a single department ID` | Verifies the application behavior described by the test case. |
| 5 | `should reject a missing subject name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should reject a null subject name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should reject a non-string subject name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should reject an invalid subject name format` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should reject missing department IDs` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject an empty department ID array` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should reject a non-array department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 12 | `should reject a zero department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 13 | `should reject a negative department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 14 | `should reject a decimal department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 15 | `should reject a non-numeric department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 16 | `should reject when any department ID in the array is invalid` | Verifies that the stated invalid or unauthorized input is rejected. |
| 17 | `should accept both subject name and department IDs` | Verifies the application behavior described by the test case. |
| 18 | `should accept an update with only subject name` | Verifies the application behavior described by the test case. |
| 19 | `should accept an update with only department IDs` | Verifies the application behavior described by the test case. |
| 20 | `should reject an empty update body` | Verifies that the stated invalid or unauthorized input is rejected. |
| 21 | `should reject a non-string subject name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 22 | `should reject an invalid subject name format` | Verifies that the stated invalid or unauthorized input is rejected. |
| 23 | `should trim the subject name during update` | Verifies request-data normalization before the value is used by the application. |
| 24 | `should reject an empty department ID array` | Verifies that the stated invalid or unauthorized input is rejected. |
| 25 | `should reject a non-array department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 26 | `should reject an invalid department ID during update` | Verifies that the stated invalid or unauthorized input is rejected. |
| 27 | `should reject a non-positive department ID during update` | Verifies that the stated invalid or unauthorized input is rejected. |
| 28 | `should normalize department IDs during update` | Verifies request-data normalization before the value is used by the application. |
| 29 | `should call next exactly once for a valid update` | Verifies the expected middleware/service invocation behavior. |

---

### `validation/tag.validation.test.js`

**Test count: 18**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should accept valid note ID and tag` | Verifies the application behavior described by the test case. |
| 2 | `should convert note ID to a number` | Verifies request-data normalization before the value is used by the application. |
| 3 | `should normalize tag to lowercase` | Verifies request-data normalization before the value is used by the application. |
| 4 | `should trim whitespace from tag` | Verifies request-data normalization before the value is used by the application. |
| 5 | `should accept all supported tags` | Verifies the application behavior described by the test case. |
| 6 | `should reject a missing note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should reject an empty note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should reject a zero note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should reject a negative note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject a decimal note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should reject a non-numeric note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 12 | `should reject a missing tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 13 | `should reject a non-string tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 14 | `should reject an empty tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 15 | `should reject an unsupported tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 16 | `should reject whitespace-only tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 17 | `should accept uppercase and mixed-case tags` | Verifies the application behavior described by the test case. |
| 18 | `should call next exactly once for valid data` | Verifies the expected middleware/service invocation behavior. |

---

### `validation/department.test.js`

**Test count: 14**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should return all departments successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return departments inside the response object` | Verifies the application behavior described by the test case. |
| 3 | `should return service error when fetching departments fails` | Verifies the application behavior described by the test case. |
| 4 | `should create a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 5 | `should pass department name to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 6 | `should return service error when department creation fails` | Verifies the application behavior described by the test case. |
| 7 | `should update a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 8 | `should pass department ID and name to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 9 | `should return 404 when department is not found` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 10 | `should return service error when update fails` | Verifies the application behavior described by the test case. |
| 11 | `should delete a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 12 | `should pass department ID to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 13 | `should return 404 when department does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 14 | `should return service error when deletion fails` | Verifies the application behavior described by the test case. |

---

## 3. Authentication

### `auth/register.test.js`

**Test count: 15**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should register a valid STUDENT successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should register a valid FACULTY without semester` | Verifies the application behavior described by the test case. |
| 3 | `should reject STUDENT registration when semester is missing` | Verifies that the stated invalid or unauthorized input is rejected. |
| 4 | `should reject an invalid registration role` | Verifies that the stated invalid or unauthorized input is rejected. |
| 5 | `should reject a password that does not satisfy validation rules` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should reject an invalid email format` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should reject an invalid mobile number` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should reject a non-positive department ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should normalize email before passing it to the service` | Verifies request-data normalization before the value is used by the application. |
| 10 | `should trim whitespace from the name before passing it to the service` | Verifies request-data normalization before the value is used by the application. |
| 11 | `should convert numeric semester and department values to numbers` | Verifies request-data normalization before the value is used by the application. |
| 12 | `should return the service error when the email already exists` | Verifies the expected existence/non-existence behavior for the stated resource or value. |
| 13 | `should return the service error when the department does not exist` | Verifies the application behavior described by the test case. |
| 14 | `should return the service error when department is required but unavailable` | Verifies the application behavior described by the test case. |
| 15 | `should return 500 when registration service throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |

---

### `auth/login.test.js`

**Test count: 8**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should login successfully with valid credentials` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the authenticated user and access token in the response` | Verifies the application behavior described by the test case. |
| 3 | `should return the access token generated by the authentication service` | Verifies the application behavior described by the test case. |
| 4 | `should set the refresh token in an HTTP-only cookie` | Verifies the application behavior described by the test case. |
| 5 | `should normalize the email before passing it to the service` | Verifies request-data normalization before the value is used by the application. |
| 6 | `should return 401 when the service rejects invalid credentials` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 7 | `should return 500 when the login service throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 8 | `should pass the email and password to the authentication service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |

---

### `auth/refresh.test.js`

**Test count: 10**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should refresh the access token successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the new access token in the response` | Verifies the application behavior described by the test case. |
| 3 | `should read the refresh token from the request cookie` | Verifies the application behavior described by the test case. |
| 4 | `should pass the exact refresh token to the authentication service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 5 | `should return 401 when the refresh token is missing` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 6 | `should return 401 when the refresh token is invalid or expired` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 7 | `should return 401 when the refresh session has expired` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 8 | `should return 404 when the user associated with the refresh token does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 9 | `should return 500 when the refresh service throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 10 | `should not set a new refresh-token cookie when refreshing the access token` | Verifies that the specified response side effect is not performed. |

---

### `auth/logout.test.js`

**Test count: 10**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should logout successfully with a valid session` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the successful logout message` | Verifies the application behavior described by the test case. |
| 3 | `should pass the refresh token from the cookie to the logout service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 4 | `should pass the decoded access-token payload from authMiddleware to the logout service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 5 | `should clear the refresh-token cookie after successful logout` | Verifies that the expected authentication cookie/session state is cleared. |
| 6 | `should return 401 when there is no active refresh-token session` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 7 | `should return 401 when the access token is invalid` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 8 | `should return 401 when the session has already been logged out` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 9 | `should return 500 when the logout service throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 10 | `should call the logout service exactly once` | Verifies the expected middleware/service invocation behavior. |

---

## 4. Authorization

### `authorization/authMiddleware.test.js`

**Test count: 10**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should return 401 when the Authorization header is missing` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 2 | `should return 401 when the Authorization header does not use Bearer authentication` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 3 | `should return 401 when the Bearer token is empty` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 4 | `should return 401 when JWT verification fails` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 5 | `should return 401 when the JWT is expired` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 6 | `should return 401 when the access token is blacklisted` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 7 | `should allow a valid non-blacklisted access token` | Verifies the application behavior described by the test case. |
| 8 | `should attach the decoded JWT payload to req.user` | Verifies that the expected authentication data is attached to the request object. |
| 9 | `should attach the original access token to req.accessToken` | Verifies that the expected authentication data is attached to the request object. |
| 10 | `should return 401 when the blacklist lookup throws an error` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |

---

### `authorization/roles.test.js`

**Test count: 8**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should allow a user whose role is authorized` | Verifies the application behavior described by the test case. |
| 2 | `should allow a user when their role matches one of multiple allowed roles` | Verifies the application behavior described by the test case. |
| 3 | `should reject a user whose role is not authorized` | Verifies that the stated invalid or unauthorized input is rejected. |
| 4 | `should return 401 when req.user is missing` | Verifies that the request is rejected with HTTP 401 for the stated authentication/session failure. |
| 5 | `should reject a user whose role is missing` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should treat roles as case-sensitive` | Verifies the application behavior described by the test case. |
| 7 | `should reject an authenticated user when no roles are allowed` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should call next exactly once for an authorized user` | Verifies the expected middleware/service invocation behavior. |

---

## 5. Redis

### `redis/blacklist.test.js`

**Test count: 10**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should blacklist an access token using Redis SET` | Verifies the application behavior described by the test case. |
| 2 | `should generate the correct Redis blacklist key` | Verifies the application behavior described by the test case. |
| 3 | `should use the supplied expiration time as the Redis TTL` | Verifies the application behavior described by the test case. |
| 4 | `should create an independent blacklist key for different token JTIs` | Verifies the application behavior described by the test case. |
| 5 | `should propagate an error when Redis SET fails` | Verifies the application behavior described by the test case. |
| 6 | `should return true when the blacklist key exists` | Verifies the expected existence/non-existence behavior for the stated resource or value. |
| 7 | `should return false when the blacklist key does not exist` | Verifies the application behavior described by the test case. |
| 8 | `should treat any non-null Redis value as blacklisted` | Verifies the application behavior described by the test case. |
| 9 | `should propagate an error when Redis GET fails` | Verifies the application behavior described by the test case. |
| 10 | `should use the exact JTI when looking up a blacklist entry` | Verifies the application behavior described by the test case. |

---

## 6. Users

### `users/user.test.js`

**Test count: 12**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should fetch the authenticated user` | Verifies the application behavior described by the test case. |
| 2 | `should return the expected profile response structure` | Verifies the application behavior described by the test case. |
| 3 | `should pass the authenticated user` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 4 | `should return 404 when the user profile does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 5 | `should return 500 when fetching the profile throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 6 | `should update the authenticated user` | Verifies the application behavior described by the test case. |
| 7 | `should return the expected updated-profile response structure` | Verifies the application behavior described by the test case. |
| 8 | `should pass the authenticated user` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 9 | `should allow multiple valid profile fields to be updated together` | Verifies the application behavior described by the test case. |
| 10 | `should return 400 when the service rejects an unauthorized update field` | Verifies that invalid input is rejected with HTTP 400. |
| 11 | `should return 404 when the user being updated does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 12 | `should return 500 when updating the profile throws an unknown error` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |

---

## 7. Departments

### `departments/department.test.js`

**Test count: 14**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should return all departments successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the departments array in the response` | Verifies the application behavior described by the test case. |
| 3 | `should return 500 when fetching departments fails unexpectedly` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 4 | `should create a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 5 | `should trim the department name before passing it to the service` | Verifies request-data normalization before the value is used by the application. |
| 6 | `should return 409 when the department already exists` | Verifies that the API returns HTTP 409 for the stated conflict condition. |
| 7 | `should reject an invalid department name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should reject a request when department name is missing` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should update a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 10 | `should trim the department name before updating` | Verifies request-data normalization before the value is used by the application. |
| 11 | `should return 404 when the department does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 12 | `should delete a department successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 13 | `should return 404 when the department to delete does not exist` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 14 | `should return 500 when deleting a department fails unexpectedly` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |

---

## 8. Subjects

### `subjects/subject.test.js`

**Test count: 15**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should get all subjects successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return subjects as an array` | Verifies the application behavior described by the test case. |
| 3 | `should return 500 when get subjects service fails` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 4 | `should create a subject successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 5 | `should trim subject name before passing it to the service` | Verifies request-data normalization before the value is used by the application. |
| 6 | `should reject an invalid subject name` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should reject missing department IDs` | Verifies that the stated invalid or unauthorized input is rejected. |
| 8 | `should handle duplicate subject errors` | Verifies the application behavior described by the test case. |
| 9 | `should update a subject successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 10 | `should reject an empty update body` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should handle subject not found` | Verifies the application behavior described by the test case. |
| 12 | `should handle duplicate subject name` | Verifies the application behavior described by the test case. |
| 13 | `should delete a subject successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 14 | `should handle subject not found` | Verifies the application behavior described by the test case. |
| 15 | `should handle delete service errors` | Verifies the application behavior described by the test case. |

---

## 9. Notes

### `notes/note.test.js`

**Test count: 13**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should get an approved note successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the correct response structure` | Verifies the application behavior described by the test case. |
| 3 | `should reject an invalid note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 4 | `should return 404 when approved note is not found` | Verifies that the API returns HTTP 404 when the requested resource or user does not exist. |
| 5 | `should handle unexpected service errors` | Verifies the application behavior described by the test case. |
| 6 | `should create a note successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 7 | `should forward normalized fields to the service` | Verifies request-data normalization before the value is used by the application. |
| 8 | `should reject a missing title` | Verifies that the stated invalid or unauthorized input is rejected. |
| 9 | `should reject an invalid title` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should reject an invalid semester` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should reject a missing PDF` | Verifies that the stated invalid or unauthorized input is rejected. |
| 12 | `should handle note service errors` | Verifies the application behavior described by the test case. |
| 13 | `should reject a non-PDF file` | Verifies that the stated invalid or unauthorized input is rejected. |

---

### `notes/note-search.test.js`

**Test count: 15**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should return approved notes successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return notes and pagination separately` | Verifies the application behavior described by the test case. |
| 3 | `should pass semester filter to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 4 | `should pass department filter to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 5 | `should pass subject filter to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 6 | `should pass text search to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 7 | `should pass pagination parameters to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 8 | `should pass multiple filters together` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 9 | `should reject an unknown query parameter` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should handle invalid page from the service` | Verifies the application behavior described by the test case. |
| 11 | `should handle invalid limit from the service` | Verifies the application behavior described by the test case. |
| 12 | `should handle invalid semester from the service` | Verifies the application behavior described by the test case. |
| 13 | `should handle invalid department ID from the service` | Verifies the application behavior described by the test case. |
| 14 | `should handle invalid subject ID from the service` | Verifies the application behavior described by the test case. |
| 15 | `should handle unexpected service errors` | Verifies the application behavior described by the test case. |

---

### `notes/note-tags.test.js`

**Test count: 15**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should assign a tag successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should pass note ID, authenticated user ID and tag to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 3 | `should normalize uppercase and whitespace in the tag` | Verifies request-data normalization before the value is used by the application. |
| 4 | `should reject a missing tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 5 | `should reject an invalid tag` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should reject an invalid note ID` | Verifies that the stated invalid or unauthorized input is rejected. |
| 7 | `should handle approved note not found` | Verifies the application behavior described by the test case. |
| 8 | `should handle unexpected tag service errors` | Verifies the application behavior described by the test case. |
| 9 | `should get the user` | Verifies the application behavior described by the test case. |
| 10 | `should return the correct count of tagged notes` | Verifies that the response contains the correct count. |
| 11 | `should pass the authenticated user ID to the service` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 12 | `should return an empty result when the user has no tagged notes` | Verifies the expected empty-result behavior. |
| 13 | `should handle tagged notes service errors` | Verifies the application behavior described by the test case. |
| 14 | `should preserve red, blue, yellow tag ordering` | Verifies that the application preserves the service-provided result as expected. |
| 15 | `should return only notes that are available to the service` | Verifies the application behavior described by the test case. |

---

## 10. History

### `history/uploads.test.js`

**Test count: 8**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should fetch the authenticated user` | Verifies the application behavior described by the test case. |
| 2 | `should return the correct upload count` | Verifies that the response contains the correct count. |
| 3 | `should return an empty upload history when the user has no uploads` | Verifies the expected empty-result behavior. |
| 4 | `should pass the authenticated user` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 5 | `should return the notes provided by the service unchanged` | Verifies that the application preserves the service-provided result as expected. |
| 6 | `should return 500 when the upload history service fails unexpectedly` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 7 | `should return the expected response structure` | Verifies the application behavior described by the test case. |
| 8 | `should call the upload history service only once` | Verifies the expected middleware/service invocation behavior. |

---

### `history/downloads.test.js`

**Test count: 8**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should fetch the authenticated user` | Verifies the application behavior described by the test case. |
| 2 | `should pass the authenticated user` | Verifies that the controller/middleware forwards the expected value to the underlying service. |
| 3 | `should return the correct download count` | Verifies that the response contains the correct count. |
| 4 | `should return an empty download history when the user has no downloads` | Verifies the expected empty-result behavior. |
| 5 | `should return the download history provided by the service unchanged` | Verifies that the application preserves the service-provided result as expected. |
| 6 | `should return the expected response structure` | Verifies the application behavior described by the test case. |
| 7 | `should return 500 when the download history service fails unexpectedly` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 8 | `should call the download history service only once` | Verifies the expected middleware/service invocation behavior. |

---

## 11. Admin

### `admin/admin.test.js`

**Test count: 12**

| # | Test case | What it verifies |
|---:|---|---|
| 1 | `should fetch pending notes successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 2 | `should return the correct pending-note count` | Verifies that the response contains the correct count. |
| 3 | `should return 500 when fetching pending notes fails` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 4 | `should fetch rejected notes successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 5 | `should return the correct rejected-note count` | Verifies that the stated invalid or unauthorized input is rejected. |
| 6 | `should return 500 when fetching rejected notes fails` | Verifies that an unexpected service failure is converted into the expected HTTP 500 response. |
| 7 | `should approve a pending note successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 8 | `should reject a pending note successfully` | Verifies the successful execution of the stated operation and its expected successful response. |
| 9 | `should pass note ID, status, rejection reason and admin email to the service` | Verifies that the stated invalid or unauthorized input is rejected. |
| 10 | `should pass undefined rejection reason when approving a note` | Verifies that the stated invalid or unauthorized input is rejected. |
| 11 | `should return the service error when note status update fails` | Verifies the application behavior described by the test case. |
| 12 | `should return 400 for an invalid note status` | Verifies that invalid input is rejected with HTTP 400. |

---

## 14. Test Count by File

| # | Test file | Tests |
|---:|---|---:|
| 1 | `app.test.js` | 1 |
| 2 | `validation/auth.validation.test.js` | 18 |
| 3 | `validation/user.validation.test.js` | 15 |
| 4 | `validation/note.validation.test.js` | 19 |
| 5 | `validation/subject.validation.test.js` | 29 |
| 6 | `validation/tag.validation.test.js` | 18 |
| 7 | `validation/department.test.js` | 14 |
| 8 | `auth/register.test.js` | 15 |
| 9 | `auth/login.test.js` | 8 |
| 10 | `auth/refresh.test.js` | 10 |
| 11 | `auth/logout.test.js` | 10 |
| 12 | `authorization/authMiddleware.test.js` | 10 |
| 13 | `authorization/roles.test.js` | 8 |
| 14 | `redis/blacklist.test.js` | 10 |
| 15 | `users/user.test.js` | 12 |
| 16 | `departments/department.test.js` | 14 |
| 17 | `subjects/subject.test.js` | 15 |
| 18 | `notes/note.test.js` | 13 |
| 19 | `notes/note-search.test.js` | 15 |
| 20 | `notes/note-tags.test.js` | 15 |
| 21 | `history/uploads.test.js` | 8 |
| 22 | `history/downloads.test.js` | 8 |
| 23 | `admin/admin.test.js` | 12 |

| **Total** | **23 test files** | **297** |

---

## 15. Final Test Result

The complete test suite was executed successfully.

```text
Test Files  23 passed (23)
     Tests  297 passed (297)
  Start at  20:01:46
  Duration  5.96s (import 83%, tests 8%, transform 8%, worker 1%)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

### Final Result

```text
23 / 23 test files passed
297 / 297 tests passed
0 failed
```

---

## 16. Running the Test Suite

Run the complete suite:

```powershell
npm test
```

Run once without watch mode:

```powershell
npx vitest run
```

Run a specific file:

```powershell
npx vitest tests/auth/login.test.js
```

Run a complete category:

```powershell
npx vitest tests/notes
```

---

## 17. Test Design Coverage

The documented cases collectively exercise:

- Happy paths
- Negative paths
- Boundary values
- Input normalization
- Invalid data types
- Authentication
- Authorization
- JWT validation
- Token blacklisting
- CRUD behavior
- Service/controller interaction
- Error handling
- HTTP status handling
- Search and filtering
- Pagination parameters
- Note tagging
- Upload/download history
- Administrative state changes
- Empty-result behavior
- Invocation counts and request forwarding

---

## 18. Important Documentation Note

The individual test-case list above is generated from the **actual `it()` test cases in the uploaded test files**. The README does not invent additional test cases or claim coverage that is not represented by those files.

**StudySnap Backend Test Suite — 23 files, 297 tests, all passing.**