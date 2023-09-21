var rightLabel = document.getElementById("rightLabel");


const back_btn = document.getElementById("back_btn");
back_btn.addEventListener('click', function (){
    console.log(back_btn.id);
})

const home_btn = document.getElementById("home_btn");
home_btn.addEventListener('click', function (){
    console.log(home_btn.id);
})

const display_btn = document.getElementById("display_btn");

const play_btn = document.getElementById("play_btn");
play_btn.addEventListener('click', function (){

})

const info_btn = document.getElementById("info_btn");
info_btn.addEventListener('click', function (){

})

const close_btn = document.getElementById("close_btn");
close_btn.addEventListener('click', function (){
    rightLabel.classList.remove("right-slide-in");
    rightLabel.classList.add("right-slide-out");
})

document.addEventListener('DOMContentLoaded', function() {
    var currentDatetime = new Date();

    var year = currentDatetime.getFullYear();
    var month = String(currentDatetime.getMonth() + 1).padStart(2, '0');
    var day = String(currentDatetime.getDate()).padStart(2, '0');

    document.getElementById("time").textContent = year + "-" + month + "-" + day;
});

export {
    back_btn,
    home_btn,
    display_btn,
    play_btn,
    info_btn,
    close_btn
};