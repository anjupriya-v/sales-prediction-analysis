
from contextlib import nullcontext
import datetime
from functools import wraps
from http.client import HTTPException
from flask import Flask,request,jsonify,session
import json
from flask_cors import CORS

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')
import pymongo
from pylab import rcParams
import statsmodels.api as sm
from dateutil import parser
from sklearn.metrics import mean_squared_error
from math import sqrt
from sklearn import metrics
from passlib.hash import  pbkdf2_sha256
import warnings
from statsmodels.tools.sm_exceptions import ConvergenceWarning
warnings.simplefilter('ignore', ConvergenceWarning)


mongoDB=pymongo.MongoClient('MONGODB_URL')
db=mongoDB['SalesPrediction']
account=db.account

app=Flask(__name__)
app.secret_key='SECRET_KEY'
CORS(app)


            
@app.route("/getPredictions/<email>",methods=["POST"])
def postPrediction(email):
    print(request.files['file'])
    if request.method=="POST":
        title=request.form.get('title')
        file=request.files['file']
        predictColumn=request.form.get('predictColumn')
        periodicity=request.form.get('periodicity')
        numbericalValue=request.form.get('numericalValue')
        
        if(periodicity=='Yearly'):
            freq='Y'
        elif(periodicity=='Monthly'):
            freq='M'
        elif(periodicity=='Weekly'):
            freq='W'
        else:
            freq='D'

        data=pd.read_csv(file, encoding='Latin-1')
        to_drop = ['ADDRESS_LINE2','STATE','POSTAL_CODE','TERRITORY','PRODUCT_CODE','CUSTOMER_NAME','PHONE','ADDRESS_LINE1','CITY','CONTACT_LAST_NAME','CONTACT_FIRST_NAME']
        data = data.drop(to_drop, axis = 1)
        data['STATUS'].unique()
        data['STATUS'] = pd.factorize(data.STATUS)[0] + 1
        data['PRODUCT_LINE'].unique()
        data['PRODUCT_LINE'] = pd.factorize(data.PRODUCT_LINE)[0] + 1
        data['COUNTRY'].unique()
        data['COUNTRY'] = pd.factorize(data.COUNTRY)[0] + 1
        data['DEAL_SIZE'].unique()
        data['DEAL_SIZE'] = pd.factorize(data.DEAL_SIZE)[0] + 1
        data['ORDER_DATE'] = pd.to_datetime(data['ORDER_DATE'])
        df = pd.DataFrame(data)
        data.sort_values(by = ['ORDER_DATE'], inplace = True)
        data.set_index('ORDER_DATE', inplace = True)
        df.sort_values(by = ['ORDER_DATE'], inplace = True, ascending = True)
        df.set_index('ORDER_DATE', inplace = True)
        new_data = pd.DataFrame(df[predictColumn])
        new_data = pd.DataFrame(new_data[predictColumn].resample(freq).mean())
        new_data = new_data.interpolate(method = 'linear')

        #Method to Checking for Stationary: A stationary process has the property that the mean, variance and autocorrelation structure do not change over time.
        train, test, validation = np.split(new_data[predictColumn].sample(frac = 1), [int(.6*len(new_data[predictColumn])), int(.8*len(new_data[predictColumn]))])
        print('Train Dataset')
        print(train)
        print('Test Dataset')
        print(test)
        print('Validation Dataset')
        print(validation)

        #SARIMA MODEL
        mod = sm.tsa.statespace.SARIMAX(new_data,
                                order=(1, 1, 1),
                                seasonal_order=(1, 1, 1, 12),
                                enforce_invertibility=False)
        results = mod.fit()
        pred = results.get_prediction()
        if(freq=='D'):
            pred = results.get_prediction(start=pd.to_datetime('2003-01-06'), dynamic=False)
        pred.conf_int()
        y_forecasted = pred.predicted_mean
        y_truth = new_data[predictColumn]

        mse = mean_squared_error(y_truth,y_forecasted)
        rmse = sqrt(mse)
        mae=metrics.mean_absolute_error(y_forecasted, y_truth)
        mape=metrics.mean_absolute_percentage_error( y_truth,y_forecasted)
        mape=round(mape*100, 2)
        forecast = results.forecast(steps=int(numbericalValue))
        forecast = forecast.astype('float')
        forecast_df = forecast.to_frame()
        forecast_df.reset_index(level=0, inplace=True)
        forecast_df.columns = ['PredictionDate', 'PredictedColumn']
        print(forecast_df)
        frame= pd.DataFrame(forecast_df)
        frameDict=frame.to_dict('records')
        
        predicted_date=[]
        predicted_column=[]
        for i in range(0,len(frameDict)):
            predicted_column.append(frameDict[i]['PredictedColumn'])
            tempStr=str(frameDict[i]['PredictionDate'])
            dt = parser.parse(tempStr)
            predicted_date.append(dt.strftime('%A')[0:3]+', '+str(dt.day)+' '+dt.strftime("%b")[0:3]+' '+str(dt.year))    
        if(account.find_one({'email':email})):
                account.update_one({"email":email},
                    {
                            "$set":{'currentPrediction':{
                                    "mae":mae, "mape":mape,"mse":mse,"predictedColumn":predicted_column,"predictedDate":predicted_date,"rmse":rmse,"title":title,"predictedColumnName":'Predicted '+predictColumn.lower(),"columnName":predictColumn.capitalize(),"periodicity":periodicity,"numericalValue":numbericalValue
                            }
                                    },
                            
                            
                    })


        prediction =frame.to_csv('../client/src/assets/file/prediction.csv',index=False)
        dfd = pd.read_csv('../client/src/assets/file/prediction.csv')
        return jsonify(data="Predicted")


