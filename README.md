# Hotel Website

This is a hotel management web application built with React. It provides functionalities for user authentication, food entry and selection, bill calculation, and printing of bills.

## Features

- **User Authentication**: Users can log in to access the application.
- **Food Entry**: Users can input food codes to select items from the menu.
- **Food Selection**: Displays selected food items in a table format with calculated amounts based on rate and quantity.
- **Bill Calculation**: Computes the total bill amount by summing the amounts of all selected food items.
- **Bill Printing**: Formats the bill for printing and provides a print option.

## Project Structure

```
hotel-website
├── src
│   ├── components
│   │   ├── Login
│   │   │   └── Login.js
│   │   ├── FoodMenu
│   │   │   ├── FoodEntry.js
│   │   │   └── FoodSelection.js
│   │   ├── Bill
│   │   │   ├── BillCalculation.js
│   │   │   └── BillPrint.js
│   │   └── common
│   │       ├── Header.js
│   │       └── Footer.js
│   ├── pages
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── MenuPage.js
│   │   └── BillPage.js
│   ├── services
│   │   ├── authService.js
│   │   └── billService.js
│   ├── styles
│   │   ├── App.css
│   │   └── components
│   │       ├── Login.css
│   │       ├── FoodMenu.css
│   │       └── Bill.css
│   ├── utils
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── public
│   └── index.html
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd hotel-website
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:3000` to view the application.

## Technologies Used

- React
- CSS
- JavaScript

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see!