const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require("mongoose");
const { Issue } = require("../schema");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to `/api/issues/{project}`", (done) => {
    const now = new Date().getTime();
    chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
        assigned_to: "test-assigned-to",
        status_text: "test-status-text",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // search for an issue on project <now>, check it for 200 and deepequal
        Issue.findOne({ project: `fcc-${now}` }, (err, obj) => {
          if (err) console.error(err);
          assert.equal(obj.issue_title, "test-issue-title");
          assert.equal(obj.issue_text, "test-issue-text");
          assert.equal(obj.created_by, "test-created-by");
          assert.equal(obj.assigned_to, "test-assigned-to");
          assert.equal(obj.status_text, "test-status-text");
          assert.equal(obj.project, `fcc-${now}`);
          done();
        });
      });
  });
  test("Create an issue with only required fields: POST request to `/api/issues/{project}`", (done) => {
    const now = new Date().getTime();
    chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        // search for an issue on project <now>, check it for 200 and deepequal
        Issue.findOne({ project: `fcc-${now}` }, (err, obj) => {
          if (err) console.error(err);
          assert.equal(obj.issue_title, "test-issue-title");
          assert.equal(obj.issue_text, "test-issue-text");
          assert.equal(obj.created_by, "test-created-by");
          assert.equal(obj.assigned_to, "");
          assert.equal(obj.status_text, "");
          assert.equal(obj.project, `fcc-${now}`);
          done();
        });
      });
  });
  // test("Create an issue with missing required fields: POST request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("View issues on a project: GET request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("View issues on a project with one filter: GET request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("View issues on a project with multiple filters: GET request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Update one field on an issue: PUT request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Update multiple fields on an issue: PUT request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Update an issue with missing _id: PUT request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Update an issue with no fields to update: PUT request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Update an issue with an invalid _id: PUT request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Delete an issue: DELETE request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Delete an issue with an invalid _id: DELETE request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
  // test("Delete an issue with missing _id: DELETE request to `/api/issues/{project}`", (done) => {
  //   assert.fail();
  // });
});
