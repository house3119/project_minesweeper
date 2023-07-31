import sqlite3
from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)


@app.route("/", methods = ["GET"])
def index():
       return render_template("index.html")


@app.route("/game-easy", methods = ["GET"])
def game_easy():
       user_agent = request.headers.get('User-Agent')
       if re.search("Macintosh", user_agent) != None:
              os = "Mac"
       elif re.search("Android", user_agent) != None:
              os = "Android"
       elif re.search("iPhone", user_agent) != None:
              os = "iPhone"
       else:
              os = "Windows"

       conn = sqlite3.connect('scores.db')
       cursor = conn.cursor()
       cursor.execute("SELECT name, time FROM beginner ORDER BY time LIMIT 10")
       high_scores = cursor.fetchall()
       conn.close()

       high_scores_new = []
       for i in range (len(high_scores)):
              holder = {}
              holder['name'] = high_scores[i][0]
              holder['time'] = high_scores[i][1]
              high_scores_new.append(holder)

       return render_template("game_easy.html", os=os, difficulty="beginner", high_scores=high_scores_new)


@app.route("/game-medium", methods = ["GET"])
def game_medium():
       user_agent = request.headers.get('User-Agent')

       if re.search("Macintosh", user_agent) != None:
              os = "Mac"
       elif re.search("Android", user_agent) != None:
              os = "Android"
       elif re.search("iPhone", user_agent) != None:
              os = "iPhone"
       else:
              os = "Windows"

       conn = sqlite3.connect('scores.db')
       cursor = conn.cursor()
       cursor.execute("SELECT name, time FROM intermediate ORDER BY time LIMIT 10")
       high_scores = cursor.fetchall()
       conn.close()

       high_scores_new = []
       for i in range (len(high_scores)):
              holder = {}
              holder['name'] = high_scores[i][0]
              holder['time'] = high_scores[i][1]
              high_scores_new.append(holder)

       if os == "Android" or os == "iPhone":
              return render_template("m_game_medium.html", os=os, difficulty="intermediate", high_scores=high_scores_new)
       else:
              return render_template("game_medium.html", os=os, difficulty="intermediate", high_scores=high_scores_new)


@app.route("/game-hard", methods = ["GET"])
def game_hard():
       user_agent = request.headers.get('User-Agent')

       if re.search("Macintosh", user_agent) != None:
              os = "Mac"
       elif re.search("Android", user_agent) != None:
              os = "Android"
       elif re.search("iPhone", user_agent) != None:
              os = "iPhone"
       else:
              os = "Windows"

       conn = sqlite3.connect('scores.db')
       cursor = conn.cursor()
       cursor.execute("SELECT name, time FROM expert ORDER BY time LIMIT 10")
       high_scores = cursor.fetchall()
       conn.close()

       high_scores_new = []
       for i in range (len(high_scores)):
              holder = {}
              holder['name'] = high_scores[i][0]
              holder['time'] = high_scores[i][1]
              high_scores_new.append(holder)

       if os == "Android" or os == "iPhone":
              return render_template("m_game_hard.html", os=os, difficulty="expert", high_scores=high_scores_new)
       else:
              return render_template("game_hard.html", os=os, difficulty="expert", high_scores=high_scores_new)


@app.route("/check", methods = ["POST"])
def check():
       result = request.get_json()

       if result['difficulty'] == "beginner":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("SELECT time FROM beginner ORDER BY time LIMIT 10")
              table = cursor.fetchall()
              conn.close()

              table_new = []
              for i in range (len(table)):
                     holder = {}
                     holder['time'] = table[i][0]
                     table_new.append(holder)

              if len(table) < 10:
                     return jsonify("high score")
              else:
                     if result['time'] < table_new[9]['time']:
                            return jsonify("high score")
                     else:
                            return jsonify("not a high score")

       elif result['difficulty'] == "intermediate":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("SELECT time FROM intermediate ORDER BY time LIMIT 10")
              table = cursor.fetchall()
              conn.close()

              table_new = []
              for i in range (len(table)):
                     holder = {}
                     holder['time'] = table[i][0]
                     table_new.append(holder)

              if len(table) < 10:
                     return jsonify("high score")
              else:
                     if result['time'] < table_new[9]['time']:
                            return jsonify("high score")
                     else:
                            return jsonify("not a high score")

       elif result['difficulty'] == "expert":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("SELECT time FROM expert ORDER BY time LIMIT 10")
              table = cursor.fetchall()
              conn.close()

              table_new = []
              for i in range (len(table)):
                     holder = {}
                     holder['time'] = table[i][0]
                     table_new.append(holder)

              if len(table) < 10:
                     return jsonify("high score")
              else:
                     if result['time'] < table_new[9]['time']:
                            return jsonify("high score")
                     else:
                            return jsonify("not a high score")

       else:
              return jsonify("something else")


