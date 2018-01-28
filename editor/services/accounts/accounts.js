angular.module('editor.services.accounts', [])
  .service('accounts', function() {
    var accounts = this;
    var config = {
      server: "https://kinto.notmyidea.org/v1"
    };

    accounts.login = function(username, password) {
      return fetch(config.server + '/', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password)
        }
      })
      .then(function(response) {
        if (response.ok) {
          return response.json().then(function(json) {
            console.log(json);
            if (json.user.id == 'account:' + username) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
        } else {
          return Promise.reject();
        }
      });
    };

    accounts.create = function(username, password) {
      var data = {
        id: username,
        password: password
      };
      return fetch(config.server + '/accounts', {
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
