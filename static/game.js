

/* Function that is called when unopened cell is left-clicked */
function check(id) {

    /* Turn cell id into dict containing coordinates of the cell */
    let coords = coordinates(id)

    /* Check if cell is already opened by referecing table 'check_board' */

    /* Immediately return if cell already opened or flagged */
    /* If not, mark it as opened */
    if (check_board[coords['r']][coords['c']] == 1 || check_board[coords['r']][coords['c']] == 7) {
        return;
    } else if (check_board[coords['r']][coords['c']] == 0) {
        check_board[coords['r']][coords['c']] = 1;
    }

    /* Checks if opened cell contains a mine (lose game) */
    if (board[coords['r']][coords['c']] == 'm') {
        lost = true;
        document.querySelector("#" + id).style.backgroundImage = "url('/static/mine_icon-01-red.png')";
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j] == 'm' && (i != coords['r'] || j != coords['c'])) {
                    document.querySelector('#r' + i.toString() + 'c' + j.toString()).style.backgroundImage = "url('/static/mine_icon-01.png')";
                }
            }
        }

        /* Change smiley */
        document.getElementById("reset_cat").src = "/static/cat_sad.png";

        /* Disable cells */
        let buttons = document.getElementsByClassName("game_button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        /* Stop timer */
        clearInterval(timerId);

        /* Log lose */
        log_lose();
        return;
    }

    /* Assigns proper background to opened cell depending on how many mines around */
    if (board[coords['r']][coords['c']] == '0') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/grey.png')";
    } else if (board[coords['r']][coords['c']] == '1') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_1_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '2') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_2_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '3') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_3_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '4') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_4_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '5') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_5_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '6') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_6_icon-01.png')";
    } else if (board[coords['r']][coords['c']] == '7') {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_7_icon-01.png')";
    } else {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/number_8_icon-01.png')";
    }

    /* Calls function 'location_check' to check current position on the game field */
    /* Position is stored on a global variable 'loc' */
    location_check(coords)

    /* Lots of recursion handling case when no mines around */
    /* Depending on the location, check() is called with different location id's */
    area_open(coords)

    /* Check if game is won */
    if (won() == true && win == false) {
        win = true;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j] == 'm') {
                    document.querySelector('#r' + i.toString() + 'c' + j.toString()).style.backgroundImage = "url('/static/flag_kenu_testi_1-01.png')";
                }
            }
        }

        /* Disable cells */
        let buttons = document.getElementsByClassName("game_button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        /* Stop timer */
        clearInterval(timerId)

        /* Update the page */
        document.querySelector('#mines_left').innerHTML = 0;
        document.querySelector('#seconds').innerHTML = time_1.toFixed(2);

        document.getElementById("reset_cat").src = "/static/cat_happy.png";

        /* Log */
        setTimeout(function(){ log_win(); }, 50);
    }
}


/* Function that is called each time a cell is right-clicked (flag) */
function mark(id) {
    coords = coordinates(id)
    if (check_board[coords['r']][coords['c']] == 1) {
        return
    }
    if (check_board[coords['r']][coords['c']] != 7) {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/flag_kenu_testi_1-01.png')";
        check_board[coords['r']][coords['c']] = 7;
        document.querySelector('#mines_left').innerHTML = mine_count - 1;
        mine_count = mine_count -1;
    } else {
        document.querySelector("#" + id).style.backgroundImage = "url('/static/light_grey-02-01.png')";
        check_board[coords['r']][coords['c']] = 0;
        document.querySelector('#mines_left').innerHTML = mine_count + 1;
        mine_count = mine_count +1;
    }

    /* If, for some reason, timer not started - start it now */
    if (start == false) {
        start_timer();
    }
    start = true;

    let hodor = Math.floor(Math.random() * 101);
    if (hodor == 7) {

    }
}


