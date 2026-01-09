# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS-based HR management system for managing employees, departments, and positions. The application uses MongoDB with Mongoose for data persistence and includes basic authentication.

## Development Commands

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Production build
npm run build

# Run production
npm run start:prod

# Linting
npm run lint

# Format code
npm run format

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## Architecture

### Module Structure

The application follows NestJS modular architecture with three main feature modules:

1. **EmployeeModule** (`src/employee/`) - Main module handling employee CRUD operations
2. **DepartmentModule** (`src/department/`) - Department management (placeholder implementation)
3. **PositionModule** (`src/position/`) - Position management (placeholder implementation)

### Database Configuration

- **Database**: MongoDB (local instance)
- **Connection URL**: `mongodb://127.0.0.1:27017/nest_db`
- **ORM**: Mongoose with @nestjs/mongoose integration
- **Connection Configuration**: Located in `src/employee/employee.module.ts:14`

**Important**: The MongoDB connection is currently configured only in the EmployeeModule. If you need to use MongoDB in other modules, you should move `MongooseModule.forRoot()` to `AppModule` imports to make it globally available.

### Employee Schema

The Employee entity (`src/employee/entities/employee.entity.ts`) includes comprehensive fields:
- Personal information (name, email, phone, dateOfBirth, gender, address)
- Employment details (position, department, employmentType, employmentStatus)
- Dates (hireDate, terminationDate)
- Emergency contact information
- Text indexes on: firstname, lastname, email, dateOfBirht (note: typo in schema), phone, gender

### Authentication

- **Type**: HTTP Basic Authentication
- **Implementation**: `BasicAuthGuard` in `src/app.basicauthGuard.ts`
- **Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Protected Routes**: All employee endpoints (`/api/employee/*`) require basic authentication

### API Configuration

- **Global Prefix**: `/api` (configured in `src/main.ts:6`)
- **Default Port**: 8000 (can be overridden with PORT environment variable)
- **Employee Endpoints**:
  - GET `/api/employee` - List employees (supports pagination: page, limit, search)
  - POST `/api/employee` - Create employee
  - GET `/api/employee/:id` - Get single employee
  - PATCH `/api/employee/:id` - Update employee
  - DELETE `/api/employee/:id` - Delete employee

## Development Notes

### Input Validation

The application uses `class-validator` and `class-transformer` for comprehensive input validation:
- All DTOs have validation decorators with custom error messages
- Global ValidationPipe is enabled in `main.ts` with:
  - `whitelist: true` - Strips unknown properties
  - `forbidNonWhitelisted: true` - Throws error for unknown properties
  - `transform: true` - Auto-transforms payloads to DTO instances
  - `enableImplicitConversion: true` - Auto-converts types

### Error Handling

The EmployeeService includes comprehensive error handling:
- **BadRequestException (400)**: Invalid ObjectId format, duplicate email, validation errors
- **NotFoundException (404)**: Employee not found
- **InternalServerErrorException (500)**: Database or unexpected errors

### Employee Search & Pagination

The `findAll` method supports:
- **Pagination**: `page` (default: 1) and `limit` (default: 10, max: 100)
- **Search**: Searches across firstName, lastName, email, and phone fields using regex
- **Sorting**: Results sorted by `createdAt` descending (newest first)
- Returns metadata: totalCount, page, limit, totalPages

### Incomplete Features

- Department and Position modules have placeholder entity classes with no actual implementation
- The Employee entity has commented-out code for ObjectId reference to Position (line 38-39)

### Code Quality

- Contains comments in Uzbek language
- Some typos in schema indexes (e.g., "dateOfBirht" instead of "dateOfBirth")