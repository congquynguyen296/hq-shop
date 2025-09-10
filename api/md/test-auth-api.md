# Test Auth API

## Endpoints

### 1. Register
**POST** `/api/auth/register`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "1",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "0123456789",
      "address": "123 Main St",
      "role": "user",
      "isActive": true,
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "0123456789",
      "address": "123 Main St",
      "role": "user",
      "isActive": true,
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected)
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0123456789",
    "address": "123 Main St",
    "role": "user",
    "isActive": true,
    "createdAt": "..."
  }
}
```

## Test với cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test với Postman

1. **Register:**
   - Method: POST
   - URL: `http://localhost:3001/api/auth/register`
   - Body: raw JSON với thông tin user

2. **Login:**
   - Method: POST
   - URL: `http://localhost:3001/api/auth/login`
   - Body: raw JSON với email và password

3. **Get Profile:**
   - Method: GET
   - URL: `http://localhost:3001/api/auth/profile`
   - Headers: Authorization: Bearer {token}

## Lưu ý

- Mật khẩu được hash bằng bcryptjs
- Token JWT có thời hạn 7 ngày (có thể config trong env)
- Email phải unique
- Tất cả response đều có format chuẩn với success/message/data
