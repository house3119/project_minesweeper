
/*****************************
** Controls, Android/mobile **
******************************/


document.addEventListener("dblclick", function() {
    if ($(event.target).attr('class') == 'game_button') {
        /* Again, cooldown */
        lock = 1;
        if (lost != true) {
            both(event.target.id);
        }
        setTimeout(function(){ unlock(); }, 150);
    }

})


let pressed_button_id = "empty";
let long_press_timer_id = 0;
let long_press_timer = 0;
let scrolling = false;
let vibration = false;

document.addEventListener("touchstart", function() {
    long_press_timer = 0;
    if (event.target.className == "game_button") {
        pressed_button_id = event.target.id
        long_press_timer_id = setInterval(function() {
            long_press_timer += 0.01;
        }, 10)
    }
})

document.addEventListener("touchmove", function() {
    scrolling = true;
})

setInterval(function() {
    if (long_press_timer > 0.5 && vibration == false) {
        navigator.vibrate(250);
        vibration = true;
    }
}, 50)

document.addEventListener("touchend", function() {
    if (event.target.className == "game_button" && event.target.id == pressed_button_id) {
        if (long_press_timer >= 0.5) {
            if (lock == 0 && scrolling == false && lost == false) {
                mark(event.target.id)
            }
            lock = 1
            setTimeout(function(){ unlock(); }, 150);
            clearInterval(long_press_timer_id)
            scrolling = false;
            vibration = false;
            long_press_timer = 0;
        } else {
            if (lock == 0 && scrolling == false && lost == false) {
                check(event.target.id)
            }
            lock = 1
            setTimeout(function(){ unlock(); }, 150);
            clearInterval(long_press_timer_id)
            scrolling = false;
            vibration = false;
            long_press_timer = 0;
        }
    } else {
        clearInterval(long_press_timer_id)
        scrolling = false;
        vibration = false;
        long_press_timer = 0;
    }
})


/*****************
** Common Stuff **
*****************/


/* Disabling right-click menu over the game area */
$('.game_button').bind("contextmenu",function(e){
    return false;
});

$('.game_table').bind("contextmenu",function(e){
    return false;
});


/* First click on game area starts the timer (call start_timer(), which is in other javascript file) */
document.getElementById("game_table_id").addEventListener("click", function(){
    if (start == false) {
        start_timer();
    }
    start = true;
});
