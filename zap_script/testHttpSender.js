function logger() {
  print("[" + this["zap.script.name"] + "] " + arguments[0]);
}

var ScriptVars = Java.type("org.zaproxy.zap.extension.script.ScriptVars");
var HtmlParameter = Java.type("org.parosproxy.paros.network.HtmlParameter");
var COOKIE_TYPE = org.parosproxy.paros.network.HtmlParameter.Type.cookie;

var initialSessionId = null;
var authToken = null;

function responseReceived(msg, initiator, helper) {
  var resheaders = msg.getResponseHeader();
  var setCookie = resheaders.getHeader("Set-Cookie");

  if (setCookie === null) {
    return;
  }

  var cookies = setCookie.split(";");

  cookies.forEach(function(cookie) {
    if (cookie.indexOf("JSESSIONID") !== -1 && !ScriptVars.getGlobalVar("initial.JSESSIONID")) {
      var sessionInfo = cookie.split("=");
      var sessionId = sessionInfo[1];
      
      initialSessionId = sessionId;
      ScriptVars.setGlobalVar("initial.JSESSIONID", initialSessionId);
      logger("Captured initial JSESSIONID: " + initialSessionId);
    }

    if (cookie.indexOf("JSESSIONID") !== -1 && ScriptVars.getGlobalVar("initial.JSESSIONID")) {
      logger("New JSESSIONID received but not captured: " + cookie);
      return;
    }

    if (cookie.indexOf("AltoroAccounts") !== -1) {
      var authInfo = cookie.split("=");
      authToken = authInfo[1];
      ScriptVars.setGlobalVar("auth.token", authToken);
      logger("Captured AltoroAccounts: " + authToken);
    }
  });
}

function sendingRequest(msg, initiator, helper) {
    var initialSessionId = ScriptVars.getGlobalVar("initial.JSESSIONID");
    var authToken = ScriptVars.getGlobalVar("auth.token");

    if (initialSessionId || authToken) {
        var TreeSet = Java.type("java.util.TreeSet");
        var cookies = new TreeSet();
        
        msg.getRequestHeader().setHeader("Cookie", null);
        
        if (initialSessionId) {
          cookies.add(new HtmlParameter(COOKIE_TYPE, "JSESSIONID", initialSessionId));
        }
        if (authToken) {
          cookies.add(new HtmlParameter(COOKIE_TYPE, "AltoroAccounts", authToken));
        }
        
        msg.getRequestHeader().setCookieParams(cookies);
    }

    return true;
}
