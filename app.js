$("nav li").on("click", function() {
    const index = $(this).index();

    $("nav li").removeClass("active");
    $(this).addClass("active");

    $("#footer a").removeClass("active").eq(index).addClass("active");
});

$("#footer a").on("click", function() {
    const index = $(this).index("#footer a");

    $("#footer a").removeClass("active");
    $(this).addClass("active");

    $("nav li").removeClass("active").eq(index).addClass("active");
});


$("#btnStyle").on('click', function(e) {
    e.stopPropagation();

    if($("#stylePanel").hasClass("hidden")){
       
        const index = this.getBoundingClientRect();

        $("#stylePanel").css({
            top: index.bottom + 5 + "px",
            left: index.left - 50 + "px"
        });

        $("#stylePanel").removeClass("hidden");
    }
    else {
        $("#stylePanel").addClass("hidden");
    }

    $(this).toggleClass('active-border');
});

$(document).on('click', function(e) {
    if($(e.target).closest("#stylePanel, #btnStyle").length === 0){
        $("#stylePanel").addClass("hidden");
        $("#btnStyle").removeClass('active-border');
    }
});

//toggle and drab button for NEWS
$(".toggle-btn").on('click', function() {
    const news = $(this).closest(".news");
    const header = news.find(".news-header");

    news.toggleClass("expanded");
    const isExpanded = news.hasClass("expanded");

    if(isExpanded){
        $(this).text("↓");
        $(header).css({
            background: "#ff8c00",
            color: "white"
        });
        $(news).css('border', '1px solid grey');
    }
    else{
        $(this).text("▶");
        $(header).css({
            background: "#f5cf8a",
            color: "#98999c"
        });
        $(news).css('border', '1px solid #d2b48c');
    }
})