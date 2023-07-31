
/******************
** Controls, Mac **
*******************/


let control_down = false

document.addEventListener("keydown", function() {
    if (control_down == false && event.key == "Control") {
        control_down = true
    }
})

document.addEventListener("keyup", function(){
    if (event.key == "Control") {
        control_down = false
    }
})

document.addEventListener("dblclick", function() {
    if ($(event.target).attr('class') == 'game_button') {
        /* Again, cooldown */
        lock = 1;
        /* both() returns a list of cell ids if certain conditions are met. This is relating to flashing unopened cells grey while */
        both(event.target.id);
        setTimeout(function(){ unlock(); }, 150);
    }

})


$('.game_button').mousedown(function(event) {
    switch (event.which) {
        case 1:
            /* There is 150 ms adjustable cooldown on clicking to prevent weird interactions (mostly related to left + right -clicking) */
            if (lock == 0 && control_down == true) {
                mark(event.target.id)
                lock = 1
                setTimeout(function(){ unlock(); }, 150);
                break;
            }
            if (lock == 0) {
                check(event.target.id)
                lock = 1
                setTimeout(function(){ unlock(); }, 150);
                break;
            }

        case 2:
            break;
        case 3:
            if (lock == 0) {
                mark(event.target.id)
            }
            lock = 1
            setTimeout(function(){ unlock(); }, 150);
            break;
        default:
    }
});


/* This part of the code is solely for left + right -clicking */
let leftButtonDown = false;
let rightButtonDown = false;

document.addEventListener("mousedown", (e) => {
    /* Left-click */
    if (e.button === 0) {
        leftButtonDown = true;
    }
    /* Right-click */
    if (e.button === 2) {
        rightButtonDown = true;
    }
    /* If both left and right mouse buttons clicked at the same time */
    if (leftButtonDown && rightButtonDown) {
        if ($(event.target).attr('class') == 'game_button') {
            /* Again, cooldown */
            lock = 1;
            /* both() returns a list of cell ids if certain conditions are met. This is relating to flashing unopened cells grey while */
            recolored = both(event.target.id);
            setTimeout(function(){ unlock(); }, 150);
        }
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        leftButtonDown = false;
        /* Recoloring not currently working on mac */
        if (recolored == 1) {
            recolor(recolored)
            recolored = 0;
        }
    }
    if (e.button === 2) {
        rightButtonDown = false;
    }
});


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
