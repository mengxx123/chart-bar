function baring() {
    var highest = 0;
    $('.bar').each(function () {
        value = $(this).siblings('.value').val().match(/\d/g);
        value = value.join("") * 1;
        if (value >= highest) {
            highest = value;
        }
    });
    $('.bar').each(function () {
        value = $(this).siblings('.value').val().match(/\d/g);
        value = value.join("") * 1;
        $(this).css('height', (value / highest * 100) + '%');
    });
    ndivs = $('.bar').length;
    if (ndivs == 1) {
        $('.remove').css('opacity', '0');
    } else {
        $('.remove').css('opacity', '1');
    }
}

$('.value').keyup(function () {
    baring();
});
$('input').keyup(function () {
    $('.done').removeClass('hide');
});

$('.add').click(function () {
    var newtower = $('.selected').clone(true).insertAfter('.selected');
    $('.tower').removeClass('selected');
    newtower.addClass('selected').find('.bar').trigger('click');
    $('.remove').css('opacity', '1');
});

$('#close').on('click', function () {
    $('#view-box').hide()
})

$('.remove').click(function () {
    ndivs = $('.bar').length;
    if (ndivs != 1) {
        $('.remove').css('opacity', '0');
        $('body').removeClass('custome-colors');
        var target = $('.selected').closest('.tower').prev();
        $('.selected').remove();
        target.addClass('selected').find('.bar').trigger('click');
        baring();
    }
});

$('.bar').click(function () {
    target = $(this);
    targetcolor = $(this).css('background-color');
    $('.tower').removeClass('selected');
    $(this).parents('.tower').addClass('selected');
    $('body').addClass('custome-colors');
    colorindication();
});

function colorindication() {
    $('.colors div').each(function () {
        if ($(this).css('background-color') == targetcolor) {
            $(this).addClass('current');
        } else {
            $(this).removeClass('current');
        }
    });
}

$('html').click(function () {
    $('body').removeClass('custome-colors');
    $('.tower').removeClass('selected');
});

$('.bar, .colors, .add, .remove').click(function (event) {
    event.stopPropagation();
});

$('.colors div').click(function () {
    color = $(this).css('background-color');
    targetcolor = color;
    target.css('background-color', color);
    colorindication();
});

var ratio = "normal";
$('.ratio').click(function () {
    if (ratio == "wide") {
        ratio = "normal";
        $('.canvas, .box').removeClass('wide').addClass(ratio);
    }
    else if (ratio == "normal") {
        ratio = "square";
        $('.canvas, .box').removeClass('normal').addClass(ratio);
    }
    else if (ratio == "square") {
        ratio = "wide";
        $('.canvas, .box').removeClass('square').addClass(ratio);
    }
});

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '39') {
        var target = $('.selected').closest('.tower').next();
        $('.tower').removeClass('selected');
        target.addClass('selected').find('.bar').trigger('click');
    }
    else if (e.keyCode == '37') {
        var target = $('.selected').closest('.tower').prev();
        $('.tower').removeClass('selected');
        target.addClass('selected').find('.bar').trigger('click');
    }
    else if (e.keyCode == '38') {
        $('.selected .value').focus();
        $('.tower').removeClass('selected');
    }
    else if (e.keyCode == '40') {
        $('.selected .label').focus();
    }
    else if (e.keyCode == '13') {
        $('.selected').find('.add').trigger('click');
    }
    else if (e.keyCode == '46') {
        $('.selected').find('.remove').trigger('click');
    }
}

function capture() {
    html2canvas($("#canvas"), {
        proxy: "https://html2canvas.appspot.com/query",
        onrendered: function (canvas) {
            var img = canvas.toDataURL("image/png");
            var output = encodeURIComponent(img);
            console.log(output)

            var title = $('input.title').val();
            var subtitle = $('input.subtitle').val();
            var Parameters = "image=" + output + "&title=" + title + "&subtitle=" + subtitle;

            $('#view-box').show()
            $('#view-box-img').attr('src', img)

            //window.location.href = 'c/' + data;
            return
            $.ajax({
                type: "POST", url: "save.php", data: Parameters, success: function (data) {
                    window.location.href = 'c/' + data;
                }
            }).done(function () {
            });
        }
    });
}

$(function () {
    $('.frame').sortable({
        delay: 100,
        cancel: 'input, .add, .remove',
        opacity: 0.8,
        start: function () {
            $('.tower').removeClass('trans');
        },
        stop: function () {
            $('.tower').addClass('trans');
        }
    });
});

$('.done').click(function () {
    $(':input').removeAttr('placeholder');
    setTimeout(capture, 500);
    //$(this).hide();
    //$('.loader').show();
});

$(function () {
    var i = Math.floor((Math.random() * 3) + 2);
    while (i--) {
        $('.tower:last').clone(true).insertAfter('.tower:last');
    }
});

$('.splash .button').click(function () {
    ratio = "wide";
    $('.canvas, .box').removeClass('wide').addClass(ratio);
    $('.box').removeClass('full');
    $('.splash').fadeOut();
    $('body').addClass('wizard');
    $('.value').each(function () {
        $(this).val(Math.floor((Math.random() * 8) + 1));
    });
    baring();
    $('.featured').remove();
});
