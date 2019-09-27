
$.fn.googleapi_map = function (event, args) {
    gmap.me = this[0];

    if (typeof event === 'object' && args === undefined) {
        args = event;
        event = 'setlocation';
    } else if (event === 'getmylocation' && typeof args === 'function') {
        oak.googleapi_map
            .getmylocation({ lat: 'mylocation', lng: 'mylocation' })
            .then(function (pos) { args(pos); })

    } else if (event === 'streetview_visible') {
        return new Promise(function (resolve) {
            gmap.streetview_visible(args).then(function (response) {
                resolve(response)
            });
        });
    }

    event == 'setlocation' && gmap.setlocation(args);
}

let gmap = oak.googleapi_map;
gmap.map = null;
gmap.zoom_default = 15;
gmap.contentvalue_default = 'Your location';
gmap.pos = {};
gmap.getcenter = function () {
    let x = gmap.map.getCenter();
    if (x) return {
        lat: parseFloat(x.lat()).toFixed(7),
        lng: parseFloat(x.lng()).toFixed(7),
        zoom: gmap.map.getZoom()
    }
    else return { lat: null, lng: null }
};
gmap.setlocation = function (args) {
    gmap.getmylocation(args).then(function (res) {
        gmap.load().then(function () {
            gmap.map = gmap.map || new google.maps.Map(gmap.me, {
                center: {
                    lat: gmap.pos.lat,
                    lng: gmap.pos.lng
                },
                zoom: gmap.pos.zoom
            });

            let center = gmap.getcenter();
            if (center.lat != gmap.pos.lat || center.lng != gmap.pos.lng) {
                gmap.map.setCenter({
                    lat: gmap.pos.lat,
                    lng: gmap.pos.lng
                });
            }
            if (center.zoom != gmap.pos.zoom)
                gmap.map.setZoom(gmap.pos.zoom);

            gmap.infowindow_fn(args);
            gmap.infomarker_fn(args);
            gmap.streetview_fn(args);
        });
    });
};
gmap.load = function () {
    return new Promise(function (resolve, reject) {
        !gmap.map ?
            oak.ajaxget({
                url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBwitCydztHMzBL2mj_GZjP9seXFr5X8zE",
                onsuccess: function () { resolve('Download googlemap sdk script succeed'); },
                onerror: function () { reject('Error: Cannot download script'); }
            })
            : resolve('Download googlemap sdk script from cache');
    });
};
gmap.infowindow_arry = [];
gmap.infowindow_fn = function (args) {
    let mycontents = [];
    let mycontent = args.setcontent || args.addcontent;
    if (!mycontent) return
    else if (mycontent.constructor !== Array)
        mycontents.push(mycontent);
    else
        mycontents = mycontent;

    for (let i = 0; i < mycontents.length; i++) {
        c = mycontents[i]
        if (c) {
            let info = new google.maps.InfoWindow;
            info.setPosition({
                lat: c.lat || gmap.pos.lat,
                lng: c.lng || gmap.pos.lng
            });
            info.setContent(c.value || gmap.contentvalue_default);
            info.open(gmap.map);

            gmap.infowindow_fn.remove(args);
            gmap.infowindow_arry.push(info);
        }
    }
};
gmap.infowindow_fn.remove = function (args) {
    if (args.setcontent || args.removecontent) {
        let count = gmap.infowindow_arry.length
        for (let i = 0; i < count; i++) {
            gmap.infowindow_arry[i].close();
        }
        gmap.infowindow_arry = [];
    }
};
gmap.labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
gmap.labelindex = 0;
gmap.infomarker_arry = [];
gmap.infomarker_fn = function (args) {
    let mymarkers = [];
    let mymarker = args.setmarker || args.addmarker;
    if (!mymarker) return
    else if (mymarker.constructor !== Array)
        mymarkers.push(mymarker);
    else
        mymarkers = mymarker;

    for (let i = 0; i < mymarkers.length; i++) {
        m = mymarkers[i]
        if (m) {
            if (m.label === 'ABC')
                label = function () { return gmap.labels[gmap.labelindex++ % gmap.labels.length] };
            else if (m.label !== undefined)
                label = function () { return m.label; };
            else
                label = function () { return '' };

            let mark = new google.maps.Marker({
                position: {
                    lat: m.lat || gmap.pos.lat,
                    lng: m.lng || gmap.pos.lng
                },
                title: m.title || gmap.contentvalue_default,
                animation: google.maps.Animation.DROP,
                label: label(),
                icon: m.icon || null
            });
            mark.setMap(gmap.map);

            gmap.infomarker_fn.remove(args);
            gmap.infomarker_arry.push(mark);
        }// if(m)
    }// for
};
gmap.infomarker_fn.remove = function (args) {
    if (args.setmarker || args.removemarker) {
        let count = gmap.infomarker_arry.length
        for (let i = 0; i < count; i++) {
            gmap.infomarker_arry[i].setMap(null);
        }
        gmap.infomarker_arry = [];
    }
};
gmap.streetview_me = null;
gmap.streetview_heading_default = 10; 
gmap.streetview_pitch_default = 0;//<--north
gmap.streetview_fn = function (args) {

    let street = args.displaystreetview
    if (!street) return
    gmap.streetview_me = $(street.displayat)[0];

    var panorama = new google.maps.StreetViewPanorama(
        gmap.streetview_me, {
            motionTracking: street.motiontracking || false,
            motionTrackingControl: street.motiontrackingControl || false,
            position: {
                lat: c.lat || gmap.pos.lat,
                lng: c.lng || gmap.pos.lng
            },
            pov: {
                heading: street.heading || gmap.streetview_heading_default,//<--Defines the "up","down" angle from camara //Default 10 //(-90 to +90)
                pitch: street.pitch || gmap.streetview_pitch_default//<-- Defines the rotation angle from camera //Default 0 //0=north //90=east //180=south //270=west
            }
        });
    gmap.map.setStreetView(panorama);
}
gmap.streetview_visible = function (args) {
    if (!gmap.map) return;
    let st = gmap.map.getStreetView();
    if (st) {
        return new Promise(function (resolve) {

            if (args) {
                $('#divGoogleStreetview').css('width', '40%');
                $('#divGoogleMap').css('width', '60%');


            } else {
                $('#divGoogleStreetview').css('width', '0');
                $('#divGoogleMap').css('width', '100%')
     
            }



            st.setVisible(args)
            resolve({ 'visible': args });
        })
    }
};
gmap.getmylocation = function (args) {
    return new Promise(function (resolve, reject) {
        if (navigator.geolocation && args.lat == 'mylocation' && args.lng == 'mylocation') {
            navigator.geolocation.getCurrentPosition(function (position) {
                gmap.pos.lat = position.coords.latitude;
                gmap.pos.lng = position.coords.longitude;
                gmap.pos.zoom = args.zoom || gmap.zoom_default;
                resolve(gmap.pos);
            }, function () {
                reject('Error: The Geolocation service failed or your browser doesn\'t support geolocation.');
            });
        } else {
            gmap.pos.lat = Number(args.lat);
            gmap.pos.lng = Number(args.lng);
            gmap.pos.zoom = Number(args.zoom) || gmap.zoom_default;
            resolve(gmap.pos);
        }
    });
};
