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
      let promise = Issue.find({
        project: project,
        ...(req.query._id && { _id: req.query._id }),
        ...(req.query.assigned_to && { assigned_to: req.query.assigned_to }),
        ...(req.query.created_by && { created_by: req.query.created_by }),
        ...(req.query.issue_text && { issue_text: req.query.issue_text }),
        ...(req.query.issue_title && { issue_title: req.query.issue_title }),
        ...(req.query.open && { open: req.query.open }),
        ...(req.query.status_text && { status_text: req.query.status_text }),
      }).exec();
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
        assigned_to: req.body.assigned_to ?? "",
        created_by: req.body.created_by,
        created_on: date,
        issue_text: req.body.issue_text,
        issue_title: req.body.issue_title,
        open: req.body.open ?? true,
        project: project,
        status_text: req.body.status_text ?? "",
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
      const updatePayload = {
        ...(req.body.issue_title !== "" && {
          issue_title: req.body.issue_title,
        }),
        ...(req.body.issue_text !== "" && { issue_text: req.body.issue_text }),
        ...(req.body.created_by !== "" && { created_by: req.body.created_by }),
        ...(req.body.assigned_to !== "" && {
          assigned_to: req.body.assigneD_to,
        }),
        ...(req.body.status_text !== "" && {
          status_text: req.body.status_text,
        }),
        ...(req.body.open && { open: req.body.open }),
      };

      Issue.findByIdAndUpdate(req.body._id, updatePayload, (err, obj) => {
        if (err) {
          console.error(err);
          return res.json({ error: "failed to find or update issue." });
        }
        return res.json({
          result: "successfully updated",
          _id: obj._id,
        });
      });
    })

    .delete((req, res) => {
      const project = req.params.project;

      // return {"result":"successfully deleted","_id":"5fce41fb83169401c9bb5186"}
      // return ?? something... issue not found?
    });
};
