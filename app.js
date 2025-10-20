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

//drag and drop NEWS button
let dragging = null;
let ghost = null;
let offsetY = 0;
let hoverTarget = null;
let dragStartY = 0;

$(".drag-btn").on("mousedown", function (e) {
    e.preventDefault();

    dragging = $(this).closest(".news");
    if (!dragging.length) {
        return;
    }

    offsetY = e.pageY - dragging.offset().top;
    dragStartY = e.pageY;
    hoverTarget = null;

    $(document).on("mousemove.drag", onDrag);
    $(document).on("mouseup.drag", onDrop);
});

function ensureGhost() {
    if (!dragging || ghost) {
        return;
    }

    const side = $("#side");

    ghost = dragging.clone().addClass("ghost");
    ghost.css({
        position: "absolute",
        top: dragging.position().top,
        left: dragging.position().left,
        width: dragging.outerWidth(),
        opacity: 0.6,
        pointerEvents: "none",
        zIndex: 1000,
    });

    side.append(ghost);
}

function onDrag(e) {
    if (!dragging) {
        return;
    }

    if (!ghost) {
      const moveDistance = Math.abs(e.pageY - dragStartY);
        if (moveDistance < 1) {
            return;
        }
        ensureGhost();
    }

    if (!ghost) {
        return;
    }

    const side = $("#side");
    const sideTop = side.offset().top;
    const relY = e.pageY - sideTop - offsetY;

    const maxY = side.height() - ghost.outerHeight();
    const newY = Math.max(0, Math.min(relY, maxY));

    ghost.css({ top: newY, left: dragging.position().left });

    // Detect which news item is hovered
    hoverTarget = null;
    $(".news").not(dragging).each(function () {
        const top = $(this).offset().top;
        const bottom = top + $(this).outerHeight();
        if (e.pageY >= top && e.pageY <= bottom) {
            $(".news").removeClass("hover-target");
            $(this).addClass("hover-target");
            hoverTarget = $(this);
            return false;
        }
    });
  }

  function onDrop() {
    $(document).off("mousemove.drag mouseup.drag");
    $(".news").removeClass("hover-target");

    if (ghost && dragging && hoverTarget) {
      const hoverTop = hoverTarget.offset().top;
      const hoverHeight = hoverTarget.outerHeight();
      const triggerZone = hoverTop + hoverHeight * 0.33;

      if (ghost.offset().top < triggerZone) {
        hoverTarget.before(dragging);
      } else {
        hoverTarget.after(dragging);
      }
    }

    if (ghost) {
      ghost.remove();
    }

    ghost = null;
    dragging = null;
    hoverTarget = null;
    dragStartY = 0;
  }

  //sample text
  $("input[type='checkbox']").on('change', function() {
    const id = $(this).attr("id");
    const ischeck = $(this).is(":checked");

    if(ischeck){
        if(id === "optBold"){
            $("#sampleText").css('font-weight', 'bold');
        }
        if(id === "optItalic"){
            $("#sampleText").css('font-style', 'italic');
        }
        if(id === "optUnderline"){
            $("#sampleText").css('text-decoration', 'underline');
        }
    }
    else{
        if(id === "optBold"){
            $("#sampleText").css('font-weight', 'normal');
        }
        if(id === "optItalic"){
            $("#sampleText").css('font-style', 'normal');
        }
        if(id === "optUnderline"){
            $("#sampleText").css('text-decoration', 'none');
        }
    }
  });

