from flask import Flask
from flask import render_template, redirect, request, url_for
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

@app.route('/')
def index():
    work_time = request.args.get('work_time', default = 25, type = int)
    break_time = request.args.get('break_time', default = 5, type = int)
    cycles = request.args.get('cycles', default = 4, type = int)
    return(render_template('index.html', work_time = work_time, break_time = break_time, cycles = cycles))

@app.route('/settings/', methods = ['GET', 'POST'])
def settings():
    if request.method == 'POST':
        work_time = request.form.get('work_time', type = int)
        break_time = request.form.get('break_time', type = int)
        cycles = request.form.get('cycles', type = int)
        return(redirect(url_for('index', work_time = work_time, break_time = break_time, cycles = cycles)))
    else:
        return(render_template('settings.html'))
