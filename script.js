let circles = []

const options = {
    // Required: API key
    key: 'iD8iCXaUc0LVVuK5ndGbpjp62hodwCyC',

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: 54.54,
    lon: 25.19,
    zoom: 1,
    hourFormat: '24h'
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    const { store } = windyAPI;
    // .map is instance of Leaflet map

//    L.popup()
//        .setLatLng([54.54, 14.3])
//        .setContent('Hello World')
//        .openOn(map);

    

    var c = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.5,
    radius: 50000});//.addTo(map);
    c.addTo(map)
    circles.push(c);
//    L.marker([51.5, -0.09]).addTo(map);
//    map.L.clear();
    store.on('path', path => {
        console.log(`path was changed: ${path}`);
        setPointsOnMap(map, path);
    });
});

function onMapClick(e) 
{
    console.log("U click");
};

function setPointsOnMap(map, time)
{
    time = time + '/00';
    console.log(time);
 
    time = time.match(/(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})/);
    time = Date.UTC(+time[1], +time[2]-1, + time[3], + time[4], + time[5]);
    console.log(time);
    let time_start = time - 3600000; // Вычитаем час
    //var someDate = new Date(time);
    //someDate = someDate.getTime();
    //console.log(someDate);




    console.log("Start request");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://data.uradmonitor.com/api/v1/devices");
    xhr.setRequestHeader('X-User-id', '6770');
    xhr.setRequestHeader('X-User-hash', 'dd8bf761f845565b63339487ad0d0e02');
    xhr.responseType = 'json';
    xhr.send(null);

    xhr.onload = function() {
        circles.forEach(function(item, i, circles) {
            item.remove();
        });
        circles.splice(0, circles.length);

        let responseObj = xhr.response;
        let devices
        for(var k in responseObj) 
        {
            console.log(responseObj[k].id);
            console.log(responseObj[k].latitude);
            console.log(responseObj[k].longitude);
            let working = true;
            if (!responseObj[k].status)
            {
                working = false;
                var c =L.circle([responseObj[k].latitude, responseObj[k].longitude], {
                    color: 'black',
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    radius: 50000});
                c.addTo(map);
                circles.push(c);
            }
            else
            {
                var c = L.circle([responseObj[k].latitude, responseObj[k].longitude], {
                    color: 'red',
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    radius: 50000});
                c.addTo(map);
                circles.push(c);
            }
            console.log(working);
            
        }
        console.log(circles.length);
    };

    

    // Отправить запрос
    
    // Распарсить ответ

};