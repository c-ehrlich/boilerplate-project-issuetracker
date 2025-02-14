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
      // make sure an object ID is given
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      // make sure we're actually updating something
      if (JSON.stringify(Object.keys(req.body)) === JSON.stringify(["_id"])) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      }

      const project = req.params.project;
      const updatePayload = {
        ...(req.body.issue_title !== "" && {
          issue_title: req.body.issue_title,
        }),
        ...(req.body.issue_text !== "" && { issue_text: req.body.issue_text }),
        ...(req.body.created_by !== "" && { created_by: req.body.created_by }),
        ...(req.body.assigned_to !== "" && {
          assigned_to: req.body.assigned_to,
        }),
        ...(req.body.status_text !== "" && {
          status_text: req.body.status_text,
        }),
        ...(req.body.open && { open: req.body.open }),
      };

      Issue.findOneAndUpdate(
        { _id: req.body._id, project: project },
        updatePayload,
        (err, obj) => {
          if (!obj) {
            // this check needs to go before the `if (err)` check
            // because not getting an obj can happen both with and without err
            return res.json({
              error: "could not update",
              _id: req.body._id,
            });
          }

          if (err) {
            console.error(err);
            return res.json({ error: "could not update", _id: req.body._id });
          }

          return res.json({
            result: "successfully updated",
            _id: obj._id,
          });
        }
      );
    })

    .delete((req, res) => {
      const project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      Issue.findOneAndDelete(
        { _id: req.body._id, project: project },
        (err, obj) => {
          if (!obj) {
            return res.json({ error: "could not delete", _id: req.body._id });
          }
          if (err) {
            console.error(err);
            return res.json({ error: "could not delete", _id: req.body._id });
          }
          return res.json({
            result: "successfully deleted",
            _id: obj._id,
          });
        }
      );
    });
};
