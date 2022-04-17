# Issue Tracker
Sample deployment: https://fcc-issuetracker1.herokuapp.com/

## What is this?
A REST API for creating and managing Issues for a software project.

Part of the [freeCodeCamp Testing Certification](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker).

## Installation
* Clone down the repo
* Create a MongoDB Database. One possbility for this is using [MongoDB Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).
* In the root directory of the project, create a .env file containing: `MONGO_URI: <your Mongo URI>`
* `npm i`
* `npm start`

## Sample deployment
https://fcc-exercise-tracker-service.herokuapp.com/

## Deployment
Heroku is shown as a sample deployment.

With the [Heroku CLI](https://devcenter.heroku.com/categories/command-line) installed,
```
heroku login -i
heroku create <app name>
heroku git:remote -a <app name>
git push heroku main
```
* Create a MongoDB Database. One possbility for this is using [MongoDB Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/).
* In the Heroku Project Settings, in Config Vars add key `MONGO_URI`, value is the URI of your MongoDB Database.

## Sample Requests
### View all issues for a project
#### Request
```
GET https://fcc-issuetracker1.herokuapp.com/api/issues/<projectname>
```
#### Sample Response
```json
[
    {
        "_id": "61f3ccfb72b748bb89262ee8",
        "project": "apitest",
        "assigned_to": "cje",
        "status_text": "working on it",
        "open": true,
        "issue_title": "bug: when foo, bar doesn't happen",
        "issue_text": "foo..................see, it doesn't happen",
        "created_by": "hunter2",
        "created_on": "2022-01-28T11:01:15.843Z",
        "updated_on": "2022-01-28T11:01:15.843Z",
        "__v": 0
    },
    {
        "_id": "61f3cd4a14a920db8e6cb5ab",
        "project": "apitest",
        "assigned_to": "hunter2",
        "status_text": "urgent",
        "open": false,
        "issue_title": "passwords are sent in plaintext",
        "issue_text": "this is bad!!!",
        "created_by": "cje",
        "created_on": "2022-01-28T11:02:34.835Z",
        "updated_on": "2022-01-28T11:02:34.835Z",
        "__v": 0
    },
]
```
### View only open or closed issues for a project
#### Request
```
GET https://fcc-issuetracker1.herokuapp.com/api/issues/<projectname>?open=false
```
#### Response
```json
[
    {
        "_id": "61f3cd4a14a920db8e6cb5ab",
        "project": "apitest",
        "assigned_to": "hunter2",
        "status_text": "urgent",
        "open": false,
        "issue_title": "passwords are sent in plaintext",
        "issue_text": "this is bad!!!",
        "created_by": "cje",
        "created_on": "2022-01-28T11:02:34.835Z",
        "updated_on": "2022-01-28T11:02:34.835Z",
        "__v": 0
    },
]
```
### Open an issue
#### Request
```
POST https://fcc-issuetracker1.herokuapp.com/api/issues/apitest
```
```json
{
    "issue_title": "test",
    "issue_text": "test2",
    "created_by": "test3",
    "assigned_to": "test4",
    "status_text": "test5",
}
```
#### Response
```json
{
    "_id": "625bb066c4451b7cc88a42b0",
    "open": true,
    "issue_title": "test",
    "issue_text": "test2",
    "created_by": "test3",
    "assigned_to": "test4",
    "status_text": "test5",
    "created_on": "2022-04-17T06:15:02.584Z",
    "updated_on": "2022-04-17T06:15:02.584Z"
}
```
### Update an issue
#### Request
I would suggest using PATCH here as partial updates are allowed, but the API spec suggests PUT.
```
PUT https://fcc-issuetracker1.herokuapp.com/api/issues/apitest
```
```json
{
    "_id": "625bb066c4451b7cc88a42b0",
    "issue_title": "updated title"
}
```
#### Response
```json
{
    "result": "successfully updated",
    "_id": "625bb066c4451b7cc88a42b0"
}
```
### Delete an issue
#### Request
```
DELETE https://fcc-issuetracker1.herokuapp.com/api/issues/apitest
```
```json
{
    "_id": "625bb066c4451b7cc88a42b0"
}
```
#### Response
```json
{
    "result": "successfully deleted",
    "_id": "625bb066c4451b7cc88a42b0"
}
```