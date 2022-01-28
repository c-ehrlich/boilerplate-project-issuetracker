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
        assert.include(res.body, {
          issue_title: "test-issue-title",
          issue_text: "test-issue-text",
          created_by: "test-created-by",
          assigned_to: "test-assigned-to",
          status_text: "test-status-text", 
          open: true,
        });
        assert.exists(res.body.created_on);
        assert.exists(res.body.updated_on);
        done();
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
        assert.include(res.body, {
          issue_title: "test-issue-title",
          issue_text: "test-issue-text",
          created_by: "test-created-by",
          assigned_to: "",
          status_text: "", 
          open: true,
        });
        assert.exists(res.body.created_on);
        assert.exists(res.body.updated_on);
        done();
      });
  });

  test("Create an issue with missing required fields: POST request to `/api/issues/{project}`", (done) => {
    const now = new Date().getTime();
    chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        assigned_to: "test",
        status_text: "test",
      })
      .end((err, res) => {
        if (err) console.log(error);
        assert.equal(res.status, 400);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

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
