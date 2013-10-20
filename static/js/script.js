
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
                    var div = document.getElementById('trails-title');
                    div.style.visibility = 'visible';
                    var specdetails = data.specdetails;
                    var sd;
                    var taskTitle = '<div class="trail"><h2></h2><div class="trail-steps" id="trail0">';
                    
                    var stepString = '', z, stepHTML, stepHTML1;
                    for (z = 1; z <= 3; z++) {
                        stepString = stepString + '<ul class="step step-' + z + '"></ul>';
                    }
                    $('#trails').append(taskTitle + stepString);

                    for (sd in data){
                        stepHTML = '<li><a>' + data[sd].Name + '</a></li>';
                        $('#trail0 .step-1').append(stepHTML);

                        tepHTML = '<li><a href="' + data[sd].W3CLink + '">' + data[sd].W3CLink + '</a></li>';
                        $('#trail0 .step-2').append(tepHTML);

                        stepHTML1 = '<li><a>' + data[sd].Description + '</a></li>';
                        $('#trail0 .step-3').append(stepHTML1);
                    }
                    $('#trails').append('</div>');
            }
    });
}

//--------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
    $(".content").hide();
    $(".collapse").click(function(){
        $(this).next(".content").slideToggle(255);
    });

    var div = document.getElementById('trails-title');
    div.style.visibility = 'hidden';

    getInitialDetails();

   // var f = getTaskDetails();
    //var returnedList = f();
    //var clientIDsReturned = returnedList[0], jobIDsReturned = returnedList[1], taskIDsReturned = returnedList[2];

    $("#form-clicktime-submit").on("click", function() {

        queryXML();

        $("#trails").html("");
        $(".trail").remove();
        $(".step").remove();
        return false;
    });

});