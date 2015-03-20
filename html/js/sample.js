// This is the code to show the sample application

$( document ).ready(function() {

    getFeatures();
    $("#wFinder").hide();
    $("#wFinder").toggleClass("hidden");
    $("#wCurrent").hide();
    $("#wCurrent").toggleClass("hidden");
    
});

function getFeatures() {
    console.log("***** Getting features");
    jQuery.ajax({
        url: '/svc/clip/team/Test/token/26545601bb712aa236302fa6e5adff8ef29b22c50e975d8887af68e0394ab51f/MobileWeb',
        accepts: 'application/x-json',
        cache: false,
        crossDomain: true,
        dataType: 'json',
        type: 'GET',
        success: function(res) {
            if (res.features.useAmazonDirectMatch.dev) {
                console.log("SHOWING THIS");
                //$("#wFinder").toggleClass("hidden");
                $("#wFinder").fadeIn(3500);
            }
            if (res.features.usePapiForBlogs.dev) {
                console.log("SHOWING THIS");
                //$("#wCurrent").toggleClass("hidden");
                $("#wCurrent").fadeIn(1500);
            }
            console.log(res);
        },
        error: function(xhr,status,err) {
            console.log(status);
        }
    });
}



