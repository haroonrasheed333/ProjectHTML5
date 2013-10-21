
$(".collapseabs").live("click", function(){
    console.log($(this).attr('id'));
    var specid = $(this).attr('id');
    var specno= specid.substring(10);
    console.log(specno);
    $("#abstract" + specno).slideToggle(255);
});

function getInitialDetails() {
    //alert(document.URL);
    var url = document.URL + 'initialcall';
    var spec_list = [], feature_list = [], browser_list = [];
    console.log("test");
    $.ajax(url, {
        type: "POST",
        dataType: 'json',
        success: function(data){
            console.log(data);
            spec_list = data.spec_list;
            feature_list = data.feature_list;
            browser_list = data.browser_list;
            console.log(browser_list);
            var bl;
            for (bl = 0; bl < browser_list[0].length; bl++){
                $('#browser_list').append(new Option(browser_list[0][bl], browser_list[0][bl]));
            }

            var fl;
            for (fl = 0; fl < feature_list[0].length; fl++){
                $('#feature_list').append(new Option(feature_list[0][fl], feature_list[0][fl]));
            }
        }
    });
}

function queryXML() {
    var url = document.URL + 'queryxml';
    var spec_list = [];
    var obj = {};
    obj['feature_name'] = ''
    obj['browser_name'] = ''

    var feature_name = $('#feature_list').val();
    var browser_name = $('#browser_list').val();

    if (feature_name != '0'){
        obj['feature_name'] = feature_name;
    }
    else if (browser_name != '0'){
        obj['browser_name'] = browser_name;
    }

    $.ajax(url, {
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        success: function(data){
                    console.log(data);
                    var div = document.getElementById('specs-title');
                    div.style.visibility = 'visible';
                    var specdetails = data.specdetails;
                    var sd;
                    
                    var specName, specLink, specDesc;

                    var i = 0;
                    for (sd in data){
                        $('#specifications').append('<ul class="spec-' + i + '"></ul>');
                        specName = '<li class="spec-name collapseabs" id="spec-name-' + i + '"><a \>' + data[sd].Name + '</a></li>';
                        $('#specifications .spec-' + i).append(specName);

                        specLink = '<li class="spec-link"><a href="' + data[sd].W3CLink + '">' + data[sd].W3CLink + '</a></li>';
                        $('#specifications .spec-' + i).append(specLink);

                        specDesc = '<li class="spec-desc"><a>' + data[sd].Description + '</a></li>';
                        $('#specifications .spec-' + i).append(specDesc);

                        var browsers = ''
                        for (b in data[sd].Browsers){
                            browsers = browsers + data[sd].Browsers[b].Name + data[sd].Browsers[b].Version + '+&emsp;' 
                        }

                        specBrow = '<li class="spec-brow">' + browsers + '</li>';
                        $('#specifications .spec-' + i).append(specBrow);

                        $('#specifications').append('<div class="abstract" id="abstract-' + i + '"></div>');
                        $('#specifications #abstract-' + i).append(data[sd].Description);

                        /*var div = document.getElementById('abstract-' + i);
                        div.style.visibility = 'hidden';*/
                        $(".abstract").hide();

                        i = i + 1;
                    }
            }
    });
}

//--------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
    $(".content").hide();
    $(".collapse").click(function(){
        $(this).next(".content").slideToggle(255);
    });

    var div = document.getElementById('specs-title');
    div.style.visibility = 'hidden';

    getInitialDetails();

    $("#search-specifications-submit").on("click", function() {

        queryXML();

        $("#specifications").html("");
        $(".trail").remove();
        $(".step").remove();
        return false;
    });

});
