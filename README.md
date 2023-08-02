# Project Minesweeper
#### Video Demo:  <URL HERE>
#### Live Version:
### Background
I was already introduced to Minesweeper as a child during the 90s. Back then the game seemed confusing and hard and it wasn't until as an adult I really got to appreciate it fully. There is just something addicting in the flow of flagging and opening cells. A few years ago I made a simple command line minesweeper game using Python. Now, armed with new knowledge about web programming basics, final project seemed like the perfect opportunity to improve my old design and see what I have learned.
### What is Project Minesweeper?
Project Minesweeper is a web-based minesweeper game. It supports the 3 classic difficulty options (beginner, intermediate and expert). The game is playable on PC, Mac and also mobile devices. Database is used to store statistics about the games played (eg. how many games have been won/lost and what are the best times for each difficulty). If a player makes it to top 10, they get to input their own name into to leaderboard. All the graphics on the page are original and provided kindly by my sister.
### App Structure
Project Minesweeper uses Flask as backend framework, so **app.py** contains all the routes used by the web-app:
- ```@app.route("/", methods = ["GET"])``` Front page (index) of the web-app
- ```@app.route("/game-easy", methods = ["GET"])```
Page containing the game with "beginner" -difficulty. Also provides the page with top 10 best times from the Sqlite3 -database. User-Agent is used to guess the user's operating system, which is also provided. This is used in the .html -file to determine which .js -file to use for game controls.
- ```@app.route("/game-medium", methods = ["GET"])``` Same as before, except for "intermediate" -difficulty.
- ```@app.route("/game-hard", methods = ["GET"])``` Same as before, except for "expert" -difficulty.
- ```@app.route("/check", methods = ["POST"])``` Route used by the game script when a game is won to check if the time was good enough to make it into top 10.
- ```@app.route("/save", methods = ["POST"])``` Route used to save a new high score into the database.
- ```@app.route("/dump", methods = ["POST"])``` Route used to save information into the database about lost games and won games that did not made it into top 10.
- ```@app.route("/stats")``` Page containing statistics about games played/won and win-%.
- ```@app.route("/controls")``` Page containing information about how to play.
- ```@app.route("/about")``` Page containing information about the web-app and myself.
- ```@app.route("/sorry")``` Used for pages still under construction.
<br></br>

Sqlite3 is used for the database and **scores.db** contains 4 tables used to store information about games played:
- **beginner** is used to store current (and past) top 10 times for "beginner" -difficulty.
- **intermediate** is used to store current (and past) top 10 times for "intermediate" -difficulty.
- **expert** is used to store current (and past) top 10 times for "expert" -difficulty.
- **dump** is used to store information about games lost and games won, that didn't make it to top 10.
<br></br>

Dependencies are listed in **requirements.txt**.

All the static files the app uses are stored in ```/static``` -folder. This includes a bunch of images, favicon, stylesheet (```styles.css```) and 5 javascript -files:
- ```game.js``` This file contains the main game logic and functions.
- ```controls.js``` Contains controls for Windows (mostly javascript event listeners). Is loaded when os is detected to be Windows or as default.
- ```controls_mac.js``` Contains controls for Mac. Includes Windows -control scheme, but adds support for mouses without right button.
- ```controls_mobile.js``` Contains controls for mobile devices.
- ```horizontal.js``` Helper file for detecting landscape vs. portrait mode on mobile devices and adjusting the game area accordingly.

### Design and choices
TODO