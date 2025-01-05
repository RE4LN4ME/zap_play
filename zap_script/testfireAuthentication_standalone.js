var zap = "http://localhost:8080/JSON/spider/action/scan/";
var params = "?apikey=ng2bg61btq0a55sqj9rfge1mgb&url=http%3A%2F%2Ftestfire.net&maxChildren=20&recurse=true";

var targetUrl = "https://testfire.net";
var loginUrl = targetUrl+"/login.jsp";
var username = "admin";
var password = "admin";

var HttpRequestHeader = Java.type("org.parosproxy.paros.network.HttpRequestHeader");
var HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
var URI = Java.type("org.apache.commons.httpclient.URI");
var Source = Java.type("net.htmlparser.jericho.Source");
var Thread = Java.type("java.lang.Thread");
var By = Java.type("org.openqa.selenium.By");
var WebDriverWait = Java.type("org.openqa.selenium.support.ui.WebDriverWait");
var ExpectedConditions = Java.type("org.openqa.selenium.support.ui.ExpectedConditions");
var TimeUnit = Java.type("java.util.concurrent.TimeUnit");
var Duration = Java.type("java.time.Duration");

var extSel = control.getExtensionLoader().getExtension(org.zaproxy.zap.extension.selenium.ExtensionSelenium.class);

var wd = extSel.getWebDriverProxyingViaZAP(1, "firefox");

wd.get(loginUrl);

Thread.sleep(1000);

wd.findElement(By.id("uid")).sendKeys(username);
wd.findElement(By.name("passw")).sendKeys(password);
wd.findElement(By.name("btnSubmit")).click();

var wait = new WebDriverWait(wd, Duration.ofSeconds(60));
wait.until(ExpectedConditions.presenceOfElementLocated(By.linkText("Sign Off")));
print("login finished");




















/*
var url = new URL(zap+params);
var connection = url.openConnection();
connection.setRequestMethod("GET");
connection.setDoOutput(true);
print("start spider");
*/

/*var responseCode = connection.getResponseCode();
print("responseCode: "+responseCode);*/

/*var writer = new OutputStreamWriter(connection.getOutputStream());
writer.write(params);
writer.flush();
writer.close();

var reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
var response = '';
var line;
while ((line = reader.readLine()) !== null) {
    response += line;
}
reader.close();

print(response);

print("spider finished");*/

//wd.findElement(By.linkText("View Recent Transactions")).click();

