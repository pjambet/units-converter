(function() {
    var $distanceMetric = document.getElementById('distance-metric'),
        $distanceImperial = document.getElementById('distance-imperial'),
        $paceMetric = document.getElementById('pace-metric'),
        $paceImperial = document.getElementById('pace-imperial'),
        $speedMetric = document.getElementById('speed-metric'),
        $speedImperial = document.getElementById('speed-imperial'),
        $finishTime = document.getElementById('finish-time'),
        $metricSplits = document.querySelectorAll('#metric-splits ol')[0],
        $imperialSplits = document.querySelectorAll('#imperial-splits ol')[0],
        kilometersToMilesRatio = 1.60934,
        dataObject = {
            distanceInMeters: null,
            finishTimeInSeconds: null,
        };

    Object.defineProperty(dataObject, 'distanceInMeters', {
        get: function() { return this.distanceInMetersValue; },
        set: function(newValue) {
            this.distanceInMetersValue = newValue;

            doStuff();

            $distanceMetric.value = Math.round((dataObject.distanceInMeters / 1000.0) * 100.0) / 100.0;
            $distanceImperial.value = Math.round((dataObject.distanceInMeters / 1000.0 / kilometersToMilesRatio) * 100.0) / 100.0;
        }
    });

    Object.defineProperty(dataObject, 'finishTimeInSeconds', {
        get: function() { return this.finishTimeInSecondsValue; },
        set: function(newValue) {
            this.finishTimeInSecondsValue = newValue;

            doStuff();
        }
    });

    var doStuff = function() {
        calculatePace();
        calculateSpeed();
        createSplits();
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
        console.log("metric");
        $paceMetric.value = convertDecimalToTime(metricPace());
        console.log("imperial");
        $paceImperial.value = convertDecimalToTime(imperialPace());
    };

    var metricPace = function() {
        return Math.round(dataObject.finishTimeInSeconds / dataObject.distanceInMeters * 1000 / 60 * 100) / 100.0;
    };

    var imperialPace = function() {
        return Math.round(dataObject.finishTimeInSeconds / dataObject.distanceInMeters * 1000 / 60 * 100) / 100.0 * kilometersToMilesRatio;
    };

    var calculateSpeed = function() {
        if (!dataObject.distanceInMeters || !dataObject.finishTimeInSeconds) {
            return;
        }

        // 10 km, 1h => 10 km / h
        // 10 km, 1h => 1000m / 360s
        // 10000m, 3600s
        var metricSpeed = Math.round((dataObject.distanceInMeters / 1000) / (dataObject.finishTimeInSeconds / 3600));
        var imperialSpeed = Math.round((dataObject.distanceInMeters / kilometersToMilesRatio / 1000) / (dataObject.finishTimeInSeconds / 3600));
        $speedMetric.value = metricSpeed;
        $speedImperial.value = imperialSpeed;
    };

    var convertDecimalToTime = function(decimalValue) {
        var time = "",
            components = [];
        var hours = Math.floor(decimalValue / 60);
        if (hours > 0) {
            components.push(hours);
        }
        var minutes = Math.floor(decimalValue % 60);
        if (minutes > 0) {
            components.push(minutes);
        }
        var seconds = Math.round((decimalValue % 1) * 60);
        if (seconds > 0) {
            components.push(seconds);
        }
        console.log(decimalValue);
        console.log(components);
        return time + components.map(function(item, i) {
            if (item < 10 && i !== 0) {
                return "0" + item;
            } else {
                return item;
            }
        }).join(':');
    };

    var createSplits = function() {
        var distanceInKm = dataObject.distanceInMeters / 1000;
        var distanceInMiles = Math.round((dataObject.distanceInMeters / 1000.0 / kilometersToMilesRatio) * 100.0) / 100.0;
        var i, li;
        $metricSplits.innerHTML = "";
        $imperialSplits.innerHTML = "";
        for(i = 1; i < distanceInKm; i++) {
            li = document.createElement("li");
            li.textContent = convertDecimalToTime(metricPace() * i);
            $metricSplits.appendChild(li);
        }
        for(i = 1; i < distanceInMiles; i++) {
            li = document.createElement("li");
            li.textContent = convertDecimalToTime(imperialPace() * i);
            $imperialSplits.appendChild(li);
        }
    };

})();
