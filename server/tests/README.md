# StudySnap Backend Test Suite

## 1. Purpose

This directory contains automated tests for the StudySnap Node.js/Express backend.

The test suite uses:

* **Vitest** — test runner and assertion framework
* **Supertest** — HTTP/API testing
* **MongoDB** — persistence tests where required
* **Redis** — JWT blacklist/session-related tests
* **Cloudinary** — upload-related behavior where required

The goal is not to maximize the number of tests.

The goal is to test **distinct application behaviors**, including:

* Happy paths
* Negative paths
* Boundary values
* Invalid data types
* Authentication
* Authorization
* State transitions
* Database interactions
* Redis interactions
* Validation
* Combinations of filters and parameters

---

# 2. Test Philosophy

Tests should answer:

> "What unique behavior does this test prove?"

We should avoid tests that repeatedly verify the same behavior with slightly different data unless the data represents a meaningful boundary or different business rule.

The main techniques used are:

### Equivalence Partitioning

Group inputs that should behave the same way.

Example:

```text
Semester:

0       → invalid
1       → valid boundary
2-7     → valid range
8       → valid boundary
9       → invalid
```

We do not need eight separate tests just to prove that every value from 1 to 8 works.

### Boundary Value Analysis

Test values at and immediately around boundaries.

Example:

```text
0
1
8
9
```

### Negative Testing

Verify that invalid input is rejected correctly.

Examples:

```text
missing email
invalid password
invalid role
invalid ID
invalid token
```

### State Transition Testing

Test behavior before and after a state change.

Example:

```text
LOGIN
  ↓
access token valid
  ↓
LOGOUT
  ↓
access token blacklisted
  ↓
same token rejected
```

### Combinatorial Testing

Test meaningful combinations of independent parameters.

Example:

```text
search
semester
department
subject
tag
```

Instead of testing every possible mathematical combination, we select combinations that exercise different branches of the application.

---

# 3. Test Directory

```text
tests/
│
├── app.test.js
│
├── validation/
│   ├── auth.validation.test.js
│   ├── user.validation.test.js
│   ├── note.validation.test.js
│   ├── subject.validation.test.js
│   └── tag.validation.test.js
│
├── auth/
│   ├── register.test.js
│   ├── login.test.js
│   ├── refresh.test.js
│   └── logout.test.js
│
├── authorization/
│   └── roles.test.js
│
├── redis/
│   └── blacklist.test.js
│
├── users/
│   └── user.test.js
│
├── departments/
│   └── department.test.js
│
├── subjects/
│   └── subject.test.js
│
├── notes/
│   ├── note.test.js
│   ├── note-search.test.js
│   └── note-tags.test.js
│
├── history/
│   ├── downloads.test.js
│   └── uploads.test.js
│
└── admin/
    └── admin.test.js
```

---

# 4. Test Status

## Application

### `app.test.js`

Purpose:

* Verify the Express application is running.
* Verify the root endpoint returns the expected response.

Status:

* [x] Initial smoke test

---

# 5. Validation Tests

## `validation/auth.validation.test.js`

### Registration

* [x] Valid STUDENT registration
* [x] Valid FACULTY registration
* [x] STUDENT without semester
* [x] Invalid role
* [x] Invalid password
* [x] Invalid mobile number
* [x] Semester lower boundary
* [x] Semester upper boundary
* [x] Semester below valid range
* [x] Semester above valid range
* [x] Numeric semester supplied as string
* [x] Decimal semester
* [x] Non-numeric semester
* [x] Email whitespace normalization
* [x] Name whitespace normalization

### Login

* [x] Valid credentials
* [x] Invalid email format
* [x] Missing password

Current total:

**18 tests**

---

## `validation/user.validation.test.js`

Planned coverage:

* [ ] Valid user data
* [ ] Invalid user data
* [ ] Missing required fields
* [ ] Invalid email
* [ ] Email normalization
* [ ] Invalid mobile
* [ ] Invalid IDs
* [ ] Boundary values
* [ ] Unexpected input types

---

## `validation/note.validation.test.js`

Planned coverage:

* [ ] Valid note
* [ ] Missing required fields
* [ ] Invalid note data
* [ ] Invalid semester
* [ ] Semester boundaries
* [ ] Invalid subject
* [ ] Invalid department
* [ ] Invalid data types
* [ ] Boundary values

---

## `validation/subject.validation.test.js`

Planned coverage:

* [ ] Valid subject
* [ ] Missing required fields
* [ ] Invalid subject data
* [ ] Invalid department
* [ ] Invalid IDs
* [ ] Boundary values

---

## `validation/tag.validation.test.js`

Planned coverage:

* [ ] Valid red tag
* [ ] Valid blue tag
* [ ] Valid yellow tag
* [ ] Invalid tag
* [ ] Missing note ID
* [ ] Missing user ID
* [ ] Invalid IDs
* [ ] Invalid combinations

