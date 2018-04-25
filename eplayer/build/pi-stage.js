<script src="https://pi-int.pearsoned.com/v1/piapi-int/login/js/session.js"></script>
<script type="text/javascript">
    var redirectPiurl = window.location.href;
    redirectPiurl = decodeURIComponent(redirectPiurl).replace(/\s/g, "+").replace(/%20/g, "+");
    var clientId = 'I2RJd7eO5F9T6U9TgVK7VxtAgw48u0pU';
    var jwtSetting = {
      "useJwt": true, "checkSessionMilliseconds": "6000",
      "sessionIdleTimeoutSeconds": "1800"
    };
    piSession.initialize(clientId, jwtSetting);
    deleteCookie("etext-cdn-token");
    piSession.on(piSession.SessionStateKnownEvent, onSessionStateKnown);
    function onSessionStateKnown() {
      if (piSession.hasValidSession(10) === 'notoken') {
        piSession.login(redirectPiurl, 10);
      }
      piSession.recordUserActivity();
      piSession.extendUserSession();
      piSession.monitorUserActivity(false);
    }
    setInterval(function () {
      piSession.getToken(function (result, userToken) {
        if (result === piSession['Success']) {
          setStorage("secureToken", userToken);
        } else if (result === 'unknown' || result === 'notoken') {
          piSession.login(redirectPiurl, 10);
        }
      });
    }, 1500000);
    function setStorage(secureToken, svalue) {
      localStorage.setItem("secureToken", svalue);
    }
    function deleteCookie(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 2000 00:00:01 GMT;path=/;';
      console.log("The Cookiee Deleted ",name + '=;expires=Thu, 01 Jan 2000 00:00:01 GMT;path=/;');
    }
  </script>