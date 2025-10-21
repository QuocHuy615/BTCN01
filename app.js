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

        const rect = dragging[0].getBoundingClientRect();
        ghost.css({
            top: newY,
            left: dragging.position().left,
            width: Math.round(rect.width) + 'px',
            height: Math.round(rect.height) + 'px',
            boxSizing: window.getComputedStyle(dragging[0]).boxSizing,
            margin: 0,
        });

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

    updateHighlightStyle();
  });

$("#optBackground, #btnColor").on('input change', function(){
    const highlightColor = $("#optBackground").val();
    const textColor = $("#btnColor").val();
    $("#sampleText").css({
        background: highlightColor,
        color: textColor
    });    
    updateHighlightStyle();
});

//highlight
$("#btnHighlight").on("click", function () {
    const pattern = $("#pattern").val();
    if (!pattern) return;

    const regex = buildRegex(pattern);
    if (!regex) return;

    const $main = $("#mainText");

    // Remove existing highlights safely
    $main.find("span.highlight").each(function () {
        $(this).replaceWith($(this).text());
    });

    // Walk text nodes and wrap matches with span.highlight using jQuery
    function process($node) {
        $node.contents().each(function () {
            if (this.nodeType === 3) { // text node
                const text = this.nodeValue;
                regex.lastIndex = 0;
                let match;
                const nodes = [];
                let lastIndex = 0;
                while ((match = regex.exec(text)) !== null) {
                    const before = text.substring(lastIndex, match.index);
                    if (before) nodes.push(document.createTextNode(before));
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.textContent = match[0];
                    nodes.push(span);
                    lastIndex = match.index + match[0].length;
                }
                if (lastIndex > 0) {
                    const after = text.substring(lastIndex);
                    if (after) nodes.push(document.createTextNode(after));
                    $(this).replaceWith(nodes);
                }
            } else if (this.nodeType === 1) {
                const $el = $(this);
                if ($el.hasClass('highlight')) return;
                if ($el.is('script, style')) return;
                process($el);
            }
        });
    }

    process($main);
    updateHighlightStyle();
});

