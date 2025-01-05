var targetUrl = "https://altoro.testfire.net";
var loginPageUrl = "https://altoro.testfire.net/login.jsp";
var loginRequestUrl = "https://altoro.testfire.net/doLogin";
var loginAfterUrl = "https://altoro.testfire.net/bank/main.jsp"
var username = "admin";
var password = "admin";

var Model = Java.type("org.parosproxy.paros.model.Model");
var session = Model.getSingleton().getSession();
var HistoryReference = Java.type('org.parosproxy.paros.model.HistoryReference');
var HttpMessage = Java.type('org.parosproxy.paros.network.HttpMessage');
var HttpRequestHeader = Java.type('org.parosproxy.paros.network.HttpRequestHeader');
var HttpRequestBody = Java.type('org.zaproxy.zap.network.HttpRequestBody');
var HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
var AuthenticationHelper = Java.type("org.zaproxy.zap.authentication.AuthenticationHelper");

var Cookie = Java.type("org.apache.commons.httpclient.Cookie");
var URI = Java.type("org.apache.commons.httpclient.URI");
var Source = Java.type("net.htmlparser.jericho.Source");
var Thread = Java.type("java.lang.Thread");
var By = Java.type("org.openqa.selenium.By");
var WebDriverWait = Java.type("org.openqa.selenium.support.ui.WebDriverWait");
var ExpectedConditions = Java.type("org.openqa.selenium.support.ui.ExpectedConditions");
var TimeUnit = Java.type("java.util.concurrent.TimeUnit");
var Duration = Java.type("java.time.Duration");

var COOKIE_TYPE = org.parosproxy.paros.network.HtmlParameter.Type.cookie;
var HtmlParameter = Java.type("org.parosproxy.paros.network.HtmlParameter");
var ScriptVars = Java.type("org.zaproxy.zap.extension.script.ScriptVars");

function authenticate(helper, paramsValues, credentials) {
    print("--- Starting authenticate ---");

    print("Open WebDriver.");
    var extSel = control.getExtensionLoader().getExtension(org.zaproxy.zap.extension.selenium.ExtensionSelenium.class);
    var wd = extSel.getWebDriverProxyingViaZAP(1, "firefox");

    var msg = helper.prepareMessage();

    try {
        wd.get(loginPageUrl);
        Thread.sleep(2000);

        wd.findElement(By.id("uid")).sendKeys(username);
        wd.findElement(By.name("passw")).sendKeys(password);
        wd.findElement(By.name("btnSubmit")).click();

        var wait = new WebDriverWait(wd, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.or(
            ExpectedConditions.urlToBe(loginAfterUrl),
            ExpectedConditions.presenceOfElementLocated(By.linkText("Sign Off"))
        ));
        
        if (wd.getCurrentUrl() === loginPageUrl) {
            print("Login failed - redirected back to login page");
            return null;
        }

        print("login finished.");
        Thread.sleep(2000);

        Thread.sleep(1000);
        var tableHistory = Model.getSingleton().getDb().getTableHistory();
        var historyIds = tableHistory.getHistoryIdsOfHistType(session.getSessionId(), HistoryReference.TYPE_PROXIED);
        
        for (var i = historyIds.size() - 1; i >= 0; i--) {
            var id = historyIds.get(i);
            try {
                var ref = new HistoryReference(id);
                var httpMessage = ref.getHttpMessage();
                if (httpMessage.getRequestHeader().getMethod() === "POST" 
                    && httpMessage.getRequestHeader().getURI().toString() === loginRequestUrl) {
                    msg = httpMessage;
                    break;
                }
            } catch (e) {
                print("Error processing history reference: " + e);
                continue;
            }
        }
    } finally {
        Thread.sleep(2000);
        wd.quit();
        print("Close WebDriver.");
    }

    /*var requestBody = "uid=" + username;
    requestBody += "&passw=" + password;
    requestBody += "&btnSubmit=Login";

    var post = helper.prepareMessage();
    post.setRequestHeader(new HttpRequestHeader(HttpRequestHeader.POST, new URI(loginRequestUrl), HttpHeader.HTTP10));
    post.setRequestBody(requestBody);
    post.getRequestHeader().setContentLength(post.getRequestBody().length());
    helper.sendAndReceive(post);*/

    var cookies = msg.getCookieParams();
    var iterator = cookies.iterator();
    var cookieIndex = 1;
    
    while (iterator.hasNext()) {
        var cookie = iterator.next();
        var cookieName = cookie.getName();
        var cookieValue = cookie.getValue();
        
        ScriptVars.setGlobalVar("cookie" + cookieIndex + "_name", cookieName);
        ScriptVars.setGlobalVar("cookie" + cookieIndex + "_value", cookieValue);
        
        print("Cookie " + cookieIndex + " saved to ScriptVars:");
        print("  Name: " + cookieName);
        print("  Value: " + cookieValue);
        
        cookieIndex++;
    }

    print("--- Finished authenticate ---");
    return msg;
}

function getRequiredParamsNames() {
    return [];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return [ "Username", "Password" ];
}