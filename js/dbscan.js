/*
Algorithm :
1. Traverse through each points
2. For every point, checked the surrounding to see if there are points which distance is less than minDistance(in km) set
3. The distance of one point to another point is measured by using harvesine algorithm
4. After a cluster is formed, compute an average coordinates according to all coordinates in the cluster
5. Repeat step 2-4 by using the computed average coordinates until no more point is found in step 2

Drawback :
Even though a point is much closer to another centre of cluster than its own cluster, it will not be cluster the closest one
*/

var assigned;
var final_clusters;
var cluster;

// 'geodata' == data filtered and contains 'x,y,lat,lon,index'
// 'minDistance' == minimum distance to create cluster in term of km
// Return an array of arrays in which the arrays contains object which is clustered together
function dbscanCenterDistance(geodata, minDistance){
  // To detect if the data is already belonged to a cluster
  assigned = new Array (geodata.length);
  // To keep average coordinates from a cluster
  var average_coordinates = new Object();
  // To keep final result of clustering
  final_clusters = [];
  for(var i = 0; i < geodata.length; i++){
    // If already assigned, skipped
    if(assigned[i] == 1) continue;
    // To keep a cluster
    cluster = [];
    var pt1 = geodata[i];
    data.features[pt1.index].geodata = pt1;
    cluster.push(data.features[pt1.index]);
    assigned[i] = 1;
    average_coordinates.lat = pt1.lat;
    average_coordinates.lon = pt1.lon;
    var cont = checkNeighboursCenterDistance(geodata, average_coordinates, minDistance, i);
    // while there are still neighbours
    while (cont){
      average_coordinates = updateAverageCoordinates(cluster);
      cont = checkNeighboursCenterDistance(geodata,average_coordinates,minDistance,cluster,i);
    }
    final_clusters.push(cluster);
  }
  return final_clusters;
}

// 'geodata' == data filtered and contains 'x,y,lat,lon,index'
// 'average_coordinates' == average coordinates from a cluster
// 'minDistance' == minimum distance set in  km
// i = latest index traverse of the geodata
// Return true if there is neighbour
// Return false if there is no more neighbour
function checkNeighboursCenterDistance(geodata, average_coordinates, minDistance, i){
  // Checked from last index traverse
  var neighbour = 0;
  for(var j = i; j < geodata.length; j++){
    // If the point is already assigned, skipped
    if(assigned[j] == 1) continue;
    else{
      // Check if there is neighbour
      var pt2 = geodata[j];
      var distance = harvesineDistance(average_coordinates, pt2);
      // If the distance is lesser than the minDistance set include into the cluster
      if(distance <= minDistance){
        neighbour = 1;
        data.features[pt2.index].geodata = geodata[j];
        cluster.push(data.features[pt2.index]);
        assigned[j] = 1;
      }
    }
  }
  if(neighbour == 0){
    return false;
  }else{
    return true;
  }
}

// Return distance between 2 points submitted in the arguments(in km)
function harvesineDistance(pt1,pt2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(pt2.lat-pt1.lat);  // deg2rad below
  var dLon = deg2rad(pt2.lon-pt1.lon);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(pt1.lat)) * Math.cos(deg2rad(pt2.lat)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

// Return radian
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Return average coordinates from the cluster formed
function updateAverageCoordinates(cluster){
  var average_coordinates = new Object();
  for(var j = 0; j < cluster.length; j++){
    average_coordinates.lat += cluster[j].geodata.lat;
    average_coordinates.lon += cluster[j].geodata.lon;
  }
  average_coordinates.lat = average_coordinates.lat/cluster.length;
  average_coordinates.lon = average_coordinates.lon/cluster.length;
  return average_coordinates;
}
