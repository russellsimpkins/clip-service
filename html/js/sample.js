// This is the code to show the sample application

$( document ).ready(function() {

    getFeatures();
    $("#wFinder").hide();
    $("#wFinder").toggleClass("hidden");
    $("#wCurrent").hide();
    $("#wCurrent").toggleClass("hidden");
    
});

function getFeatures() {
    var data = {"requests": [{
        "id": "1",
        "url": "http://localhost/svc/clip/team/Test/token/132050dbf258529724f0c1a711c666f76c5a72d53bf83329fe65728bb679cad1/MobileWeb",
        "method": "GET"
    }, {
        "id": "2",
        "url": "http://www.stg.nytimes.com/svc/weather/v2/current-and-seven-day-forecast.json",
        "method": "GET"
    }]};
    console.log(data);
    console.log("***** Getting features");
    jQuery.ajax({
        url: '/svc/v1/magic',
        accepts: 'application/x-json',
        cache: false,
        crossDomain: true,
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: function(res) {
            console.log(res);
            console.log(res.responses);
            flags = JSON.parse(res.responses[0].payload);
            console.log(flags);
            var weather;
            if (res.responses[1].code == 200) {
                weather = JSON.parse(res.responses[1].payload);
                console.log(weather);
            }
            if (flags.features.useAmazonDirectMatch.dev) {
                console.log("Showing Finder");
                //$("#wFinder").toggleClass("hidden");
                if (weather.status == "OK") {
                    $("#wQuery").val(weather.results.current[0].city);
                }
                $("#wFinder").fadeIn(3500);
                
            }
            if (flags.features.usePapiForBlogs.dev) {
                console.log("Showing Current");

                $("#wCurrent").fadeIn(1500);
            }
            console.log(res);
        },
        error: function(xhr,status,err) {
            console.log(status);
        }
    });
}



