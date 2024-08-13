# Gomboc Gambling Casino - Lets Go Gambling, Shall We?

## Instructions for setup:

- cd into the root folder
- run `npm install`: this will install all dependancies for both client & server sub directories
- navigate to `http://localhost:3000/` and start playing!

## Project Description

A full stack application with a permanent data storage layer using:

- npm
- Node.js
- Javascript
- mySQL database
- PostgreSQL

### Prerecs (one-time setup):

Before running the app, you will need to setup postsql first:

#### Postgresql instructions:

1. install homebrew if you havent already:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

If you already have homebrew installed please run the following:

1. `brew doctor`
1. `brew update`

Then run the postgresql server locally by running:

1. `brew services start postgresql`

Then run `psql postgres` to enter ther postgres terminal to create the database and an admin user run the following:

```
CREATE DATABASE gomboc_casino;
CREATE USER gomboc_user WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE gomboc_casino TO gomboc_user;
```

You can run `brew services stop postgresql` to stop the server when you're finished

### Running the App

- Install all dependencies: `npm install`
- Run the application in development mode: `npm run start-dev` in the root directory.
- Run the application in production mode: `npm run start` in the root directory.

You can view additional commands by running `npm run` and a list

## The Application

The application is a gambling game where the user can bet on the outcome of a dice roll. The user can bet on a number between 1 and 6. If the user guesses the number correctly,
they win 5 times the amount they bet. If the user guesses the number incorrectly, they lose the amount they bet.

The UI shows:

- The user's balance
- An input field for the user to enter the `amount` they want to bet
- An input field for the user to enter the `dice number` they want to bet on
- A `submit` button to submit the bet
- A pop up message showing the result of the bet (win or lose)
- A `withdraw` button to withdraw the balance and reset the game (the user should be able to withdraw the balance only if they have won at least once)
- A `history` button to show the history of bets for all the games played

The application has a data storage layer to keep track of the user's balance and the history of bets. The user's balance should be updated after each bet. The caveats of this app is as follows:

- The app will initalize with a default user.
- Omit authentication for each user (this is currently on the roadmap).

## Game Rules

- The user starts with a balance of 1000 on initilization (first time playing).
- One turn consists of the following steps:
  - The user bets an amount and a dice number
  - The user submits the bet
  - The application shows the result of the dice roll
  - The application shows a message if the user wins or loses and updates the balance
- A user can play as many turns as they want until they press the `withdraw` button or they lose all their money.
- The dice roll should be random.
- If the user's balance reaches 0, the game prevents the user from placing any other bets and the only action they can take is to a reset button to reset to the initial state.
- If the player press `withdraw` button, the game should reset to the initial state. (balance : $1000)

### Extra rules

- If the user's balance is greater or equal to 5000, the dice roll should be rigged with the following logic:
  - If the dice roll matches the user bet (before claiming the user win), there is a 30% chance that the server will repeat the roll (a single time) and use the second roll as the final result.
- If the user's balance is greater or equal to 10000, the dice roll should be rigged with the following logic:
  - If the dice roll matches the user bet (before claiming the user win), there is a 50% chance that the server will repeat the roll (a single time) and use the second roll as the final result.

## User stories

- As a user I want to be able to bet on a number that represents the outcome of a dice roll
- As a user I want to be able to see the history of all the games I have played

### Developer Notes:

- Adopt `Docker` to ensure the game is OS and platform agnostic.
- In order to ensure a successful bootup on every run, I would create a `bash script` to ensure all dependancies are properly installed (Database, npm modules, etc.).
- Due to time constraints and scope of the project, I would've liked to include unit tests and additional documentation to the frontend.
- Why I picked Sequilize: I've heard many good things about sequelize and wanted to use this opportunity to use the technology. It's a popular Node.js ORM that simplifies database interactions by mapping JavaScript objects to relational database tables. It supports multiple databases, allowing for versatile and database-agnostic development. It features a query builder, automatic handling of associations, migrations for schema changes (good for future proofing), and seamless integration with Node.js. Sequelize streamlines CRUD operations and schema management. It also has active community and ecosystem offer extensive support and extensions. One of Sequilize's drawback is that it might introduce performance overhead compared to raw SQL, and sometimes restricts fine-tuned SQL control or complex relationship handling. I figured Sequilize was perfect for the scope of this project.
- Lack of typescript:
  In my experience, the setup for TypeScript is complicated and involved for a porject of this scope. Its mature ecosystem and extensive tool support is also a plus for me, and in performance-sensitive cases, avoiding the compilation step can be beneficial (especially in this case). In addition, typescirpt is usally behind in Javascript features. To compensate for lack of types, I've also adopted JSDocs for Code Navigation, Automated Documentation Generation and for Type Checking in IDE editors.
