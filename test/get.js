var startTimer = function() {
  var timerElement = document.getElementById("timer");
  var startTime = new Date().getTime();
  var timer = setInterval(function() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;
    var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    var formattedTime = String(hours).padStart(2, "0") + ":" +
                        String(minutes).padStart(2, "0") + ":" +
                        String(seconds).padStart(2, "0");
    timerElement.textContent = formattedTime;
  }, 1000);
};

var getOrientation = function() {
  var orientationInfo = "无法获取设备方向信息";
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
      var alpha = event.alpha;
      var beta = event.beta;
      var gamma = event.gamma;
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

var startFetchingInfo = function() {
  startTimer();
  var getInfoButton = document.getElementById("get-info-button");
  var resultContainer = document.getElementById("result-container");
  if (getInfoButton.textContent === "停止获取") {
    stopFetchingInfo();
    return;
  }
  getInfoButton.textContent = "停止获取";
  getInfoButton.disabled = true;
  var deviceType = /Mobile|Tablet/i.test(navigator.userAgent) ? '移动设备' : '桌面设备';
  var deviceModel = '';
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
      var ipAddress = data.ip;
      return fetch('https://ipapi.co/' + ipAddress + '/json/')
        .then(function(response) {
          if (!response.ok) {
            throw new Error('失败');
          }
          return response.json();
        })
        .then(function(data) {
          return { ip: ipAddress, region: data.city + ', ' + data.region + ', ' + data.country };
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
    clearInterval(timer);
    stopFetchingInfo();
  });
  var stopFetchingInfo = function() {
    getInfoButton.textContent = "开始获取";
    getInfoButton.disabled = false;
  };
};

var getInfoButton = document.getElementById("get-info-button");
getInfoButton.addEventListener("click", startFetchingInfo);

document.addEventListener("DOMContentLoaded", function(event) {
  startFetchingInfo();
});
