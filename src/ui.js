const back_btn = document.getElementById("back_btn");
back_btn.addEventListener('click', function (){
    console.log(back_btn.id);
})

const home_btn = document.getElementById("home_btn");
home_btn.addEventListener('click', function (){
    console.log(home_btn.id);
})

const display_btn = document.getElementById("display_btn");
display_btn.addEventListener('click', function (){
    console.log(display_btn.id);
})

const play_btn = document.getElementById("play_btn");
play_btn.addEventListener('click', function (){
    console.log(play_btn.id);
})

const info_btn = document.getElementById("info_btn");
info_btn.addEventListener('click', function (){
    console.log(info_btn.id);
})

const close_btn = document.getElementById("close_btn");
close_btn.addEventListener('click', function (){
    console.log(close_btn.id);
})

export {
    back_btn,
    home_btn,
    display_btn,
    play_btn,
    info_btn,
    close_btn
};