from flask import Flask
from flask import render_template, redirect, request, url_for

app = Flask(__name__)

setting_dict = {}

@app.route('/')
def index():
    work_time = setting_dict.get('work_time', 25)
    short_break_time = setting_dict.get('short_break_time', 5)
    cycles = setting_dict.get('cycles', 4)
    long_break_time = setting_dict.get('long_break_time', 15)
    return(render_template('index.html', work_time = work_time, short_break_time = short_break_time, cycles = cycles, long_break_time = long_break_time))

@app.route('/settings/', methods = ['GET', 'POST'])
def settings():
    if request.method == 'POST':
        work_time = request.form.get('work_time', type = int)
        short_break_time = request.form.get('short_break_time', type = int)
        cycles = request.form.get('cycles', type = int)
        long_break_time = request.form.get('long_break_time', type = int)
        setting_dict['work_time'] = work_time
        setting_dict['short_break_time'] = short_break_time
        setting_dict['cycles'] = cycles
        setting_dict['long_break_time'] = long_break_time
        return(redirect(url_for('index')))
    else:
        return(render_template('settings.html'))


if __name__ == "__main__":
    app.run(debug=True)