@app.route("/save", methods = ["POST"])
def save():
       result = request.get_json()

       if result['name'] == None:
              return jsonify("no name entered")

       if result['difficulty'] == "beginner":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("INSERT INTO beginner (time, name, os) VALUES (?, ?, ?)", (result['time'], result['name'], result['os']))
              conn.commit()
              conn.close()

       elif result['difficulty'] == "intermediate":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("INSERT INTO intermediate (time, name, os) VALUES (?, ?, ?)", (result['time'], result['name'], result['os']))
              conn.commit()
              conn.close()

       elif result['difficulty'] == "expert":
              conn = sqlite3.connect('scores.db')
              cursor = conn.cursor()
              cursor.execute("INSERT INTO expert (time, name, os) VALUES (?, ?, ?)", (result['time'], result['name'], result['os']))
              conn.commit()
              conn.close()

       else:
              return jsonify("problem saving high score")

       return jsonify("high score saved")


@app.route("/dump", methods = ["POST"])
def dump():
       result = request.get_json()

       conn = sqlite3.connect('scores.db')
       cursor = conn.cursor()
       cursor.execute("INSERT INTO dump (difficulty, result, time, os) VALUES (?, ?, ?, ?)", (result['difficulty'], result['result'], result['time'], result['os']))
       conn.commit()
       conn.close()

       return jsonify("dumped")


@app.route("/stats")
def stats():
       conn = sqlite3.connect('scores.db')
       cursor = conn.cursor()

       beginner_stats = {}
       cursor.execute("SELECT id FROM beginner")
       wins = cursor.fetchall()
       beginner_stats["wins"] = len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'beginner' AND result =='win'")
       wins = cursor.fetchall()
       beginner_stats["wins"] += len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'beginner' AND result == 'lose'")
       losses = cursor.fetchall()
       beginner_stats["losses"] = len(losses)
       beginner_stats['win-p'] = round(beginner_stats['wins'] / (beginner_stats['wins'] + beginner_stats['losses']) * 100)

       intermediate_stats = {}
       cursor.execute("SELECT id FROM intermediate")
       wins = cursor.fetchall()
       intermediate_stats["wins"] = len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'intermediate' AND result =='win'")
       wins = cursor.fetchall()
       intermediate_stats["wins"] += len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'intermediate' AND result == 'lose'")
       losses = cursor.fetchall()
       intermediate_stats["losses"] = len(losses)
       intermediate_stats['win-p'] = round(intermediate_stats['wins'] / (intermediate_stats['wins'] + intermediate_stats['losses']) * 100)

       expert_stats = {}
       cursor.execute("SELECT id FROM expert")
       wins = cursor.fetchall()
       expert_stats["wins"] = len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'expert' AND result =='win'")
       wins = cursor.fetchall()
       expert_stats["wins"] += len(wins)
       cursor.execute("SELECT id FROM dump WHERE difficulty == 'expert' AND result == 'lose'")
       losses = cursor.fetchall()
       expert_stats["losses"] = len(losses)
       expert_stats['win-p'] = round(expert_stats['wins'] / (expert_stats['wins'] + expert_stats['losses']) * 100)

       conn.close()
       
       return render_template("stats.html", beginner_stats=beginner_stats, intermediate_stats=intermediate_stats, expert_stats=expert_stats)


@app.route("/controls")
def controls():
       return render_template("controls.html")


@app.route("/sorry")
def sorry():
       return render_template("sorry.html")


@app.route("/about")
def about():
       return render_template("about.html")