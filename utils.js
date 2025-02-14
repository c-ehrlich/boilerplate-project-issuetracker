/**
 * takes an Issue object and only returns the keys that we want
 */
const prepareIssueForJson = (issue) => {
  const prunedObject = (({
    _id,
    assigned_to,
    status_text,
    open,
    issue_title,
    issue_text,
    created_by,
    created_on,
    updated_on,
  }) => ({
    _id,
    assigned_to,
    status_text,
    open,
    issue_title,
    issue_text,
    created_by,
    created_on,
    updated_on,
  }))(issue);

  return prunedObject;
}

module.exports = { prepareIssueForJson };
