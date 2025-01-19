# Eric wallet web application

A comprehensive web application for tracking personal finances across multiple accounts, built with Spring Boot and React.

## Overview

E_wallet helps users manage and monitor their financial transactions across different accounts (bank accounts, mobile money, cash, etc.). It provides features for transaction tracking, budgeting, categorization, and visualization of financial data.

## Features

### Transaction Management
- Track income and expenses across multiple accounts
- Record transaction details including date, amount, description, and account
- Support for different account types (bank accounts, mobile money, cash, etc.)
- Real-time balance updates for each account

### Budgeting
- Set spending limits for different categories
- Real-time notifications when approaching or exceeding budget limits
- Budget tracking and analysis
- Monthly, quarterly, and annual budget planning

### Categorization
- Create and manage expense/income categories
- Support for subcategories
- Link transactions to specific categories/subcategories
- Hierarchical category management

### Reporting and Analytics
- Generate detailed financial reports for custom date ranges
- Export reports in various formats (PDF, CSV)
- Visual representation of spending patterns
- Category-wise expense analysis

### Data Visualization
- Interactive dashboards
- Graphical representation of income vs. expenses
- Category-wise spending charts
- Trend analysis over time

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- PostgreSQL
- Maven

### Frontend
- React 
- TypeScript
- Material-UI
- Redux Toolkit
- Recharts for visualization
- Axios for API communication

## Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup and Installation

### Prerequisites
- JDK 17 or higher
- Node.js 16 or higher
- PostgreSQL 13 or higher
- Maven 3.8+

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/ishimwe-pacifique/taskforcepro2.0.git
   ```

2. Configure database properties in `application.yml`
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/wallet
   spring.datasource.username=postgres
   spring.datasource.password=
   ```

3. Build and run the application
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup


1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend server.






Ishimwe pacifique- pacifishimwe150@gmail.com

