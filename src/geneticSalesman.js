var geneticSalesman = function(genes, assessFitness, initiateBloodline, mutate, availableResources){
  var options = {
    numberOfBloodlines: 10,
    offspringPerSurvivor: 50,
  };

  var optimalRoute;
  var bloodlinesDone = 0;

  /* -------------------- Complete me! -------------------- */
  for (var i = 0; i <  options.numberOfBloodlines; i++) {
    var bloodline = initiateBloodline(genes);
    var survivor;

    var worker = new Worker('./src/worker.js');

    var receiveMessage = function (e) {
      console.log(e, bloodlinesDone);


      if (optimalRoute === undefined || (assessFitness(e.data.survivor) < assessFitness(optimalRoute))) {
        optimalRoute = e.data.survivor.slice();
      }

      bloodlinesDone++;

      if (bloodlinesDone === options.numberOfBloodlines) {
        console.log(optimalRoute);
        return optimalRoute;
      }
    };

    worker.addEventListener('message', receiveMessage);

    worker.postMessage({
      availableResources: availableResources,
      offspringPerSurvivor: options.offspringPerSurvivor,
      bloodline: bloodline
    });
  }
};

var createRoute = function(cities){
  var route = cities.slice();
  for(var i = 0; i < route.length; i++){
    var randomIndex = Math.floor(Math.random() * i);
    route[i] = route[randomIndex];
    route[randomIndex] = cities[i];
  }
  return route;
};

var alterRoute = function(route){

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
};

var calculateDistance = function(route){
  var distances = route.map(function(city, index, route){
    var nextCity = route[index + 1] || route[0];
    var distance = distanceCalculator(city, nextCity);
    return distance;
  });

  return distances.reduce(function(distance1, distance2){
    return distance1 + distance2;
  });
};
