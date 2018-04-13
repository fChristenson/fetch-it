var FetchMe = (function() {
  // Response object
  function Response(status, data) {
    return {
      status,
      json: function() {
        return JSON.parse(data);
      },
      text: function() {
        return data;
      }
    };
  }

  // Options object
  function Options(maybeOptions) {
    var options = maybeOptions || {};
    var method = options.method || "GET";
    var body = options.body || null;
    var headers = options.headers || {};
    var success = options.success || function() {};
    var error = options.error || function() {};

    return {
      method,
      body,
      headers,
      success,
      error
    };
  }

  function setHeaders(xhttp, headers) {
    var keys = Object.keys(headers);

    keys.forEach(function(key) {
      xhttp.setRequestHeader(key, headers[key]);
    });

    return xhttp;
  }

  function onreadystatechange() {
    // readyState 4 means that the request is done
    if (this.readyState == 4 && this.status == 200) {
      return options.success(new Response(options.status, this.responseText));
    } else if (this.readyState == 4 && this.status >= 400) {
      return options.error(new Response(options.status, this.responseText));
    }
  }

  // Ajax call function
  function fetchMe(url, maybeOptions) {
    var options = new Options(maybeOptions);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = onreadystatechange;

    xhttp.open(options.method, url, true);
    setHeaders(xhttp, options.headers);

    if (options.body) {
      xhttp.send(JSON.stringify(options.body));
    } else {
      xhttp.send();
    }
  }

  // Api object
  return {
    get: function(url, maybeOptions) {
      var tmp = Object.assign({}, { method: "GET" }, maybeOptions);
      return fetchMe(url, tmp);
    },
    post: function(url, maybeOptions) {
      var tmp = Object.assign({}, { method: "POST", body: {} }, maybeOptions);
      return fetchMe(url, tmp);
    }
  };
})();

// Trying out the ajax api
var options = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: {
    foo: 1,
    bar: 2
  },
  success: function(res) {
    var json = res.json();
    var h1 = document.createElement("h1");
    h1.innerHTML = JSON.stringify(json);
    document.body.appendChild(h1);
  },
  error: function(res) {
    var json = res.json();
    var h1 = document.createElement("h1");
    h1.innerHTML = JSON.stringify(json);
    document.body.appendChild(h1);
  }
};

// our ajax calls
FetchMe.get("http://localhost:3000", options);

FetchMe.post("http://localhost:3000", options);
