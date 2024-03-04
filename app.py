from flask import Flask, render_template, url_for, request, jsonify
from datetime import datetime
import pyrebase

app = Flask(__name__)

# Look at the lot of notes on slide 15 for 4.4.2 Flask & Firebase presentation

config = {}
key = 0         # If recording data over time, keys should be seconds or milliseconds from 0

@app.route("/")         # Landing Page
def index():
    return render_template("index.html")

@app.route("/authors") # Account Registration Page
def authors():
    return render_template("authors.html")

@app.route("/results")   # Sign In Page
def results():
    return render_template("results.html")

@app.route("/procedure")     # Account Home Page
def procedure():
    return render_template("procedure.html")

# Route to the test Pyrebase setup and transfer Arduino data to Firebase
@app.route("/test", methods=['GET', 'POST'])
def test():

    global config, userID, db, timeStamp, key

    # POST request (FB configuration sent from login.js)
    if request.method =="POST":

        # Get time stamp to be used as firebase node
        # Each data set will be store under its own child node identified the timestamp
        timeStamp = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

        # Recieve Firebase configuration credentials, pop uid and assign to userID
        config = request.get_json()     # pase as JSON
        userID = config.pop('userID')   # userID used for updating data in FRD

        # Output to a console (or file) is normally buffered (stored) until it is 
        # forced out by the printing of a newline. Flush will force the information
        # in the buffer to be printed immediately.

        print('User ID: ' + userID, flush=True) # Debug only
        print(config, flush=True)               # Debug only

        # Intialize firebase connection
        firebase = pyrebase.initialize_app(config)

        # Create database object ("db" represents the root node in the database)
        db = firebase.database()

        # Write sample data to FB to test connection
        # db.child('users/' + userID + '/data/' + '/' + timeStamp).update({'testKey': 'testValue'})

        return 'Success', 200
    else:
        # Code to get data from Arduino will go here
        if(bool(config) == False):  # If config is empty, bool(config) returns false
            print("FB config is empty")

        else:
            # Take parameters fromArduino request and assign value to variable "Value"

            #print(config)
            value = request.args.get('distance')

            print('Distance: ' + value, flush=True)

            # Write arduino adata to Firebase
            db.child('users/' + userID + '/data/' + '/' + timeStamp).update({key:value})

            # Increment key
            key += 1
        return "Success"

# Run server on local IP address on port 5000
if __name__ == "__main__":
    app.run(debug=False, host='10.47.237.91', port=5000)