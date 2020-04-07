
var rotation = 0;

jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

$('.vibrar').click(function() {
    rotation += 5;
    $(this).rotate(rotation);
});