Window.Utils = {};

(function(utils){
    utils.CreateModal = function(title,content)
    {
        $(".modal-title").html(title);
        $(".modal-body").html(content);
        $("#modal").modal();
    };
    utils.DismissModal =function(){
        $("#modal").modal("hide");
    };

})(Window.Utils);