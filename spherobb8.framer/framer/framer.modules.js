require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"dragOnCircle":[function(require,module,exports){
var placeOnElipse;

exports.circleDrag = function(objectLayer, radius) {
  var angle, centerX, centerY, proxy;
  angle = 0;
  centerX = objectLayer.midX;
  centerY = objectLayer.midY + radius;
  proxy = objectLayer.copy();
  proxy.name = "proxy";
  proxy.opacity = 0;
  proxy.draggable = true;
  proxy.draggable.overdrag = false;
  proxy.draggable.momentum = false;
  proxy.draggable.constraints = {
    x: proxy.midX - radius - proxy.width / 2,
    y: proxy.y,
    width: radius * 2 + proxy.width,
    height: radius * 2 + proxy.width
  };
  proxy.onDrag(function(event, layer) {
    var radX, radY;
    radX = this.x - centerX;
    radY = this.y - centerY;
    angle = Math.atan2(radX, radY) * (180 / Math.PI);
    exports.dragAngle = 180 - angle;
    return placeOnElipse(objectLayer, centerX, centerY, angle, radius, radius);
  });
  return proxy.onDragEnd(function() {
    proxy.x = objectLayer.x;
    return proxy.y = objectLayer.y;
  });
};

placeOnElipse = function(newLayer, centerX, centerY, angle, radiusX, radiusY) {
  newLayer.midX = centerX - Math.sin((angle + 180) * Math.PI / 180) * radiusX;
  return newLayer.midY = centerY - Math.cos((angle + 180) * Math.PI / 180) * radiusY;
};


},{}],"firebase":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Firebase = (function(superClass) {
  var getCORSurl, request;

  extend(Firebase, superClass);

  getCORSurl = function(server, path, secret, project) {
    var url;
    switch (Utils.isWebKit()) {
      case true:
        url = "https://" + server + path + ".json?auth=" + secret + "&ns=" + project;
        break;
      default:
        url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    }
    return url;
  };

  Firebase.define("status", {
    get: function() {
      return this._status;
    }
  });

  function Firebase(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.projectID = (base = this.options).projectID != null ? base.projectID : base.projectID = null;
    this.secret = (base1 = this.options).secret != null ? base1.secret : base1.secret = null;
    this.server = (base2 = this.options).server != null ? base2.server : base2.server = void 0;
    this.debug = (base3 = this.options).debug != null ? base3.debug : base3.debug = false;
    if (this._status == null) {
      this._status = "disconnected";
    }
    Firebase.__super__.constructor.apply(this, arguments);
    if (this.server === void 0) {
      Utils.domLoadJSON("https://" + this.projectID + ".firebaseio.com/.settings/owner.json", function(a, server) {
        var msg;
        print(msg = "Add ______ server:" + '   "' + server + '"' + " _____ to your instance of Firebase.");
        if (this.debug) {
          return console.log("Firebase: " + msg);
        }
      });
    }
    if (this.debug) {
      console.log("Firebase: Connecting to Firebase Project '" + this.projectID + "' ... \n URL: '" + (getCORSurl(this.server, "/", this.secret, this.projectID)) + "'");
    }
    this.onChange("connection");
  }

  request = function(project, secret, path, callback, method, data, parameters, debug) {
    var url, xhttp;
    url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    if (parameters !== void 0) {
      if (parameters.shallow) {
        url += "&shallow=true";
      }
      if (parameters.format === "export") {
        url += "&format=export";
      }
      switch (parameters.print) {
        case "pretty":
          url += "&print=pretty";
          break;
        case "silent":
          url += "&print=silent";
      }
      if (typeof parameters.download === "string") {
        url += "&download=" + parameters.download;
        window.open(url, "_self");
      }
      if (typeof parameters.orderBy === "string") {
        url += "&orderBy=" + '"' + parameters.orderBy + '"';
      }
      if (typeof parameters.limitToFirst === "number") {
        url += "&limitToFirst=" + parameters.limitToFirst;
      }
      if (typeof parameters.limitToLast === "number") {
        url += "&limitToLast=" + parameters.limitToLast;
      }
      if (typeof parameters.startAt === "number") {
        url += "&startAt=" + parameters.startAt;
      }
      if (typeof parameters.endAt === "number") {
        url += "&endAt=" + parameters.endAt;
      }
      if (typeof parameters.equalTo === "number") {
        url += "&equalTo=" + parameters.equalTo;
      }
    }
    xhttp = new XMLHttpRequest;
    if (debug) {
      console.log("Firebase: New '" + method + "'-request with data: '" + (JSON.stringify(data)) + "' \n URL: '" + url + "'");
    }
    xhttp.onreadystatechange = (function(_this) {
      return function() {
        if (parameters !== void 0) {
          if (parameters.print === "silent" || typeof parameters.download === "string") {
            return;
          }
        }
        switch (xhttp.readyState) {
          case 0:
            if (debug) {
              console.log("Firebase: Request not initialized \n URL: '" + url + "'");
            }
            break;
          case 1:
            if (debug) {
              console.log("Firebase: Server connection established \n URL: '" + url + "'");
            }
            break;
          case 2:
            if (debug) {
              console.log("Firebase: Request received \n URL: '" + url + "'");
            }
            break;
          case 3:
            if (debug) {
              console.log("Firebase: Processing request \n URL: '" + url + "'");
            }
            break;
          case 4:
            if (callback != null) {
              callback(JSON.parse(xhttp.responseText));
            }
            if (debug) {
              console.log("Firebase: Request finished, response: '" + (JSON.parse(xhttp.responseText)) + "' \n URL: '" + url + "'");
            }
        }
        if (xhttp.status === "404") {
          if (debug) {
            return console.warn("Firebase: Invalid request, page not found \n URL: '" + url + "'");
          }
        }
      };
    })(this);
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    return xhttp.send(data = "" + (JSON.stringify(data)));
  };

  Firebase.prototype.get = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "GET", null, parameters, this.debug);
  };

  Firebase.prototype.put = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PUT", data, parameters, this.debug);
  };

  Firebase.prototype.post = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "POST", data, parameters, this.debug);
  };

  Firebase.prototype.patch = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PATCH", data, parameters, this.debug);
  };

  Firebase.prototype["delete"] = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "DELETE", null, parameters, this.debug);
  };

  Firebase.prototype.onChange = function(path, callback) {
    var currentStatus, source, url;
    if (path === "connection") {
      url = getCORSurl(this.server, "/", this.secret, this.projectID);
      currentStatus = "disconnected";
      source = new EventSource(url);
      source.addEventListener("open", (function(_this) {
        return function() {
          if (currentStatus === "disconnected") {
            _this._status = "connected";
            if (callback != null) {
              callback("connected");
            }
            if (_this.debug) {
              console.log("Firebase: Connection to Firebase Project '" + _this.projectID + "' established");
            }
          }
          return currentStatus = "connected";
        };
      })(this));
      return source.addEventListener("error", (function(_this) {
        return function() {
          if (currentStatus === "connected") {
            _this._status = "disconnected";
            if (callback != null) {
              callback("disconnected");
            }
            if (_this.debug) {
              console.warn("Firebase: Connection to Firebase Project '" + _this.projectID + "' closed");
            }
          }
          return currentStatus = "disconnected";
        };
      })(this));
    } else {
      url = getCORSurl(this.server, path, this.secret, this.projectID);
      source = new EventSource(url);
      if (this.debug) {
        console.log("Firebase: Listening to changes made to '" + path + "' \n URL: '" + url + "'");
      }
      source.addEventListener("put", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "put", JSON.parse(ev.data).path, _.tail(JSON.parse(ev.data).path.split("/"), 1));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PUT': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
      return source.addEventListener("patch", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "patch", JSON.parse(ev.data).path, _.tail(JSON.parse(ev.data).path.split("/"), 1));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PATCH': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
    }
  };

  return Firebase;

})(Framer.BaseClass);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd29yay9mcmFtZXIvbXkvIHNwaGVyby9zcGhlcm9iYjguZnJhbWVyL21vZHVsZXMvZHJhZ09uQ2lyY2xlLmNvZmZlZSIsIi93b3JrL2ZyYW1lci9teS8gc3BoZXJvL3NwaGVyb2JiOC5mcmFtZXIvbW9kdWxlcy9maXJlYmFzZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNJQSxJQUFBOztBQUFBLE9BQU8sQ0FBQyxVQUFSLEdBQW1CLFNBQUMsV0FBRCxFQUFjLE1BQWQ7QUFDbEIsTUFBQTtFQUFBLEtBQUEsR0FBTTtFQUNOLE9BQUEsR0FBUSxXQUFXLENBQUM7RUFDcEIsT0FBQSxHQUFRLFdBQVcsQ0FBQyxJQUFaLEdBQWlCO0VBQ3pCLEtBQUEsR0FBTSxXQUFXLENBQUMsSUFBWixDQUFBO0VBQ04sS0FBSyxDQUFDLElBQU4sR0FBVztFQUNYLEtBQUssQ0FBQyxPQUFOLEdBQWM7RUFDZCxLQUFLLENBQUMsU0FBTixHQUFnQjtFQUNoQixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQWhCLEdBQXlCO0VBQ3pCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBaEIsR0FBeUI7RUFFekIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFoQixHQUNDO0lBQUEsQ0FBQSxFQUFFLEtBQUssQ0FBQyxJQUFOLEdBQVcsTUFBWCxHQUFrQixLQUFLLENBQUMsS0FBTixHQUFZLENBQWhDO0lBQ0EsQ0FBQSxFQUFFLEtBQUssQ0FBQyxDQURSO0lBRUEsS0FBQSxFQUFNLE1BQUEsR0FBTyxDQUFQLEdBQVMsS0FBSyxDQUFDLEtBRnJCO0lBR0EsTUFBQSxFQUFPLE1BQUEsR0FBTyxDQUFQLEdBQVMsS0FBSyxDQUFDLEtBSHRCOztFQUlELEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxLQUFELEVBQVEsS0FBUjtBQUNaLFFBQUE7SUFBQSxJQUFBLEdBQUssSUFBSSxDQUFDLENBQUwsR0FBTztJQUNa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QUFBO2VBQUEsU0FBQyxFQUFEO1VBQ2hDLElBQXdILGdCQUF4SDtZQUFBLFFBQUEsQ0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxJQUFkLENBQW1CLENBQUMsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFFLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQWhFLEVBQXNFLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFFLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQUksQ0FBQyxLQUF6QixDQUErQixHQUEvQixDQUFQLEVBQTJDLENBQTNDLENBQXRFLEVBQUE7O1VBQ0EsSUFBd0gsS0FBQyxDQUFBLEtBQXpIO21CQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksc0NBQUEsR0FBdUMsSUFBdkMsR0FBNEMsaUJBQTVDLEdBQTRELENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFFLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQXJCLENBQTVELEdBQXNGLFlBQXRGLEdBQWtHLEdBQWxHLEdBQXNHLEdBQWxILEVBQUE7O1FBRmdDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQS9CRDs7RUFIUzs7OztHQWpHb0IsTUFBTSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiNhdXRob3IgU2VyZ2l5IFZvcm9ub3YgdHdpdHRlci5jb20vbWFtZXppdG8gZHJpYmJibGUuY29tL21hbWV6aXRvXG4jZG9uZSBmb3IgRnJhbWVyIExvbmRvbiBmcmFtZXJsb25kb24uY29tXG5cblxuZXhwb3J0cy5jaXJjbGVEcmFnPShvYmplY3RMYXllciwgcmFkaXVzKS0+XG5cdGFuZ2xlPTBcblx0Y2VudGVyWD1vYmplY3RMYXllci5taWRYXG5cdGNlbnRlclk9b2JqZWN0TGF5ZXIubWlkWStyYWRpdXNcblx0cHJveHk9b2JqZWN0TGF5ZXIuY29weSgpXG5cdHByb3h5Lm5hbWU9XCJwcm94eVwiXG5cdHByb3h5Lm9wYWNpdHk9MFxuXHRwcm94eS5kcmFnZ2FibGU9dHJ1ZVxuXHRwcm94eS5kcmFnZ2FibGUub3ZlcmRyYWc9ZmFsc2Vcblx0cHJveHkuZHJhZ2dhYmxlLm1vbWVudHVtPWZhbHNlXG5cblx0cHJveHkuZHJhZ2dhYmxlLmNvbnN0cmFpbnRzPVxuXHRcdHg6cHJveHkubWlkWC1yYWRpdXMtcHJveHkud2lkdGgvMlxuXHRcdHk6cHJveHkueVxuXHRcdHdpZHRoOnJhZGl1cyoyK3Byb3h5LndpZHRoXG5cdFx0aGVpZ2h0OnJhZGl1cyoyK3Byb3h5LndpZHRoXG5cdHByb3h5Lm9uRHJhZyAoZXZlbnQsIGxheWVyKSAtPlxuXHRcdHJhZFg9dGhpcy54LWNlbnRlclhcblx0XHRyYWRZPXRoaXMueS1jZW50ZXJZXG5cdFx0YW5nbGU9TWF0aC5hdGFuMihyYWRYLHJhZFkpKigxODAvTWF0aC5QSSlcblx0XHRleHBvcnRzLmRyYWdBbmdsZT0xODAtYW5nbGVcblx0XHRwbGFjZU9uRWxpcHNlIG9iamVjdExheWVyLCBjZW50ZXJYLCBjZW50ZXJZLCBhbmdsZSwgcmFkaXVzLCByYWRpdXNcblx0cHJveHkub25EcmFnRW5kIC0+XG5cdFx0cHJveHkueD1vYmplY3RMYXllci54XG5cdFx0cHJveHkueT1vYmplY3RMYXllci55XG5cblxuXG5cblxucGxhY2VPbkVsaXBzZT0obmV3TGF5ZXIsIGNlbnRlclgsIGNlbnRlclksIGFuZ2xlLCByYWRpdXNYLCByYWRpdXNZKS0+XG5cdG5ld0xheWVyLm1pZFg9Y2VudGVyWC1NYXRoLnNpbigoYW5nbGUrMTgwKSAgKiBNYXRoLlBJIC8gMTgwKSpyYWRpdXNYXG5cdG5ld0xheWVyLm1pZFk9Y2VudGVyWS1NYXRoLmNvcygoYW5nbGUrMTgwKSAgKiBNYXRoLlBJIC8gMTgwKSpyYWRpdXNZXG4iLCJcblxuXG4jICdGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcycgbW9kdWxlIHYxLjBcbiMgYnkgTWFyYyBLcmVubiwgTWF5IDMxc3QsIDIwMTYgfCBtYXJjLmtyZW5uQGdtYWlsLmNvbSB8IEBtYXJjX2tyZW5uXG5cbiMgRG9jdW1lbnRhdGlvbiBvZiB0aGlzIE1vZHVsZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmNrcmVubi9mcmFtZXItRmlyZWJhc2VcbiMgLS0tLS0tIDogLS0tLS0tLSBGaXJlYmFzZSBSRVNUIEFQSTogaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvcmVmZXJlbmNlL3Jlc3QvZGF0YWJhc2UvXG5cblxuIyBUb0RvOlxuIyBGaXggb25DaGFuZ2UgXCJjb25uZWN0aW9uXCIsIGB0aGlzwrQgY29udGV4dFxuXG5cblxuIyBGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIGV4cG9ydHMuRmlyZWJhc2UgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cblxuXG5cdGdldENPUlN1cmwgPSAoc2VydmVyLCBwYXRoLCBzZWNyZXQsIHByb2plY3QpIC0+XG5cblx0XHRzd2l0Y2ggVXRpbHMuaXNXZWJLaXQoKVxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gdXJsID0gXCJodHRwczovLyN7c2VydmVyfSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fSZucz0je3Byb2plY3R9XCIgIyBXZWJraXQgWFNTIHdvcmthcm91bmRcblx0XHRcdGVsc2UgICAgICAgICAgIHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXHRcdHJldHVybiB1cmxcblxuXG5cdEAuZGVmaW5lIFwic3RhdHVzXCIsXG5cdFx0Z2V0OiAtPiBAX3N0YXR1cyAjIHJlYWRPbmx5XG5cblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAcHJvamVjdElEID0gQG9wdGlvbnMucHJvamVjdElEID89IG51bGxcblx0XHRAc2VjcmV0ICAgID0gQG9wdGlvbnMuc2VjcmV0ICAgID89IG51bGxcblx0XHRAc2VydmVyICAgID0gQG9wdGlvbnMuc2VydmVyICAgID89IHVuZGVmaW5lZCAjIHJlcXVpcmVkIGZvciBXZWJLaXQgWFNTIHdvcmthcm91bmRcblx0XHRAZGVidWcgICAgID0gQG9wdGlvbnMuZGVidWcgICAgID89IGZhbHNlXG5cdFx0QF9zdGF0dXMgICAgICAgICAgICAgICAgICAgICAgICA/PSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0c3VwZXJcblxuXG5cdFx0aWYgQHNlcnZlciBpcyB1bmRlZmluZWRcblx0XHRcdFV0aWxzLmRvbUxvYWRKU09OIFwiaHR0cHM6Ly8je0Bwcm9qZWN0SUR9LmZpcmViYXNlaW8uY29tLy5zZXR0aW5ncy9vd25lci5qc29uXCIsIChhLHNlcnZlcikgLT5cblx0XHRcdFx0cHJpbnQgbXNnID0gXCJBZGQgX19fX19fIHNlcnZlcjpcIiArICcgICBcIicgKyBzZXJ2ZXIgKyAnXCInICsgXCIgX19fX18gdG8geW91ciBpbnN0YW5jZSBvZiBGaXJlYmFzZS5cIlxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiAje21zZ31cIiBpZiBAZGVidWdcblxuXG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGluZyB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyAuLi4gXFxuIFVSTDogJyN7Z2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRCl9J1wiIGlmIEBkZWJ1Z1xuXHRcdEAub25DaGFuZ2UgXCJjb25uZWN0aW9uXCJcblxuXG5cdHJlcXVlc3QgPSAocHJvamVjdCwgc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBwYXJhbWV0ZXJzLCBkZWJ1ZykgLT5cblxuXHRcdHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXG5cdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLnNoYWxsb3cgICAgICAgICAgICB0aGVuIHVybCArPSBcIiZzaGFsbG93PXRydWVcIlxuXHRcdFx0aWYgcGFyYW1ldGVycy5mb3JtYXQgaXMgXCJleHBvcnRcIiB0aGVuIHVybCArPSBcIiZmb3JtYXQ9ZXhwb3J0XCJcblxuXHRcdFx0c3dpdGNoIHBhcmFtZXRlcnMucHJpbnRcblx0XHRcdFx0d2hlbiBcInByZXR0eVwiIHRoZW4gdXJsICs9IFwiJnByaW50PXByZXR0eVwiXG5cdFx0XHRcdHdoZW4gXCJzaWxlbnRcIiB0aGVuIHVybCArPSBcIiZwcmludD1zaWxlbnRcIlxuXG5cdFx0XHRpZiB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiXG5cdFx0XHRcdHVybCArPSBcIiZkb3dubG9hZD0je3BhcmFtZXRlcnMuZG93bmxvYWR9XCJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLFwiX3NlbGZcIilcblxuXG5cdFx0XHR1cmwgKz0gXCImb3JkZXJCeT1cIiArICdcIicgKyBwYXJhbWV0ZXJzLm9yZGVyQnkgKyAnXCInIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLm9yZGVyQnkgICAgICBpcyBcInN0cmluZ1wiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0ZpcnN0PSN7cGFyYW1ldGVycy5saW1pdFRvRmlyc3R9XCIgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvRmlyc3QgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9MYXN0PSN7cGFyYW1ldGVycy5saW1pdFRvTGFzdH1cIiAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0xhc3QgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZzdGFydEF0PSN7cGFyYW1ldGVycy5zdGFydEF0fVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLnN0YXJ0QXQgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZW5kQXQ9I3twYXJhbWV0ZXJzLmVuZEF0fVwiICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lbmRBdCAgICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVxdWFsVG89I3twYXJhbWV0ZXJzLmVxdWFsVG99XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZXF1YWxUbyAgICAgIGlzIFwibnVtYmVyXCJcblxuXG5cdFx0eGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3Rcblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBOZXcgJyN7bWV0aG9kfSctcmVxdWVzdCB3aXRoIGRhdGE6ICcje0pTT04uc3RyaW5naWZ5KGRhdGEpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ID0+XG5cblx0XHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRpZiBwYXJhbWV0ZXJzLnByaW50IGlzIFwic2lsZW50XCIgb3IgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIiB0aGVuIHJldHVybiAjIHVnaFxuXG5cdFx0XHRzd2l0Y2ggeGh0dHAucmVhZHlTdGF0ZVxuXHRcdFx0XHR3aGVuIDAgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IG5vdCBpbml0aWFsaXplZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMSB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFNlcnZlciBjb25uZWN0aW9uIGVzdGFibGlzaGVkIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAyIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCByZWNlaXZlZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDMgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBQcm9jZXNzaW5nIHJlcXVlc3QgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gNFxuXHRcdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBmaW5pc2hlZCwgcmVzcG9uc2U6ICcje0pTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXHRcdFx0aWYgeGh0dHAuc3RhdHVzIGlzIFwiNDA0XCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IEludmFsaWQgcmVxdWVzdCwgcGFnZSBub3QgZm91bmQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cblx0XHR4aHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuXHRcdHhodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0eGh0dHAuc2VuZChkYXRhID0gXCIje0pTT04uc3RyaW5naWZ5KGRhdGEpfVwiKVxuXG5cblxuXHQjIEF2YWlsYWJsZSBtZXRob2RzXG5cblx0Z2V0OiAgICAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiR0VUXCIsICAgIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cHV0OiAgICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUFVUXCIsICAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cG9zdDogICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUE9TVFwiLCAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cGF0Y2g6ICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUEFUQ0hcIiwgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0ZGVsZXRlOiAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiREVMRVRFXCIsIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1ZylcblxuXG5cblx0b25DaGFuZ2U6IChwYXRoLCBjYWxsYmFjaykgLT5cblxuXG5cdFx0aWYgcGF0aCBpcyBcImNvbm5lY3Rpb25cIlxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwib3BlblwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBlc3RhYmxpc2hlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcImVycm9yXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImRpc2Nvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBjbG9zZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblxuXG5cdFx0ZWxzZVxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIHBhdGgsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTGlzdGVuaW5nIHRvIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwdXRcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicHV0XCIsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aCwgXy50YWlsKEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIiksMSkpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUFVUJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwicGF0Y2hcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicGF0Y2hcIiwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLCBfLnRhaWwoSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSwxKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQQVRDSCc6ICN7SlNPTi5wYXJzZShldi5kYXRhKS5kYXRhfSBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIEBkZWJ1Z1xuXG4iXX0=
