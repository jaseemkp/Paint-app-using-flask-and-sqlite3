from flask import Flask, render_template, request, g , redirect
import sqlite3
import json
app = Flask(__name__)

def connect_db():
    return sqlite3.connect('paint.db')

@app.before_request
def before_request():
    g.db = connect_db()
    g.db.execute("CREATE TABLE IF NOT EXISTS drawings(fname string primary key, img_data text)")
@app.after_request
def after_request(response):
    g.db.close()
    return response

@app.route('/', methods=['GET', 'POST'])
def paint():
    if request.method == 'GET':
        py_all = {}
        all_data = g.db.execute("SELECT * FROM drawings")
        for data in all_data:
            py_all[data[0]] = data[1]
        return render_template('paint.html', py_all= py_all)
    elif request.method == 'POST':
        filename = request.form['fname']
        data = request.form['whole_data']
        g.db.execute("REPLACE INTO drawings(fname, img_data) VALUES (?, ?)", (filename, data));
        g.db.commit()
        return redirect('/')

if __name__ == '__main__':
   app.run()
