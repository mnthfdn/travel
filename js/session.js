// session storage'a session ve device bilgisi atılıyor
async function getSessionId() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic JEcYcEMyantZV095WVc3G2JtVjNZbWx1");
    
    var raw = JSON.stringify({
      "type": 1,
      "connection": {
        "ip-address": "165.114.41.21",
        "port": "5117"
      },
      "browser": {
        "name": "Chrome",
        "version": "47.0.0.12"
      }
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    const response=await fetch("https://v2-api.obilet.com/api/client/getsession", requestOptions)
    let data = await response.json(); 
    sessionStorage.setItem("sessionId",data.data["session-id"])
    sessionStorage.setItem("deviceId",data.data["device-id"])
}
//session devam ediyorsa tekrar atama yapılmaması kontrolü 
if (!sessionStorage.getItem("sessionId") && !sessionStorage.getItem("deviceId")) {
getSessionId()
}