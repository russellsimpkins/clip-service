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
        url: '/svc/clip/team/Test/token/132050dbf258529724f0c1a711c666f76c5a72d53bf83329fe65728bb679cad1/MobileWeb',
        accepts: 'application/x-json',
        cache: false,
        crossDomain: true,
        dataType: 'json',
        type: 'GET',
        success: function(res) {
            console.log(res)
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



