## ZAP(Zed Attact Proxy) 활용 스크립트
ZAP(Zed Attack Proxy) 도구의 스크립트 기능을 활용하여 다양한 로직을 처리하기 위한 스크립트  


## 구성 파일
 ### zap_script 
  `zap_script` : ZAP의 스크립트 기능을 통해 작성된 스크립트(Graal.js)
  **주요 기능:**
   - Authentication Script를 통한 자동 로그인으로 인증 정보 처리
   - HttpSender Script를 통한 쿠키값 고정을 통한 인증 정보 전달
   - SessionManagement Script를 통한 쿠키값 전달로 인증 과정 생략 처리
   - Standalone Script를 통한 Selenium 수동 로그인 과정 처리  

 ### selenium_to_yaml
  `selenium_to_yaml` : Python을 통한 Selenium과 ZAP을 yaml파일로 연결하기 위한 스크립트
  **주요 기능:**
   - Python을 통해 Selenium을 실행
   - Selenium 상에서 수동 로그인 후 쿠키값 추출
   - 자동으로 ZAP의 automation framework를 위한 yaml파일 작성  


## 참고 문서
- https://github.com/zaproxy
- https://www.zaproxy.org/docs/
