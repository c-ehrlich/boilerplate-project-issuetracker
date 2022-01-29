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

    // Create issue
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

    // Create issue
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

    // Create issue
    chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        assigned_to: "test",
        status_text: "test",
      })
      .end((err, res) => {
        if (err) console.error(error);
        assert.equal(res.status, 400);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  test("View issues on a project: GET request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();

    // Create Issue
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
      });
    assert.equal(createRes.status, 200);

    // View issues
    const readRes = await chai.request(server).get(`/api/issues/fcc-${now}`);
    assert.equal(readRes.status, 200);
    assert.equal(readRes.body.length, 1);
    assert.equal(readRes.body[0].issue_title, "test-issue-title");
    assert.equal(readRes.body[0].issue_text, "test-issue-text");
    assert.equal(readRes.body[0].created_by, "test-created-by");
  });

  test("View issues on a project with one filter: GET request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();
    const created_by_filter = "test-created-by";
    const not_created_by_filter = "foo";

    // Create an Issue
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: created_by_filter,
      });
    assert.equal(createRes.status, 200);

    // Search with correct filter
    const readRes = await chai
      .request(server)
      .get(`/api/issues/fcc-${now}?created_by=${created_by_filter}`);
    assert.equal(readRes.status, 200);
    assert.equal(
      readRes.body.length,
      1,
      "Checking that filtering for the right thing returns it"
    );
    assert.equal(readRes.body[0].issue_title, "test-issue-title");
    assert.equal(readRes.body[0].issue_text, "test-issue-text");
    assert.equal(readRes.body[0].created_by, "test-created-by");

    // Search with incorrect filter
    const readRes2 = await chai
      .request(server)
      .get(`/api/issues/fcc-${now}?created_by=${not_created_by_filter}`);
    assert.equal(readRes.status, 200);
    assert.equal(
      readRes2.body.length,
      0,
      "Checking that filtering for the wrong thing doesn't return anything"
    );
  });

  test("View issues on a project with multiple filters: GET request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();
    const created_by_filter = "test-created-by";
    const not_created_by_filter = "foo";
    const open_filter = true;
    const not_open_filter = false;

    // create an Issue object
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: created_by_filter,
      });
    assert.equal(createRes.status, 200, "createRes status");

    // filter by the correct `created_by` and `open`
    const readRes1 = await chai
      .request(server)
      .get(
        `/api/issues/fcc-${now}?created_by=${created_by_filter}&open=${open_filter}`
      );
    assert.equal(readRes1.status, 200, "readRes1 status");
    assert.equal(
      readRes1.body.length,
      1,
      "Checking that filtering for the right thing returns it"
    );
    assert.equal(readRes1.body[0].issue_title, "test-issue-title");
    assert.equal(readRes1.body[0].issue_text, "test-issue-text");
    assert.equal(readRes1.body[0].created_by, "test-created-by");

    // filter by incorrect `created_by`
    const readRes2 = await chai
      .request(server)
      .get(
        `/api/issues/fcc-${now}?created_by=${not_created_by_filter}&open=${open_filter}`
      );
    assert.equal(readRes2.status, 200, "readRes2 status");
    assert.equal(
      readRes2.body.length,
      0,
      "Checking that filtering for the wrong `created_by` doesn't return anything"
    );

    // filter by incorrect `open`
    const readRes3 = await chai
      .request(server)
      .get(
        `/api/issues/fcc-${now}?created_by=${created_by_filter}&open=${not_open_filter}`
      );
    assert.equal(readRes3.status, 200, "readRes3 status");
    assert.equal(
      readRes3.body.length,
      0,
      "Checking that filtering for the wrong `open` doesn't return anything"
    );
  });

  test("Update one field on an issue: PUT request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();

    // Create Issue
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
        assigned_to: "test-assigned-to",
        status_text: "test-status-text",
      });
    assert.equal(createRes.status, 200, "createRes status");
    assert.include(createRes.body, {
      issue_title: "test-issue-title",
      issue_text: "test-issue-text",
      created_by: "test-created-by",
      assigned_to: "test-assigned-to",
      status_text: "test-status-text",
      open: true,
    });

    // Update Issue
    const _id = createRes.body._id;

    const updateRes = await chai
      .request(server)
      .put(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        _id: _id,
        issue_title: "updated-title",
      });
    assert.equal(updateRes.status, 200, "updateRes status");
    assert.deepEqual(updateRes.body, {
      result: "successfully updated",
      _id: _id,
    });

    // Retrieve Issue, check modified object
    const retrieveRes = await chai
      .request(server)
      .get(`/api/issues/fcc-${now}?_id=${_id}`);
    assert.equal(retrieveRes.status, 200, "retrieveRes status");
    assert.equal(retrieveRes.body[0].issue_title, "updated-title");

    await Promise.resolve();
  });

  test("Update multiple fields on an issue: PUT request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();

    // Create Issue
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
        assigned_to: "test-assigned-to",
        status_text: "test-status-text",
      });
    assert.equal(createRes.status, 200, "createRes status");
    assert.include(createRes.body, {
      issue_title: "test-issue-title",
      issue_text: "test-issue-text",
      created_by: "test-created-by",
      assigned_to: "test-assigned-to",
      status_text: "test-status-text",
      open: true,
    });

    // Update Issue
    const _id = createRes.body._id;

    const updateRes = await chai
      .request(server)
      .put(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        _id: _id,
        issue_title: "updated-issue-title",
        issue_text: "updated-issue-text",
        created_by: "updated-created-by",
        assigned_to: "updated-assigned-to",
        status_text: "updated-status-text",
        open: false,
      });
    assert.equal(updateRes.status, 200, "updateRes status");
    assert.deepEqual(updateRes.body, {
      result: "successfully updated",
      _id: _id,
    });

    // Retrieve Issue, check modified object
    const retrieveRes = await chai
      .request(server)
      .get(`/api/issues/fcc-${now}?_id=${_id}`);
    assert.equal(retrieveRes.status, 200, "retrieveRes status");
    // assert.equal(retrieveRes.body[0].issue_title, "updated-issue-title");
    assert.ownInclude(retrieveRes.body[0], {
      _id: _id,
      issue_title: "updated-issue-title",
      issue_text: "updated-issue-text",
      created_by: "updated-created-by",
      assigned_to: "updated-assigned-to",
      status_text: "updated-status-text",
      open: false,
    });
  });

  test("Update an issue with missing _id: PUT request to `/api/issues/{project}`", async () => {
    // Attempt to update Issue
    const updateRes = await chai
      .request(server)
      .put(`/api/issues/foo`)
      .type("form")
      .send({
        issue_title: "updated-title",
      });
    assert.equal(updateRes.status, 400, "updateRes status");
    assert.deepEqual(updateRes.body, {
      error: "missing _id",
    });
  });

  test("Update an issue with no fields to update: PUT request to `/api/issues/{project}`", async () => {
    // Attempt to update Issue
    const updateRes = await chai
      .request(server)
      .put(`/api/issues/foo`)
      .type("form")
      .send({
        _id: "foo",
      });
    assert.equal(updateRes.status, 400, "updateRes status");
    assert.deepEqual(updateRes.body, {
      error: "no update field(s) sent",
      _id: "foo",
    });
  });

  test("Update an issue with an invalid _id: PUT request to `/api/issues/{project}`", async () => {
    // Attempt to update Issue
    const updateRes = await chai
      .request(server)
      .put("/api/issues/foo")
      .type("form")
      .send({
        _id: "61f404887abd7a4988dae901",
        issue_title: "bar",
      });
    assert.equal(updateRes.status, 200, "updateRes status");
    assert.deepEqual(updateRes.body, {
      error: "invalid _id",
    });
  });

  test("Delete an issue: DELETE request to `/api/issues/{project}`", async () => {
    const now = new Date().getTime();

    // Create Issue
    const createRes = await chai
      .request(server)
      .post(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        issue_title: "test-issue-title",
        issue_text: "test-issue-text",
        created_by: "test-created-by",
        assigned_to: "test-assigned-to",
        status_text: "test-status-text",
      });
    assert.equal(createRes.status, 200, "createRes status");
    assert.include(createRes.body, {
      issue_title: "test-issue-title",
      issue_text: "test-issue-text",
      created_by: "test-created-by",
      assigned_to: "test-assigned-to",
      status_text: "test-status-text",
      open: true,
    });

    // Delete Issue
    const _id = createRes.body._id;

    const deleteRes = await chai
      .request(server)
      .delete(`/api/issues/fcc-${now}`)
      .type("form")
      .send({
        _id: _id,
      });

    assert.equal(deleteRes.status, 200, "deleteRes status");
    assert.deepEqual(deleteRes.body, {
      result: "successfully deleted",
      _id: _id,
    });

    // Search for the issue
    const searchRes = await chai
      .request(server)
      .get(`/api/issues/fcc-${now}?_id=${_id}`);

    assert.equal(searchRes.status, 200, "searchRes status");
    assert.equal(
      searchRes.body.length,
      0,
      "searchRes should return no documents"
    );
  });

  test("Delete an issue with an invalid _id: DELETE request to `/api/issues/{project}`", async () => {
    const deleteRes = await chai
      .request(server)
      .delete("/api/issues/foo")
      .type("form")
      .send({
        _id: "foo",
      });

    assert.equal(deleteRes.status, 200, "deleteRes status");
    assert.deepEqual(deleteRes.body, {
      error: "invalid _id",
    });
  });

  test("Delete an issue with missing _id: DELETE request to `/api/issues/{project}`", async () => {
    const deleteRes = await chai.request(server).delete("/api/issues/foo");

    assert.equal(deleteRes.status, 400, "deleteRes status");
    assert.deepEqual(deleteRes.body, {
      error: "missing _id",
    });
  });
});
