angular.module('editor.services.accounts', [])
  .service('accounts', function() {
    var accounts = this;
    accounts.create = function(username, password) {
      var data = {
        id: username,
        password: password
      };
      return fetch("https://kinto.notmyidea.org/v1/accounts", {
        method: "POST",
        body: JSON.stringify({data: data}),
        headers: {'Content-Type': 'application/json'
      }})
      .then(function(response) {
        if (response.ok) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      }
    );}
  });