/* Function that is called each time a cell is right and left -clicked at the same time (open all surrounding cells) */
function both(id) {
    coords = coordinates(id)
    location_check(coords)

    /* If cell is flagged, return */
    if (check_board[coords['r']][coords['c']] != 1) {
        return 0;
    }

    /* If number of surrounding flags doesnt match, change surrounding unopened cells to dark grey */
    let flags = flag_number(coords);
    if (flags != board[coords['r']][coords['c']] && document.getElementById("os_info").innerHTML == "Windows") {
        let recolored = [];
        if (loc == "m") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] - 1] == 0 || check_board[coords['r'] - 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] + 1] == 0 || check_board[coords['r'] - 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] - 1] == 0 || check_board[coords['r']][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] - 1] == 0 || check_board[coords['r'] + 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] + 1] == 0 || check_board[coords['r'] + 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString());
            }

        } else if (loc == "br") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] - 1] == 0 || check_board[coords['r'] - 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] + 1] == 0 || check_board[coords['r'] - 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] - 1] == 0 || check_board[coords['r']][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString());
            }

        } else if (loc == "blc") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] + 1] == 0 || check_board[coords['r'] - 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }

        } else if (loc == "brc") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] - 1] == 0 || check_board[coords['r'] - 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] - 1] == 0 || check_board[coords['r'] - 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString());
            }

        } else if (loc == "le") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] + 1] == 0 || check_board[coords['r'] - 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] + 1] == 0 || check_board[coords['r'] + 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString());
            }

        } else if (loc == "re") {
            if (check_board[coords['r'] - 1][coords['c']] == 0 || check_board[coords['r'] - 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + coords['c'].toString());
            }
            if (check_board[coords['r'] - 1][coords['c'] - 1] == 0 || check_board[coords['r'] - 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r']][coords['c'] - 1] == 0 || check_board[coords['r']][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] - 1] == 0 || check_board[coords['r'] + 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString());
            }

        } else if (loc == "tlc") {
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] + 1] == 0 || check_board[coords['r'] + 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString());
            }

        } else if (loc == "trc") {
            if (check_board[coords['r']][coords['c'] - 1] == 0 || check_board[coords['r']][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] - 1] == 0 || check_board[coords['r'] + 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString());
            }

        } else if (loc == "tr") {
            if (check_board[coords['r']][coords['c'] + 1] == 0 || check_board[coords['r']][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString());
            }
            if (check_board[coords['r']][coords['c'] - 1] == 0 || check_board[coords['r']][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c']] == 0 || check_board[coords['r'] + 1][coords['c']] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] - 1] == 0 || check_board[coords['r'] + 1][coords['c'] - 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString());
            }
            if (check_board[coords['r'] + 1][coords['c'] + 1] == 0 || check_board[coords['r'] + 1][coords['c'] + 1] == 9) {
                document.querySelector("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString()).style.backgroundImage = "url('/static/grey.png')";
                recolored.push("#r" + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString());
            }
        }
        return recolored;

    } else if (flags != board[coords['r']][coords['c']]) {
        return 0;
    }

    /* Open surrounding unopened cells */
    if (loc == "br") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (loc == "m") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (loc == "blc") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (loc == "brc") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (loc == "le") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (loc == "re") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (loc == "tlc") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (loc == "trc") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (loc == "tr") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    }
    return 0;
}


/* Function to recolor tiles back after left mouse button is lifted */
function recolor(id_list) {
    for (let i = 0; i < id_list.length; i++) {
        document.querySelector(id_list[i]).style.backgroundImage = "url('/static/light_grey-02-01.png')";
    }
}


/* Takes in cell id as a string and returns a dict with coordinates */
function coordinates(id) {
    let coords = {};
    let r = id.substr(1,2);
    if (r.substr(1,2) == 'c') {
        r = r.substr(0,1);
    }
    r = parseInt(r)
    coords['r'] = r;
    let c = id.substr(id.length - 3, id.length - 1)
    if (c.substr(1,1) == 'c') {
        c = c.substr(2,3);
    } else {
        c = c.substr(1,3)
    }
    c = parseInt(c)
    coords['c'] = c;
    return coords;
}


/* Checks current location and updates global variable 'loc' accordingly */
function location_check(dict) {
    let r = dict['r'];
    let c = dict['c'];
    /* left top corner */
    if (c == 0 && r == 0) {
        loc = "tlc";
    /* top row */
    } else if (r == 0 && c != 0 && c != (columns-1)) {
        loc = "tr"
    /* right top corner */
    } else if (r == 0 && c == (columns-1)) {
        loc = "trc"
    /* left edge */
    } else if (c == 0 && r != 0 && r != (rows-1)) {
        loc = "le"
    /* left bottom corner */
    } else if (c == 0 && r == (rows-1)) {
        loc = "blc"
    /* bottom row */
    } else if (r == (rows-1) && c != 0 && c != (columns-1)) {
        loc = "br"
    /* bottom right corner */
    } else if (r == (rows-1) && c == (columns-1)) {
        loc = "brc"
    /* right edge */
    } else if (c == (columns-1) && r != 0 && r != (rows-1)) {
        loc = "re"
    /* middle */
    } else {
        loc = "m"
    }
}


