

/* Helper file just for intermediate difficulty on mobile on orientation changes.*/
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;
    if (portrait) {
        document.getElementById("info_game_interm_m").style.width = "";
        document.getElementById("info_game_interm_m").style.marginLeft = "15px";
        document.getElementById("info_game_interm_m").style.marginRight = "15px";
    } else {
        document.getElementById("info_game_interm_m").style.width = "451px";
        document.getElementById("info_game_interm_m").style.marginLeft = "auto";
        document.getElementById("info_game_interm_m").style.marginRight = "auto";
    }
});


if (window.matchMedia("(orientation: landscape)").matches) {
    document.getElementById("info_game_interm_m").style.width = "451px";
    document.getElementById("info_game_interm_m").style.marginLeft = "auto";
    document.getElementById("info_game_interm_m").style.marginRight = "auto";
}