var toRadians = function(thing){
  return thing * Math.PI / 180;
}

var distanceCalculator = function(point1, point2){
  var R = 6371000;
  var dx = toRadians(point2.latitude - point1.latitude);
  var dy = toRadians(point2.longitude - point1.longitude);
  var median = Math.pow(Math.sin(dx / 2), 2) +
               Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
               Math.pow(Math.sin(dy / 2),2);
  var c = 2 * Math.atan2(Math.sqrt(median), Math.sqrt(1 - median));
  var distance = R * c;
  return distance;
};

self.addEventListener('message', receiveMessage);

function receiveMessage (e) {
  var parent = e.data.bloodline;
  var survivor;

  for (var j = 0; j < e.data.availableResources; j++) {
    for (var k = 0; k < e.data.offspringPerSurvivor; k++) {
      var child = alterRoute(parent);
      if (survivor === undefined || (calculateDistance(child) < calculateDistance(survivor))) {
        survivor = child;
      }
    }
    parent = survivor;
  }

  self.postMessage({survivor: survivor});
}

function createRoute(cities){
  var route = cities.slice();
  for(var i = 0; i < route.length; i++){
    var randomIndex = Math.floor(Math.random() * i);
    route[i] = route[randomIndex];
    route[randomIndex] = cities[i];
  }
  return route;
}

function alterRoute(route){

  /* -------------------- Complete me! -------------------- */
  var newRoute = route.slice();

  for (var i = 0; i < 2; i++) {
    var index1 = Math.floor(Math.random() * newRoute.length);
    var index2 = Math.floor(Math.random() * newRoute.length);
    var temp = newRoute[index1];
    newRoute[index1] = newRoute[index2];
    newRoute[index2] = temp;
  }

  return newRoute;
}

function calculateDistance(route){
  var distances = route.map(function(city, index, route){
    var nextCity = route[index + 1] || route[0];
    var distance = distanceCalculator(city, nextCity);
    return distance;
  });

  return distances.reduce(function(distance1, distance2){
    return distance1 + distance2;
  });
}
