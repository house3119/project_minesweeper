# Project Minesweeper
#### Video Demo:  <URL HERE>
#### Live Version:
### Background
I was introduced to Minesweeper as a child during the 90s. Back then the game seemed confusing and hard and it wasn't until as an adult I really got to appreciate it fully. There is just something addicting in the flow of flagging and opening cells. A few years ago I made a simple command line minesweeper game using Python. Now, armed with new knowledge about web programming basics, CS50 final project seemed like the perfect opportunity to improve my old design and see what I have learned.
### What is Project Minesweeper?
Project Minesweeper is a web-based minesweeper game. It supports the 3 classic difficulty options (beginner, intermediate and expert). The game is playable on PC, Mac and also mobile devices. Database is used to store statistics about the games played (eg. how many games have been won/lost and what are the best times for each difficulty). If a player makes it to top 10, they get to input their own name into to leaderboard. All the graphics on the page are original and provided kindly by my sister.
### App Structure
Project Minesweeper uses Flask as backend framework, so **app.py** contains all the routes used by the web-app:
- ```@app.route("/", methods = ["GET"])``` Front page (index).
- ```@app.route("/game-easy", methods = ["GET"])```
Page containing the game with "beginner" -difficulty. Also provides the page with top 10 best times from the database. User-Agent is used to guess the user's operating system, which is also provided. This is used to determine which javascript file to use for game controls.
- ```@app.route("/game-medium", methods = ["GET"])``` Same as before, except for "intermediate" -difficulty.
- ```@app.route("/game-hard", methods = ["GET"])``` Same as before, except for "expert" -difficulty.
- ```@app.route("/check", methods = ["POST"])``` Route used by the game script when a game is won to check if the time was good enough to make it into top 10.
- ```@app.route("/save", methods = ["POST"])``` Route used to save a new high score into the database.
- ```@app.route("/dump", methods = ["POST"])``` Route used to save information into the database about lost games and won games that did not make it into top 10.
- ```@app.route("/stats")``` Page containing statistics about all the games played.
- ```@app.route("/controls")``` Page containing information about how to play.
- ```@app.route("/about")``` Page containing information about the web-app and myself.
- ```@app.route("/sorry")``` Used for pages still under construction.

Sqlite3 is used for the database and **scores.db** contains 4 tables used to store information about games played:
- **beginner** is used to store current (and past) top 10 times for "beginner" -difficulty.
- **intermediate** is used to store current (and past) top 10 times for "intermediate" -difficulty.
- **expert** is used to store current (and past) top 10 times for "expert" -difficulty.
- **dump** is used to store information about games lost and games won that didn't make it to top 10.

Dependencies are listed in **requirements.txt**.

All the static files the app uses are stored in ```/static``` -folder. This includes a bunch of images, favicon, stylesheet (```styles.css```) and 5 javascript files:
- ```game.js``` This file contains the main game logic and functions.
- ```controls.js``` Contains controls for Windows (mostly javascript event listeners). Is loaded when os is detected to be Windows or as default.
- ```controls_mac.js``` Contains controls for Mac. Includes Windows -control scheme, but adds support for mouse with only one button.
- ```controls_mobile.js``` Contains controls for mobile devices.
- ```horizontal.js``` Helper file for detecting landscape vs. portrait mode on mobile devices and adjusting the game area accordingly.

HTML templates used by the app are stored in the ```/templates``` -folder. Slightly confusingly named **game_layout.html** contains common layout for the whole site (navbar, metadata etc.) Separate templates are rendered for intermdiate and expert difficulties on mobile devices. This is because the game area doesn't fit on the screen and I wanted to enable horizontal scrolling of just the game area and not any other part of the page.

### Design
The main feature of the site is the game, of course. I tried to make it feel as much as the classic minesweeper as I could. I feel I accomplished that pretty well. Images used to represent various game area elements (mine, flag and numbers) resemble the original ones quite a bit and this was a conscious choice. Controls used to play the game are also same as on the original. On mobile devices I had to improvise a little, but I think the game feels pretty good on mobile too.

Overall graphic design of the page could be improved quite a bit I feel. I probably should have used some kind of framework (Bootstrap) from the start to make things easier. I tried to implement it middle way through, but gave up shortly after. Still I feel the aesthetics and usability of the page are adequate. I quickly found out that playing around with HTML and CSS are not my favourite things. I enjoyed much more creating the game logic and solving problems there, rather than perfecting the visual side of things.

Flask was the obvious choice for the backend framework, because it was introduced during the course. Originally I used CS50 library to interact with the database, but later switched to sqlite3 library. This was because I wanted to implement the game on cloud server to be able to share the game with my friends and family. You should go check it out too at [https://house31.pythonanywhere.com](https://house31.pythonanywhere.com)!

Finally, I want to thank all of the CS50 crew for an absolutely amazing course! It was a lot of work and some problem sets were really tough, but it made it all the more satisfying to finaly solve them.