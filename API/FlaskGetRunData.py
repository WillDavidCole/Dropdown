import flask
import pyodbc
from flask import request, jsonify

###database connectioon
server = 'LOCALHOST' 
database = 'wic_dream_snapshot' 

print("connecting.......")
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server + '; DATABASE='+database+'; TRUSTED_CONNECTION=yes')
cursor = cnxn.cursor()
print("connected!")

##flask
app = flask.Flask(__name__)
app.config["DEBUG"] = True

## routes to each webpage
@app.route('/')
def home():
    return {}

@app.route('/modeltree', methods=['GET'])
def modeltree():
    ModelId = 17
    if request.method=="GET":
        cursor.execute('[dbo].[stp_Calibration_GetRunInputs] @ModelId = ?',ModelId )
        rv = cursor.fetchall()
        # modify this bit to suit
    json_data=[]
    row_headers = ["Id","ModelId","RunId","PortfolioId","RunReviewStatusId","Date","ModelName","Type","DataId","DataName","CurrencyId","CountryId","Value"]
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))
    return jsonify(json_data)

    
@app.route('/runinputs', methods=['GET'])
def runinputs():
    RunId = 19224
    if request.method=="GET":
        cursor.execute('[dbo].[stp_Calibration_GetRunInputs] @RunId = ?',RunId )
        rv = cursor.fetchall()
        
    json_data=[]
    row_headers = ["Id","ModelId","RunId","PortfolioId","RunReviewStatusId","Date","ModelName","Type","DataId","DataName","CurrencyId","CountryId","Value"]
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))
    return jsonify(json_data)

if __name__ == "__main__": 
    app.run()