# API Reference Documentation

This document provides detailed API reference for the Auth-Routes backend.

## Base URL
```
http://localhost:5000
```

## Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Optional error details"
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Authentication

### JWT Token

Include the JWT token in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

- Access tokens expire after 7 days
- No refresh token mechanism implemented

## Endpoints

### 1. Root Endpoint

#### GET /
Returns the home page with EJS template.

**Response:** HTML page

---

### 2. Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user account.

**Headers:**
```
Content-Type: application/json
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | User's full name |
| username | string | Yes | Unique username (3-20 chars) |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 6 chars) |
| phone | string | Yes | 10-digit phone number |
| verificationToken | string | Yes | JWT token from email verification |

**Success Response (201):**
```json
{
  "message": "User registered successfully.",
  "profileURL": "http://localhost:3000/profile/username",
  "username": "username"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid data
- `403` - Invalid verification token
- `409` - Username or email already exists
- `500` - Server error

#### POST /api/auth/login
Authenticate user and return JWT token.

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| emailOrUsername | string | Yes | Email or username |
| password | string | Yes | User password |

**Success Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "profileURL": "http://localhost:3000/profile/johndoe"
  }
}
```

#### GET /api/auth/profile
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "profileURL": "http://localhost:3000/profile/johndoe",
    "preferences": {},
    "stats": {},
    "avatar": "path/to/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/auth/profile/:username
Get public profile by username.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| username | string | Username to fetch |

**Success Response (200):** Same as above (excludes sensitive data)

#### GET /api/auth/mocktest/:testId
Get test details by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| testId | string | Test ID |

**Success Response (200):**
```json
{
  "success": true,
  "test": {
    "_id": "test_id",
    "name": "Test Name",
    "description": "Test description",
    "passingScore": 70,
    "questions": [...]
  }
}
```

#### GET /api/auth/me
Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

---

### 3. Verification Routes (`/api/verification`)

#### POST /api/verification/initiate
Send OTP to email for verification.

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Email address to verify |

**Success Response (200):**
```json
{
  "message": "Verification email sent successfully"
}
```

#### POST /api/verification/verify
Verify email with OTP.

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Email address |
| otp | string | Yes | 6-digit OTP |

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "verificationToken": "jwt_token_for_registration"
}
```

---

### 4. User Management Routes (`/api/user`)

#### GET /api/user/profile
Get user profile (authenticated).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT /api/user/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body Parameters:** Any user fields to update
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### POST /api/user/avatar
Upload user avatar.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| avatar | file | Image file (jpg, png, etc.) |

**Success Response (200):**
```json
{
  "message": "Avatar uploaded",
  "avatar": "uploads/avatar_filename.jpg"
}
```

#### GET /api/user/preferences
Get user preferences.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT /api/user/preferences
Update user preferences.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body Parameters:**
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": true
}
```

#### GET /api/user/stats
Get user statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### DELETE /api/user/account
Delete user account.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

---

### 5. Test Routes (`/api/test`)

#### GET /api/test/filters
Get available test filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| examTarget | string | Filter by exam target |
| stage | string | Filter by stage |

#### GET /api/test/list
Get paginated list of tests.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| category | string | - | Filter by category |
| examTarget | string | - | Filter by exam target |

#### POST /api/test/start
Start a test session.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body Parameters:**
```json
{
  "testId": "test_id_here"
}
```

#### POST /api/test/submit
Submit test answers.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body Parameters:**
```json
{
  "testId": "test_id_here",
  "answers": [
    {
      "questionId": "question_id",
      "selectedOption": "A"
    }
  ]
}
```

---

### 6. Contact Routes (`/api/contact`)

#### POST /api/contact
Submit contact form.

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Contact name |
| email | string | Yes | Contact email |
| subject | string | No | Message subject |
| message | string | Yes | Contact message |

**Success Response (200):**
```json
{
  "message": "Contact message sent successfully"
}
```

---

### 7. User Test Routes (`/api/user`)

#### GET /api/user/tests/:userId
Get user's test records.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User ID |

**Success Response (200):**
```json
{
  "success": true,
  "tests": [
    {
      "testId": "test_id",
      "testName": "Test Name",
      "score": 85,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "message": "All fields are required."
}
```

**Authentication Error (401):**
```json
{
  "message": "No token, authorization denied"
}
```

**Forbidden Error (403):**
```json
{
  "message": "Invalid verification token."
}
```

**Not Found Error (404):**
```json
{
  "message": "User not found"
}
```

**Conflict Error (409):**
```json
{
  "message": "Email already in use."
}
```

**Server Error (500):**
```json
{
  "message": "Server error. Please try again later.",
  "error": "Detailed error message"
}
```

## Rate Limiting

- No explicit rate limiting implemented
- Consider implementing rate limiting for production use

## CORS Configuration

The API allows requests from:
- `https://igniteverse.in`
- `http://localhost:3000`
- `http://localhost:5173`

Credentials are allowed for authenticated requests.

## File Upload

- Avatar uploads are stored in the `uploads/` directory
- Supported formats: jpg, png, gif, etc.
- File size limits should be configured in production

## Email Templates

The API uses the following email templates:
- Verification email with OTP
- Welcome email after registration
- Password reset email
- Password change success email

## Database Schemas

### User Schema
```javascript
{
  name: String (required),
  username: String (unique),
  email: String (required, unique),
  password: String (required),
  phone: String (unique),
  role: String (enum: ['st', 'ad'], default: 'st'),
  subscription_status: String (default: 'inactive'),
  userID: String (unique),
  profileURL: String (unique),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  avatar: String,
  preferences: Map,
  stats: Map,
  timestamps: true
}
```

### Test Schema
```javascript
{
  name: String (required),
  description: String,
  isPublic: Boolean (default: true),
  accessPasscode: String,
  category: String,
  examTarget: String,
  stage: String,
  type: String,
  questionSets: [{
    setId: ObjectId,
    numToPick: Number
  }],
  passingScore: Number (required),
  createdAt: Date
}
```

### ContactMessage Schema
```javascript
{
  name: String (required),
  email: String (required),
  subject: String,
  message: String (required),
  ip: String,
  userAgent: String,
  receivedAt: Date (default: now)
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| BREVO_API_KEY | Brevo email API key | Yes |
| EMAIL_FROM | Sender email address | No |
| FRONTEND_URL | Frontend application URL | Yes |
| PORT | Server port | No (default: 5000) |

## Security Considerations

1. **Password Hashing**: Uses bcryptjs with salt rounds of 10
2. **JWT Tokens**: 7-day expiration
3. **Input Validation**: Uses express-validator
4. **CORS**: Configured for specific origins
5. **Rate Limiting**: Not implemented (consider adding)
6. **File Upload Security**: Basic multer configuration (enhance for production)

## Testing

Use tools like Postman or Insomnia to test the API endpoints. Import the provided collection for pre-configured requests.

## Support

For API support or questions:
- Email: support@igniteverse.in
- Documentation: This file
- Issues: GitHub repository issues