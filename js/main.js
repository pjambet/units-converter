(function() {
  var $distanceMetric = document.getElementById('distance-metric'),
      $distanceImperial = document.getElementById('distance-imperial'),
      $paceMetric = document.getElementById('pace-metric'),
      $paceImperial = document.getElementById('pace-imperial'),
      $speedMetric = document.getElementById('speed-metric'),
      $speedImperial = document.getElementById('speed-imperial'),
      $finishTime = document.getElementById('finish-time'),
      kilometersToMilesRatio = 1.60934,
      dataObject = {
        distanceInMeters: null,
        finishTimeInSeconds: null,
      };

  $distanceMetric.addEventListener('input', function(event) {
    dataObject.distanceInMeters = this.value * 1000;
  });

  $distanceImperial.addEventListener('input', function(event) {
    dataObject.distanceInMeters = this.value * kilometersToMilesRatio * 1000;
  });

  $finishTime.addEventListener('input', function(event) {
    dataObject.finishTimeInSeconds = 0;
    // Trash this and use Date.parse
    this.value.split(':').forEach(function(split, i) {
      if (i === 0) {
        // Hours
        dataObject.finishTimeInSeconds += parseInt(split) * 60 * 60;
      } else if (i === 1) {
        // Minutes
        dataObject.finishTimeInSeconds += parseInt(split) * 60;
      } else if (i === 2) {
        // Seconds
        dataObject.finishTimeInSeconds += parseInt(split);
      }
    });
  });

  var calculatePace = function() {
    if (!dataObject.distanceInMeters || !dataObject.finishTimeInSeconds) {
      return;
    }

    // 10 km, 1h => 6 min / km
    // 10 km, 1h => 360 s / 1000m
    // 10000m, 3600s
    var metricPace = Math.round(dataObject.finishTimeInSeconds / dataObject.distanceInMeters * 1000 / 60 * 100) / 100;
    var imperialPace = Math.round(dataObject.finishTimeInSeconds / dataObject.distanceInMeters * 1000 / 60 * 100) / 100 * kilometersToMilesRatio;
    $paceMetric.value = convertDecimalToTime(metricPace);
    $paceImperial.value = convertDecimalToTime(imperialPace);
  };

  var calculateSpeed = function() {
    if (!dataObject.distanceInMeters || !dataObject.finishTimeInSeconds) {
      return;
    }

    // 10 km, 1h => 10 km / h
    // 10 km, 1h => 1000m / 360s
    // 10000m, 3600s
    var metricSpeed = Math.round((dataObject.distanceInMeters / 1000) / (dataObject.finishTimeInSeconds / 3600));
    var imperialSpeed = Math.round((dataObject.distanceInMeters * kilometersToMilesRatio / 1000) / (dataObject.finishTimeInSeconds / 3600));
    $speedMetric.value = metricSpeed;
    $speedImperial.value = imperialSpeed;
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

  Object.observe(dataObject, function(changes){

    changes.forEach(function(change) {
      if (change.type === 'update' && (change.name === 'finishTimeInSeconds' || change.name === 'distanceInMeters')) {
        calculatePace();
        calculateSpeed();
      }
      if (change.type === 'update' && (change.name === 'distanceInMeters')) {
        $distanceMetric.value = Math.round((dataObject.distanceInMeters / 1000) * 100) / 100;
        $distanceImperial.value = Math.round((dataObject.distanceInMeters / 1000 / kilometersToMilesRatio) * 100) / 100;
      }
    });

  });
})()