@app.route("/currentPrediction/<email>",methods=["GET"])
def getCurrentPrediction(email):
    if request.method=="GET":
        currentUser=account.find_one({"email":email})
        currentPredictionDetails=currentUser['currentPrediction']
        return jsonify(data=currentPredictionDetails)


@app.route("/savePrediction/",methods=["POST"])
def savePrediction():
    if request.method=="POST":
        current_time = datetime.datetime.now()
        currentUser=account.find_one({"email":request.form.get('email')})
        countValue=currentUser['count']
        savePredictionData={
            "dateAndTime":current_time.strftime("%b %d %Y %I:%M:%S %p"),
            'title':request.form.get('title'),
            'email':request.form.get('email'),
            'predicted_date': json.loads(request.form.get('predicted_date')),
            'predicted_column': json.loads(request.form.get('predicted_column')),
            'predictedColumnName': request.form.get('predictedColumnName'),
            'columnName': request.form.get('columnName'),
            'mape': request.form.get('mape'),
            'mae': request.form.get('mae'),
            'rmse': request.form.get('rmse'),
            'mse': request.form.get('mse'),
            'periodicity':request.form.get('periodicity'),
            'numericalValue':request.form.get('numericalValue')

        }
        account.update_one({ "email" : savePredictionData['email']},
            { "$push": {"predictionData": savePredictionData
        }})
        account.update_one({'email':savePredictionData['email']},{
            "$set":{"count":int(countValue)+1}
        })
        return jsonify(data="New Message")


@app.route("/getSavedPredictions/<email>",methods=["GET"])
def getSavedPredictions(email):
    if request.method=="GET":
        getSavedPredictions=account.find({"email":email},{"_id":0,"predictionData":1,"count":1})
        return jsonify(data=list(getSavedPredictions))


@app.route("/deletePrediction/<dateAndTime>/<email>",methods=["DELETE"])
def deletePrediction(dateAndTime,email):
    if request.method=="DELETE":
        account.update_one(
            { "email" : email }, 
            { "$pull": { "predictionData": { "dateAndTime": dateAndTime } } }
        )
    getSavedPredictions=account.find({"email":email},{"_id":0,"predictionData":1})
    return jsonify(data=list(getSavedPredictions))



def start_session(userInfo):
    if userInfo:
        userInfo['_id']=str(userInfo['_id'])
    else:
        raise HTTPException(status_code=404, detail=f"Unable to retrieve record")
    del userInfo['password']
    session['logged_in']=True
    session['user']=userInfo
    return jsonify(data={"sessionLoggedIn":session['logged_in'],"userInfo":session['user']})


@app.route('/sign-in/',methods=['POST'])
def signIn():
    if request.method=="POST":
        email=request.form.get("email")
        password=request.form.get("password")
        if(account.find_one({"email":email})):
            user=account.find_one({"email":email})
            if(user and pbkdf2_sha256.verify(password,user['password'])):
                return start_session(user)
            else:
                return "Password is incorrect"
        return 'Sorry, user with this email id does not exist'
@app.route('/sign-up/',methods=['POST'])
def signUp():
    if request.method=="POST":
        userInfo={
        "fullName":request.form.get('fullName'),
        "email":request.form.get('email'),
        "phoneNumber":request.form.get('phoneNumber'),
        "password":request.form.get('password'),
        "count":0,
        }
        userInfo['password']=pbkdf2_sha256.encrypt(userInfo['password'])
        if(account.find_one({"email":userInfo['email']})):
            return 'Sorry,user with this email already exist'
        if(account.insert_one(userInfo)):
            return start_session(userInfo)     
    return 'signup failed'


@app.route('/logout/',methods=["GET"])
def signout():
    if request.method=="GET":
        session.clear()
    return jsonify("logout successful")



if __name__=="__main__":
    app.run(debug=True)