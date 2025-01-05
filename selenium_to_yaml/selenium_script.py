import time
import sys
from ruamel.yaml import YAML
from seleniumwire import webdriver

url = 'https://altoro.testfire.net'

driver_path = 'C:/Users/PCD-178/Desktop/temp/geckodriver.exe'
driver = webdriver.Firefox()

driver.get(url)

time.sleep(15)

cookies = driver.get_cookies()
cookie_list = []

for cookie in cookies:
    print(f"Name: {cookie['name']}, Value: {cookie['value']}")
    cookie_list.append(f'{cookie["name"]}={cookie["value"]}')

cookieValue = '; '.join(cookie_list)

temp = {
  "env": {
    "contexts": [
      {
        "name": "testcontext",
        "urls": [url],
        "includePaths": [url + ".*"],
        "excludePaths": [url+"/logout.jsp"]
      }
    ]
  },
  "jobs": [
    {
      "type": "replacer",
      "rules": [
        {
          "description": "replacer_script",
          "url": url + ".*",
          "matchType": "req_header",
          "matchString": "Cookie",
          "matchRegex": False,
          "replacementString": cookieValue,
          "tokenProcessing": False
        }
      ],
      "parameters": {
        "deleteAllRules": True
      }
    },
    {
      "type": "spiderAjax",
      "parameters": {
          "context": "testcontext",
          "maxDuration": 1,
          "maxCrawlDepth": 5,
          "numberOfBrowsers": 1,
          "runOnlyIfModern": False
      }
    }
  ]
}

file_name = f"{url.split('/')[2]}.yaml"
yaml = YAML()
yaml.width = 4096;

print("\nData to ve saved:")
yaml.dump(temp, sys.stdout)

with open(file_name, 'w', encoding='utf-8') as file:
    yaml.dump(temp, file)
print(f"Data Saved to "+file_name)

driver.quit()