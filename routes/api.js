"use strict";
const mongoose = require("mongoose");
const { assert } = require("chai");

const { Issue } = require("../schema");
const { prepareIssueForJson } = require("../utils");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get((req, res) => {
      const project = req.params.project;
      let promise = Issue.find({ project: project }).exec();
      assert.ok(promise instanceof Promise);
      promise.then((issues) => {
        res.json(issues);
      });
    })

    .post((req, res) => {
      const project = req.params.project;
      const date = new Date();

      // check that we have all the required items
      if (
        !(req.body.issue_title && req.body.issue_text && req.body.created_by)
      ) {
        res.status(400);
        return res.json({ error: "required field(s) missing" });
      }

      const issue = new Issue({
        project: project,
        assigned_to: req.body.assigned_to ?? "",
        status_text: req.body.status_text ?? "",
        open: req.body.open ?? true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: date,
        updated_on: date,
      });

      issue.save().then((object) => {
        // TODO check that the object is ok
        const issue = prepareIssueForJson(object);
        return res.json(issue);
      });
    })

    .put((req, res) => {
      const project = req.params.project;

      // return the updated issue
    })

    .delete((req, res) => {
      const project = req.params.project;

      // return {"result":"successfully deleted","_id":"5fce41fb83169401c9bb5186"}
      // return ?? something... issue not found?
    });
};