/* Opening area of cells recursively */
function area_open(coords) {
    if (board[coords['r']][coords['c']] == '0' && loc == "br") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "m") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "blc") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "brc") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "le") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "re") {
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] - 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "tlc") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "trc") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
    } else if (board[coords['r']][coords['c']] == '0' && loc == "tr") {
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r']).toString() + 'c' + (coords['c'] + 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c']).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] - 1).toString())
        check('r' + (coords['r'] + 1).toString() + 'c' + (coords['c'] + 1).toString())
    }
}


/* Checks if player has won the game, returns true if so */
function won() {
    for (let i = 0; i < rows; i ++) {
        if (check_board[i].includes(0) == true) {
            return false;
        } else if (parseInt(document.getElementById("mines_left").innerHTML) < 0) {
            return false;
        }
    }
    return true;
}


/* Takes as an input coordinates of cell to check and return how many mines around it */
function mine_number(dict) {
    let r = dict['r'];
    let c = dict['c'];
    let counter = 0;

    /* left top corner */
    if (c == 0 && r == 0) {
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c + 1] == 'm'){
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++
        }
    /* top row */
    } else if (r == 0 && c != 0 && c != (columns-1)) {
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++;
        }
        if (board[r + 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c + 1] == 'm') {
            counter ++;
        }
    /* right top corner */
    } else if (r == 0 && c == (columns-1)) {
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++;
        }
    /* left edge */
    } else if (c == 0 && r != 0 && r != (rows-1)) {
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
        if (board[r - 1][c + 1] == 'm') {
            counter ++;
        }
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c + 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++;
        }
    /* left bottom corner */
    } else if (c == 0 && r == (rows-1)) {
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
        if (board[r - 1][c + 1] == 'm') {
            counter ++;
        }
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
    /* bottom row */
    } else if (r == (rows-1) && c != 0 && c != (columns-1)) {
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r - 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
        if (board[r - 1][c + 1] == 'm') {
            counter ++;
        }
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
    /* bottom right corner */
    } else if (r == (rows-1) && c == (columns-1)) {
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r - 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
    /* right edge */
    } else if (c == (columns-1) && r != 0 && r != (rows-1)) {
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
        if (board[r - 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++;
        }
    /* middle */
    } else {
        if (board[r - 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r - 1][c] == 'm') {
            counter ++;
        }
        if (board[r - 1][c + 1] == 'm') {
            counter ++;
        }
        if (board[r][c - 1] == 'm') {
            counter ++;
        }
        if (board[r][c + 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c - 1] == 'm') {
            counter ++;
        }
        if (board[r + 1][c] == 'm') {
            counter ++;
        }
        if (board[r + 1][c + 1] == 'm') {
            counter ++;
        }
    }
    return counter;
}


/* Return the number of surrounding flags */
function flag_number(dict) {
    let r = dict['r'];
    let c = dict['c'];
    let counter = 0;

    /* left top corner */
    if (c == 0 && r == 0) {
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c + 1] == 7){
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++
        }

    /* top row */
    } else if (r == 0 && c != 0 && c != (columns-1)) {
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c + 1] == 7) {
            counter ++;
        }

    /* right top corner */
    } else if (r == 0 && c == (columns-1)) {
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++;
        }

    /* left edge */
    } else if (c == 0 && r != 0 && r != (rows-1)) {
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++;
        }

    /* left bottom corner */
    } else if (c == 0 && r == (rows-1)) {
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }

    /* bottom row */
    } else if (r == (rows-1) && c != 0 && c != (columns-1)) {
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }

    /* bottom right corner */
    } else if (r == (rows-1) && c == (columns-1)) {
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }

    /* right edge */
    } else if (c == (columns-1) && r != 0 && r != (rows-1)) {
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++;
        }

    /* middle */
    } else {
        if (check_board[r - 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c] == 7) {
            counter ++;
        }
        if (check_board[r - 1][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r][c + 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c - 1] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c] == 7) {
            counter ++;
        }
        if (check_board[r + 1][c + 1] == 7) {
            counter ++;
        }
    }
    return counter;
}


/* Creates a game board and adds a number of mines ('m') */
function create_board() {
        let board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = '-';
            }
        }
        for (let i = 0; i < mine_count; i++) {
            while (true) {
                let r = Math.floor(Math.random() * rows);
                let c = Math.floor(Math.random() * columns);
                if (board[r][c] == '-') {
                    board[r][c] = 'm';
                    break
                }
            }
        }
        return board;
}


