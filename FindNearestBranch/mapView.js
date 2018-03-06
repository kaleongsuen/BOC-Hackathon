var map;
var branchName = [];
var branch = [];
var nearestBranchName = ["", "", ""];
var isReady = false;
var dem = false;

var branchInfo = "";
readTextFile("branch.json");
console.log(branchInfo);
obj = JSON.parse(branchInfo);

var len = obj.length;
for (i = 0; i < len; i++)
{
	branchName.push(obj[i].name);
	branch.push({
		key: obj[i].name,
		value: [obj[i].address_coordinates.latitude, obj[i].address_coordinates.longitude]
	});
}

function initMap()
{
	map = new google.maps.Map(document.getElementById('map'),
	{
	  center: {lat: 22.31552, lng: 114.16769},
	  zoom: 13
	});
	var infoWindow = new google.maps.InfoWindow({map: map});
	var pos =
	{
		lat: 0, lng: 0
	};

	// Try HTML5 geolocation.
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(function(position)
		{
			pos =
			{
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			
			// Debug
			//pos = {lat: 22.259609, lng:114.132728};
			dem = false;

			marker = new google.maps.Marker(
			{
		        position: pos,
		        map: map
	      	});
	      	marker.setIcon('blue-dot-30.png');
			map.setCenter(pos);
			smoothZoom(map, 17, map.getZoom());
			const promise = new Promise(function(resolve, reject){
				showNearestBranch(pos.lat, pos.lng, dem);
				resolve(1);
			});
		
			promise.then((response)=>{
				if(response){
					getNearestBranchName();
				}
			});
												 
		}, function()
		{
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
                  'Error: The Geolocation service failed.' :
                  'Error: Your browser doesn\'t support geolocation.');
}

// the smooth zoom function
function smoothZoom (map, max, cnt) 
{
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt);}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}

function showNearestBranch(lat, lng, dem)
{
	var min = [999, 999, 999];
	var minPos = [0, 0, 0];
	var minMax = 999;
	var minMaxPos = 0;
	var branchLat = [0, 0, 0];
	var branchLng = [0, 0, 0];
	var markerArray = [];
	for (i = 0; i < branchName.length; i++)
	{
		var dist = distance(lat, lng, branch[i].value[0], branch[i].value[1]);

		minMax = min[0];
		minMaxPos = 0;
		for (j = 1; j < min.length; j++)
		{
			
			if (min[j] > minMax)
			{
				minMax = min[j];
				minMaxPos = j;
			}
		}

		if (dist < min[minMaxPos])
		{
			min[minMaxPos] = dist;
			minPos[minMaxPos] = i;
			nearestBranchName[minMaxPos] = branch[i].key;
			branchLat[minMaxPos] = branch[i].value[0];
			branchLng[minMaxPos] = branch[i].value[1];
		}
		
		markerArray[i] = new google.maps.Marker({
		    position: {lat: branch[i].value[0], lng: branch[i].value[1]},
		    map: map
		});
		
	}

	if (dem)
	{
		minPos[2] = 3;
		nearestBranchName[2] = "Kennedy Town Branch";
		branchLat[2] = 22.2835392;
		branchLng[2] = 114.129382;
	}

	for(i = 0; i < min.length; i++)
	{
		markerArray[minPos[i]].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
		//map.setCenter({lat: (lat + branchLat)/2,
		//							lng: (lng + branchLng)/2
		//});
	}

	isReady = true;
}


function getNearestBranchName()
{
	
	if (isReady)
	{
		document.getElementById("3nearestBranchName").innerHTML = nearestBranchName;
	}
}

function distance(lat1, lng1, lat2, lng2)
{
	var x = Math.abs(lat2 - lat1);
	x = x * x;

	var y = Math.abs(lng2 - lng1);
	y = y * y;

	return Math.sqrt(x + y);
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                branchInfo = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}