from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('home.html')

@app.route('/donella-dnd')
def donella_dnd():
    return render_template('donella-dnd.html')

@app.route('/donella-code')
def donella_code():
    return render_template('donella.html')

@app.route('/specifications')
def specifications():
    return render_template('specifications.html')

if __name__ == '__main__':
    app.run()