/* Adds to game board as a string number how many mines around each cell */
/* Calls function mine_number() to get the number of mines */
function populate_board_mines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] != 'm') {
                let x = {};
                x['r'] = i;
                x['c'] = j;
                p = (mine_number(x))
                board[i][j] = p.toString();
            }
        }
    }
}


/* Creates a 'check board', a copy of game board to trach which cells have been already opened */
function create_check_board() {
    let check_board = [];
    for (let i = 0; i < rows; i++) {
        check_board[i] = [];
        for (let j = 0; j < columns; j++) {
            check_board[i][j] = 0;
        }
    }
    return check_board;
}


/* Adds mine location to check_board */
function populate_check_board() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] == 'm') {
                check_board[i][j] = 9;
            }
        }
    }
}


/* Used in clicking cloodown */
function unlock() {
    lock = 0;
}


/* Start timer, called when a game cell is clicked for the first time */
function start_timer() {
    timerId = setInterval(function() {
        time_1 += 0.01;
        document.querySelector("#seconds").innerHTML = time_1.toFixed(0);
    }, 10);
}


/* Fill up a dict containing some info about game played */
function log_win() {
    let winner_info = {};
    winner_info['difficulty'] = document.getElementById("difficulty_info").innerHTML;
    winner_info['time'] = parseFloat(time_1.toFixed(2));
    winner_info['os'] = document.getElementById("os_info").innerHTML;
    winner_info['result'] = "win";
 //   const date = new Date();
 //   winner_info['timestamp'] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    /* Send a request to check if time is good enough to make top 10 */
    $.ajax({
        type: "POST",
        url: "/check",
        data: JSON.stringify(winner_info),
        contentType: "application/json",
        dataType: 'json',
        success: function(check_result) {
            console.log("Check: " + check_result)
            if (check_result == "high score") {
                setTimeout(function(){ save_high_score(winner_info); }, 50);
            } else {
                setTimeout(function(){ dump(winner_info); }, 50);
            }
        }
    });
}


/* If time good enough, prompt user for name and send the info to server to be saved as a high score */
function save_high_score(winner_info) {
    winner_info['name'] = prompt("Congrats! You made it to Hall of Fame! Enter your name please.");
    while(winner_info['name'].length > 12) {
        winner_info['name'] = prompt("Congrats! You made it to Hall of Fame! Enter your name please (max 12 characters).");
    }

    $.ajax({
        type: "POST",
        url: "/save",
        data: JSON.stringify(winner_info),
        contentType: "application/json",
        dataType: 'json',
        success: function(save_result) {
            console.log("Save: " + save_result)
            if (save_result == "no name entered") {
                dump(winner_info);
                return;
            }
            alert("High score saved")
        }
    });
}


function log_lose() {
    let loser_info = {};
    loser_info['difficulty'] = document.getElementById("difficulty_info").innerHTML;
    loser_info['time'] = parseFloat(time_1.toFixed(2));
    loser_info['os'] = document.getElementById("os_info").innerHTML;
    loser_info['result'] = "lose";
    dump(loser_info);
}


/* If time not good enough, send some info to server anyway just to keep a log of games won */
function dump(info) {
    $.ajax({
        type: "POST",
        url: "/dump",
        data: JSON.stringify(info),
        contentType: "application/json",
        dataType: 'json',
        success: function(dump_result) {
            console.log("Dump: " + dump_result)
        }
    });
}


/******************************
*** Game settings and setup ***
******************************/

/* Play area */
if (document.getElementById("difficulty_info").innerHTML == "beginner") {
    var mine_count = 10;
    var rows = 9;
    var columns = 9;
} else if (document.getElementById("difficulty_info").innerHTML == "intermediate") {
    var mine_count = 40;
    var rows = 16;
    var columns = 16;
} else if (document.getElementById("difficulty_info").innerHTML == "expert") {
    var mine_count = 99;
    var rows = 16;
    var columns = 30;
} else {
    console.log("Game setup failed.")
}

/* Global variables for timer and click cooldown etc. */
var lock = 0;
var start = false;
var timerId = 0;
var time_1 = 0;
var recolored = 0;
var hodor_activated = false;
var win = false;
var lost = false;

/* Create game board */
var board = create_board()
var check_board = create_check_board()
populate_board_mines()
populate_check_board()
var loc = "start"