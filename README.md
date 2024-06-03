# Simple stopwatch app

A stopwatch app to keep track of elapsed time in a project. You start the timer when you start working on the project and stop it when you change project. The timer can be set to start on any time, and the project name can be changed.
I used it to keep track of time dedicated to solve exercises for the Open Fullstack Javascript course at Helskinki University. https://fullstackopen.com/en/
It's totally written in React, uses session storage to store project name and seconds lapsed. Doesn't use cookies, nor has any connection to external storage (database or other repository).
Tracks different times on a tab basis, i.e. you can keep track of different projects, one project per tab. Browser agnostic as to React limitations.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Public Url
A production deployment is available at [Timer@CloudfarePages](https://www.patriciosobrado.com/timer)

# Steps to clone the project
You need to have pre-installed the node package manage [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

1. Clone this repo to your local drive:
    Change directory to the parent folder where you'd like to install the app
    ```shell
    git clone https://github.com/thesob/timer.git
    ```
    It will create folder called "timer"
2. Change directory into timer/ folder
    ```shell
    cd timer/
    ```
3. Run npm install to load dependent node modules
    ```shell
    npm install
    ```
4. Start the application
    ```shell
    npm start
    ```
You start the timer by pressing the button. You can also set the counter to start from a different start time

# Release notes

1.0.0 - Multiple stopwatches in the same window allowing to time several projects which exclude each other when running, and tasks belonging to a project that start the clock for the parent project. (June 3, 2024)
0.50.0 - Added 24 hours clock face (April 17, 2024)
0.10.0 - First release (May 17, 2023)