---

# 6. Authentication Tests

## `auth/register.test.js`

Tests the complete registration flow:

```text
Request
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
MongoDB
   ↓
Response
```

Planned coverage:

* [ ] Successful STUDENT registration
* [ ] Successful FACULTY registration
* [ ] Missing STUDENT semester
* [ ] Missing department
* [ ] Invalid department
* [ ] Duplicate email
* [ ] Duplicate user ID
* [ ] Password hashing
* [ ] Password not exposed in response
* [ ] Invalid request
* [ ] Boundary semester

---

## `auth/login.test.js`

Planned coverage:

* [ ] Successful login
* [ ] Nonexistent user
* [ ] Incorrect password
* [ ] Email case normalization
* [ ] Email whitespace
* [ ] Access token generation
* [ ] Refresh token generation
* [ ] Session creation
* [ ] Refresh-token cookie
* [ ] Password not exposed

---

## `auth/refresh.test.js`

Planned coverage:

* [ ] Valid refresh token
* [ ] Missing refresh token
* [ ] Invalid refresh token
* [ ] Expired refresh token
* [ ] Refresh token with missing session
* [ ] Deleted session
* [ ] New access token generation
* [ ] Refresh after logout

---

## `auth/logout.test.js`

Planned coverage:

* [ ] Successful logout
* [ ] Session removal
* [ ] Access-token blacklist
* [ ] Redis blacklist entry
* [ ] Existing access token rejected after logout
* [ ] Missing authentication
* [ ] Invalid token

---

# 7. Authorization Tests

## `authorization/roles.test.js`

Role-based behavior will be tested using a matrix.

Roles:

```text
STUDENT
FACULTY
ADMIN
```

Tests will verify:

* [ ] Student access
* [ ] Faculty access
* [ ] Admin access
* [ ] Unauthorized role
* [ ] Missing authentication
* [ ] Invalid token
* [ ] Role-specific endpoints

The exact permissions will be derived from the application's actual routes and middleware.

---

# 8. Redis Tests

## `redis/blacklist.test.js`

Planned coverage:

* [ ] Redis connection
* [ ] Store blacklist entry
* [ ] Detect blacklisted token
* [ ] Non-blacklisted token remains valid
* [ ] Blacklist TTL
* [ ] Logout creates blacklist entry
* [ ] Blacklisted JWT rejected by middleware
* [ ] Different JTI remains unaffected

Important state transition:

```text
VALID TOKEN
    ↓
LOGOUT
    ↓
BLACKLISTED TOKEN
    ↓
PROTECTED REQUEST
    ↓
401
```

---

# 9. User Tests

## `users/user.test.js`

Planned coverage:

* [ ] Get current user
* [ ] Update profile
* [ ] Valid update
* [ ] Invalid update
* [ ] Unauthorized request
* [ ] Nonexistent user
* [ ] Email normalization
* [ ] Mobile update
* [ ] Protected endpoint

---

# 10. Department Tests

## `departments/department.test.js`

Planned coverage:

### Create

* [ ] Create department
* [ ] Missing data
* [ ] Duplicate department
* [ ] Invalid data
* [ ] Authorization

### Read

* [ ] Get departments
* [ ] Get department by ID
* [ ] Nonexistent department
* [ ] Invalid ID

### Update

* [ ] Valid update
* [ ] Invalid update
* [ ] Nonexistent department
* [ ] Authorization

### Delete

* [ ] Valid deletion
* [ ] Nonexistent department
* [ ] Authorization
* [ ] Related-data behavior

---

# 11. Subject Tests

## `subjects/subject.test.js`

Planned coverage:

* [ ] Create subject
* [ ] Read subject
* [ ] Update subject
* [ ] Delete subject
* [ ] Duplicate subject
* [ ] Invalid department
* [ ] Invalid subject ID
* [ ] Nonexistent subject
* [ ] Authorization

---

# 12. Note Tests

## `notes/note.test.js`

Planned coverage:

* [ ] Create note
* [ ] Retrieve note
* [ ] Retrieve nonexistent note
* [ ] Approved note visibility
* [ ] Pending note behavior
* [ ] Note ownership
* [ ] Authorization
* [ ] Download behavior

---

# 13. Note Search Tests

## `notes/note-search.test.js`

Search/filter dimensions:

```text
search
semester
department
subject
tag
page
limit
```

Planned combinations include:

```text
search
semester
department
subject
tag

search + semester
search + department
search + subject
semester + department
semester + subject
department + subject

search + semester + department
search + semester + subject
search + department + subject
```

Also:

* [ ] Empty search
* [ ] No matching results
* [ ] Pagination
* [ ] First page
* [ ] Last page
* [ ] Invalid page
* [ ] Invalid limit
* [ ] Boundary limits

