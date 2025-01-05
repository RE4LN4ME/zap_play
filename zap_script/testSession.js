var COOKIE_TYPE = org.parosproxy.paros.network.HtmlParameter.Type.cookie;
var HtmlParameter = Java.type("org.parosproxy.paros.network.HtmlParameter");
var ScriptVars = Java.type("org.zaproxy.zap.extension.script.ScriptVars");

function extractWebSession(sessionWrapper) {
  /*var json = JSON.parse(sessionWrapper.getHttpMessage().getResponseBody().toString());
  var ssidToken = '"ODAwMDAwfkNvcnBvcmF0ZX4tMS4wMDAwMDAwMDAyNTAzMDFFNDF8ODAwMDAxfkNoZWNraW5nfjEuMEU0MXw"';
  var authToken = '3C5CCB1D03379908C3E1E4252AAEE940';
  print(authToken);
  sessionWrapper.getSession().setValue("JSESSIONID", ssidToken);
  sessionWrapper.getSession().setValue("AltoroAccounts", authToken);*/
  ScriptVars.setGlobalVar("cookie.session", "C234184D1A859206C33D8AF9FD322578");
  ScriptVars.setGlobalVar("cookie.auth", "ODAwMDAwfkNvcnBvcmF0ZX41LjIzOTQ3ODM2MUU3fDgwMDAwMX5DaGVja2luZ34xMDQ5MjYuNDR8");
}

function clearWebSessionIdentifiers(sessionWrapper) {
  ScriptVars.setGlobalVar("cookie.session", null);
  ScriptVars.setGlobalVar("cookie.token", null);
}

function processMessageToMatchSession(sessionWrapper) {
  var ssidToken = sessionWrapper.getSession().getValue("JSESSIONID");
  var authToken = sessionWrapper.getSession().getValue("AltoroAccounts");
  if (authToken === null) {
    print("no auth token found");
    return;
  }

  var ssidCookie = new HtmlParameter(COOKIE_TYPE, "JSESSIONID", ssidToken);
  var authCookie = new HtmlParameter(COOKIE_TYPE, "AltoroAccounts", authToken);
  var msg = sessionWrapper.getHttpMessage();
  var cookies = msg.getRequestHeader().getCookieParams();
  cookies.add(ssidCookie);
  cookies.add(authCookie);
  msg.getRequestHeader().setCookieParams(cookies);
}

function getRequiredParamsNames() {
  return [];
}

function getOptionalParamsNames() {
  return [];
}
