$(document).ready(function () {
    $("form").submit(function () {
        
        var formID = $(this).attr('id');
        
        var formNm = $('#' + formID);
        $.ajax({
            type: "POST",
            url: 'mail.php',
            data: formNm.serialize(),
            success: function (data) {
                
                $(formNm).html(data); 
            },
            error: function (jqXHR, text, error) {
                
                $(formNm).html(error);         
            }
        });
        return false;
    });
});