The exact combinations will be selected according to the branches present in the implementation rather than testing every mathematically possible combination.

---

# 14. Note Tag Tests

## `notes/note-tags.test.js`

Valid tags:

```text
red
blue
yellow
```

Planned coverage:

* [ ] Add red tag
* [ ] Add blue tag
* [ ] Add yellow tag
* [ ] Invalid tag
* [ ] Missing note
* [ ] Missing user
* [ ] Same user + same note
* [ ] Different user + same note
* [ ] Same user + different note
* [ ] Duplicate tag relationship

The unique `(noteId, userId)` constraint is particularly important here.

---

# 15. History Tests

## `history/downloads.test.js`

Planned coverage:

* [ ] Download recorded
* [ ] Download history retrieved
* [ ] Unauthorized access
* [ ] Nonexistent note
* [ ] Repeated download
* [ ] Multiple downloads

---

## `history/uploads.test.js`

Planned coverage:

* [ ] Upload recorded
* [ ] Upload history retrieved
* [ ] Unauthorized access
* [ ] Multiple uploads
* [ ] Ordering/pagination where supported

---

# 16. Admin Tests

## `admin/admin.test.js`

Main state transition:

```text
PENDING
   ↓
ADMIN
   ↓
APPROVE
   ↓
APPROVED
```

and:

```text
PENDING
   ↓
ADMIN
   ↓
REJECT
   ↓
REJECTED
```

Planned coverage:

* [ ] Get pending notes
* [ ] Admin approves note
* [ ] Admin rejects note
* [ ] Student cannot access admin endpoint
* [ ] Faculty cannot access admin endpoint
* [ ] Invalid note ID
* [ ] Nonexistent note
* [ ] Invalid status
* [ ] State transition behavior

---

# 17. Test Categories

Each test should belong primarily to one of these categories:

| Category         | Purpose                          |
| ---------------- | -------------------------------- |
| Smoke            | Basic application availability   |
| Validation       | Input correctness                |
| Unit             | Individual function behavior     |
| Integration      | Multiple application layers      |
| Authentication   | Identity/token behavior          |
| Authorization    | Role/access behavior             |
| Database         | MongoDB behavior                 |
| Redis            | Cache/blacklist/session behavior |
| State transition | Behavior before/after an action  |
| Boundary         | Values at limits                 |
| Negative         | Expected failure behavior        |
| Combinatorial    | Interaction between parameters   |

---

# 18. Important Rule

A test should not be added simply because another value exists.

For example, if:

```text
semester = 1
```

and:

```text
semester = 2
```

exercise exactly the same branch, one test may be enough.

But:

```text
semester = 1
semester = 8
semester = 0
semester = 9
```

are valuable because they test the boundaries.

The objective is **behavioral coverage**, not simply a large test count.

---

# 19. Development Order

The test suite will be implemented in this order:

```text
1. Validation
      ↓
2. Registration
      ↓
3. Login
      ↓
4. Protected authentication
      ↓
5. Refresh
      ↓
6. Logout
      ↓
7. Redis blacklist
      ↓
8. Authorization
      ↓
9. Users
      ↓
10. Departments
      ↓
11. Subjects
      ↓
12. Notes
      ↓
13. Note search/filter combinations
      ↓
14. Note tags
      ↓
15. Download history
      ↓
16. Upload history
      ↓
17. Admin workflows
```

This order follows the application's dependency flow.

For example, we should not test:

```text
Admin approval
```

before we have reliable:

```text
Login
+
JWT
+
Role authorization
```

tests.

---

# 20. Current Progress

```text
Application smoke test       ✅
Auth validation              ✅ 18 tests

User validation              ⬜
Note validation              ⬜
Subject validation           ⬜
Tag validation               ⬜

Registration                ⬜
Login                       ⬜
Refresh                     ⬜
Logout                      ⬜

Authorization               ⬜
Redis blacklist             ⬜

Users                       ⬜
Departments                 ⬜
Subjects                    ⬜
Notes                       ⬜
Note search                 ⬜
Note tags                   ⬜
Download history            ⬜
Upload history              ⬜
Admin                       ⬜
```

---

# 21. Running Tests

Run all tests:

```powershell
npm test
```

Run one file:

```powershell
npx vitest tests/validation/auth.validation.test.js
```

Run one folder:

```powershell
npx vitest tests/validation
```

Run tests once without watch mode:

```powershell
npx vitest run
```

---

# 22. Learning Objective

While implementing this suite, we will learn Vitest progressively:

```text
describe()
it()
expect()
beforeAll()
afterAll()
beforeEach()
afterEach()

Supertest

Mocks
Spies
Stubs

Test isolation

Async tests

Database setup/cleanup

Integration testing

Parameterized tests

Fixtures

Coverage
```

We will introduce each concept **when the project actually needs it**, rather than learning Vitest syntax separately from the StudySnap architecture.