function buildRegex(pattern) {
    if (!pattern) return null;

    const hasMeta = /[.*+?^${}()|[\]\\\[\]]/.test(pattern);
    try {
        if (hasMeta) {
            return new RegExp(pattern, "gi");
        }
        return new RegExp(escapeRegex(pattern), "gi");
    } catch {
        return new RegExp(escapeRegex(pattern), "gi");
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

  function updateHighlightStyle() {
    const $sample = $("#sampleText");
    const color = $sample.css("color");
    const bg = $sample.css("background-color");
    const weight = $sample.css("font-weight");
    const style = $sample.css("font-style");
    const deco = $sample.css("text-decoration");

    $(".highlight").css({
      color: color,
      "background-color": bg,
      "font-weight": weight,
      "font-style": style,
      "text-decoration": deco
    });
  }

  //delete
  $("#btnDelete").on("click", function () {
    const pattern = $("#pattern").val().trim();
    if (!pattern) return;

    const regex = buildRegex(pattern);
    if (!regex) return;

    const $main = $("#mainText");
    let html = $main.html();

    html = html.replace(/<span class="highlight">(.*?)<\/span>/g, "$1");

    html = html.replace(regex, "");

    $main.html(html);
});

//reset
let originalText = $("#mainText").html();
$("#btnReset").on('click', function() {
    $("#mainText").html(originalText);
})


//create grid
$(document).ready(function() {
    const $container = $(".grid");
    const totalSlots = 15; 

    for (let i = 0; i < totalSlots; i++) {
        $container.append('<div class="animal empty"></div>');
    }
});

function createAnimal(name, icon) { 
  if (typeof window.__animalCounter === 'undefined') window.__animalCounter = 0;
  window.__animalCounter += 1;
  const id = 'animal-' + window.__animalCounter;

  return $(`
    <div class="animal filled" data-id="${id}">
      <div class="animal-content">
        <span class="icon">${icon}</span>
        <p class="name">${name || ''}</p>
      </div>
    </div>
  `);
}

$("#btnAdd").on('click', function() {
  const icon = $("#slctAnimal").val();
  const name = $("#slctAnimal option:selected").data("name");

  const $animal = createAnimal(name, icon);

  const $emptySlot = $(".grid").find(".animal.empty").first();

  if ($emptySlot.length) {
    $emptySlot.replaceWith($animal.hide().fadeIn(300));
    refreshGridEmptySlots();
  }
});

function refreshGridEmptySlots() {
  const $grid = $(".grid");
  const totalSlots = 15; // hoặc tuỳ ý
  const currentCount = $grid.find(".animal").length;

  for (let i = currentCount; i < totalSlots; i++) {
    $grid.append('<div class="animal empty"></div>');
  }

  $grid.find(".animal").each(function() {
    const $a = $(this);
    if ($a.find(".icon").length === 0) $a.addClass("empty");
    else $a.removeClass("empty");
  });
}

$(function() {
  let $dragging = null;          // con vật đang kéo
  let $placeholder = null;       // ô trống giả tạm
  let dragIndex = -1;            // vị trí ban đầu trong grid
  let $hoverTarget = null;       // phần tử đang hover

  const $grid = $(".grid");

  // ===== 1️⃣ Bắt đầu kéo =====
  $grid.on("mousedown", ".animal.filled", function(e) {
    if (e.which !== 1) return; // chỉ click chuột trái
    e.preventDefault();

    $dragging = $(this);
    dragIndex = $dragging.index();

    const rect = $dragging[0].getBoundingClientRect();

    // tạo placeholder giữ chỗ
    $placeholder = $('<div class="animal placeholder"></div>');
    $dragging.after($placeholder);

    // di chuyển con vật ra ngoài để kéo tự do
    $dragging.css({
      position: "absolute",
      width: rect.width,
      height: rect.height,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      zIndex: 1000,
      cursor: "grabbing",
      pointerEvents: "none",
      opacity: 0.9,
      boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
      transition: "none"
    }).addClass("dragging").appendTo("body");

    $(document)
      .on("mousemove.gridDrag", onDrag)
      .on("mouseup.gridDrag", onDrop);
  });

  // ===== 2️⃣ Khi di chuyển =====
  function onDrag(e) {
    if (!$dragging) return;

    // cập nhật vị trí con vật
    $dragging.css({
      left: e.pageX - $dragging.width() / 2,
      top: e.pageY - $dragging.height() / 2
    });

    // xác định phần tử đang hover trong grid
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const $target = $(el).closest(".animal");
    $(".animal").removeClass("highlight shift-left");

    if ($target.length && !$target.is($placeholder)) {
      $hoverTarget = $target.addClass("highlight");

      const targetIndex = $target.index();
      const currentIndex = $placeholder.index();

      // nếu vị trí đích khác, chèn placeholder
      if (targetIndex > currentIndex) {
        $target.after($placeholder);
      } else if (targetIndex < currentIndex) {
        $target.before($placeholder);
      }

      // hiệu ứng: các animal giữa placeholder và dragIndex dịch trái
      animateShift(currentIndex, targetIndex);
    }
  }

  // ===== 3️⃣ Hàm animation dịch trái =====
  function animateShift(current, target) {
    const $items = $grid.find(".animal").not(".placeholder, .dragging");
    $items.removeClass("shift-left");
    const start = Math.min(current, target);
    const end = Math.max(current, target);
    $items.slice(start, end).addClass("shift-left");
  }

  // ===== 4️⃣ Thả chuột =====
  function onDrop() {
    $(document).off(".gridDrag");
    $(".animal").removeClass("highlight shift-left");

    if (!$dragging || !$placeholder) return;

    $placeholder.replaceWith($dragging);
    $dragging.removeClass("dragging").removeAttr("style");

    $dragging = null;
    $placeholder = null;
    $hoverTarget = null;
    dragIndex = -1;
  }
});

