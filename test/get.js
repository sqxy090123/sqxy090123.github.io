<!DOCTYPE html>
<html>
<head>
  <title>设备信息获取</title>
  <style>
    #result-container {
      margin-top: 20px;
      border: 1px solid #ccc;
      padding: 10px;
    }
  </style>
</head>
<body>
  <h1 style="font-size: 50px;">设备信息获取</h1>
  <div></div>
  <!--换行-->
  <div></div>
  <div></div>
  <button id="get-info-button" style="font-size: 30px;">开始获取</button>
  <h3 style="font-size: 30px;">
    <text>已用时:</text><span id="timer">00:00:00</span>
  </h3>
  <h2 style="font-size: 40px;"><div id="result-container"></div></h2>
  

  <script>
    var startTimer = function() {
  var timerElement = document.getElementById("timer");
  var startTime = new Date().getTime(); // 获取当前时间戳

  setInterval(function() {
    var currentTime = new Date().getTime(); // 获取当前时间戳
    var elapsedTime = currentTime - startTime; // 计算经过的时间（单位：毫秒）

    // 将经过的时间转换为时、分、秒的格式
    var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    // 格式化显示时间
    var formattedTime = String(hours).padStart(2, "0") + ":" +
                        String(minutes).padStart(2, "0") + ":" +
                        String(seconds).padStart(2, "0");

    timerElement.textContent = formattedTime;
  }, 1000); // 每隔一秒更新一次计时器
};
    var getOrientation = function() {
      var orientationInfo = "无法获取设备方向信息";

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
          var alpha = event.alpha; // 设备绕Z轴旋转的角度（0到360）
          var beta = event.beta; // 设备绕X轴旋转的角度（-180到180）
          var gamma = event.gamma; // 设备绕Y轴旋转的角度（-90到90）

          // 根据alpha、beta和gamma值来判断设备的方向信息
          // 可以根据具体需求进行逻辑判断，例如：
          if (alpha >= 45 && alpha <= 135) {
            orientationInfo = "设备水平放置";
          } else if (alpha >= 225 && alpha <= 315) {
            orientationInfo = "设备垂直放置";
          } else {
            orientationInfo = "设备其他方向";
          }

          document.getElementById('orientation').textContent = orientationInfo;
        });
      }

      return orientationInfo;
    };
    var getBatteryInfo = function() {
      return navigator.getBattery().then(function(battery) {
        return { level: battery.level !== null ? battery.level : "失败" };
      }).catch(() => ({ level: "失败" }));
    };

    var getPositionInfo = function() {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      }).then(function(position) {
        return { latitude: position.coords.latitude, longitude: position.coords.longitude };
      }).catch(() => ({ latitude: "失败", longitude: "失败" }));
    };

    var getOrientation = function() {
      // 获取设备方向信息的逻辑
      // 返回方向信息字符串
      return;
    };

    var startFetchingInfo = function() {
      startTimer(); // 启动计时器
      var getInfoButton = document.getElementById("get-info-button");
      var resultContainer = document.getElementById("result-container");

      if (getInfoButton.textContent === "停止获取") {
        stopFetchingInfo();
        return;
      }

      getInfoButton.textContent = "停止获取";
      getInfoButton.disabled = true;

      var deviceType = /Mobile|Tablet/i.test(navigator.userAgent) ? '移动设备' : '桌面设备';
      var deviceModel = ''; // 用于存储设备型号
      try {
        var userAgent = navigator.userAgent;
        var regex = /DeviceModel\/(\w+)/i;
        var match = regex.exec(userAgent);
        if (match && match.length > 1) {
          deviceModel = match[1];
        }
      } catch (error) {
        console.error('失败：', error);
      }

      var batteryPromise = getBatteryInfo();
      var positionPromise = getPositionInfo();
      var ipPromise = fetch('https://api.ipify.org/?format=json')
        .then(function(response) {
          if (!response.ok) {
            throw new Error('失败');
          }
          return response.json();
        })
        .then(function(data) {
          var ipAddress = data.ip; // 获取IP地址

          return fetch('https://ipapi.co/' + ipAddress + '/json/')
            .then(function(response) {
              if (!response.ok) {
                throw new Error('失败');
              }
              return response.json();
            })
            .then(function(data) {
              return { ip: ipAddress, region: data.city + ', ' + data.region + ', ' + data.country }; // 获取所在地区
            })
            .catch(function(error) {
              console.error('失败：', error);
              throw error;
            });

        })
        .catch(function(error) {
          console.error('失败：', error);
          throw error;
        });

      Promise.all([batteryPromise, positionPromise, ipPromise]).then(function(results) {
        // 获取设备信息
        var batteryInfo = results[0] || { level: "失败" };
        var positionInfo = results[1] || { latitude: "失败", longitude: "失败" };
        var orientationInfo = getOrientation();
        var ipInfo = results[2] || { ip: "失败", region: "失败" };

        var info = "设备种类：" + deviceType + "<br>";
        info += "设备型号：" + deviceModel + "<br>";
        info += "IP 地址：" + ipInfo.ip + "<br>";
        info += "所在地区：" + ipInfo.region + "<br>";
        info += "电池电量：" + (parseFloat(batteryInfo.level) * 100) + "%<br>";
        info += "纬度：" + positionInfo.latitude + "<br>";
        info += "经度：" + positionInfo.longitude + "<br>";
        info += "方向：" + orientationInfo + "<br>";

        resultContainer.innerHTML = info;


        clearInterval(timer); // 停止计时器
        stopFetchingInfo();
      });

      var stopFetchingInfo = function() {
        getInfoButton.textContent = "开始获取";
        getInfoButton.disabled = false;
      };
    };

    var getInfoButton = document.getElementById("get-info-button");
    getInfoButton.addEventListener("click", startFetchingInfo);
  </script>
</body>
</html>
