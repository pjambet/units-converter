(function() {
  var $distanceMetric = document.getElementById('distance-metric'),
      $distanceImperial = document.getElementById('distance-imperial'),
      $paceMetric = document.getElementById('pace-metric'),
      $paceImperial = document.getElementById('pace-imperial'),
      $speedMetric = document.getElementById('speed-metric'),
      $speedImperial = document.getElementById('speed-imperial'),
      $finishTime = document.getElementById('finish-time'),
      distanceInMeters = null,
      distanceInMiles = null,
      finishTimeInSeconds = null,
      kilometersToMilesRatio = 1.60934;

  $distanceMetric.addEventListener('input', function(event) {
    distanceInMiles = this.value * kilometersToMilesRatio;
    $distanceImperial.value = distanceInMiles;
    distanceInMeters = this.value * 1000;
    calculatePace();
    calculateSpeed();
  });

  $distanceImperial.addEventListener('input', function(event) {
    distanceInMeters = this.value / kilometersToMilesRatio;
    $distanceMetric.value = distanceInMeters;
    distanceInMeters = distanceInMeters * 1000;
    calculatePace();
    calculateSpeed();
  });

  $finishTime.addEventListener('input', function(event) {
    finishTimeInSeconds = 0;
    // Trash this and use Date.parse
    this.value.split(':').forEach(function(split, i) {
      if (i === 0) {
        // Hours
        finishTimeInSeconds += parseInt(split) * 60 * 60;
      } else if (i === 1) {
        // Minutes
        finishTimeInSeconds += parseInt(split) * 60;
      } else if (i === 2) {
        // Seconds
        finishTimeInSeconds += parseInt(split);
      }
    });
    calculatePace();
    calculateSpeed();
  });

  var calculatePace = function() {
    if (!distanceInMeters || !finishTimeInSeconds) {
      return;
    }

    // 10 km, 1h => 6 min / km
    // 10 km, 1h => 360 s / 1000m
    // 10000m, 3600s
    var metricPace = Math.round(finishTimeInSeconds / distanceInMeters * 1000 / 60 * 100) / 100;
    var imperialPace = Math.round(finishTimeInSeconds / distanceInMeters * 1000 / 60 * 100) / 100 * kilometersToMilesRatio;
    $paceMetric.innerHTML = convertDecimalToTime(metricPace);
    $paceImperial.innerHTML = convertDecimalToTime(imperialPace);
  };

  var calculateSpeed = function() {
    if (!distanceInMeters || !finishTimeInSeconds) {
      return;
    }

    // 10 km, 1h => 10 km / h
    // 10 km, 1h => 1000m / 360s
    // 10000m, 3600s
    var metricSpeed = Math.round((distanceInMeters / 1000) / (finishTimeInSeconds / 3600));
    var imperialSpeed = Math.round((distanceInMeters * kilometersToMilesRatio / 1000) / (finishTimeInSeconds / 3600));
    $speedMetric.innerHTML = metricSpeed;
    $speedImperial.innerHTML = imperialSpeed;
  };

  var convertDecimalToTime = function(decimalValue) {
    var time = "",
        compoments = [];
    var hours = Math.round(decimalValue / 60);
    if (hours > 0) {
      compoments.push(hours);
    }
    var minutes = Math.floor(decimalValue % 60);
    if (minutes > 0) {
      compoments.push(minutes);
    }
    var seconds = Math.round((decimalValue % 1) * 60);
    if (seconds > 0) {
      compoments.push(seconds);
    }
    return time + compoments.join(':');
  };
})()
