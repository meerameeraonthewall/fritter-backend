/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */
function addCitation(fields) {
    fetch(`/api/cite/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function removeCitation(fields) {
    fetch(`/api/cite/${fields.citationId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
  