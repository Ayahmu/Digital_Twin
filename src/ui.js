var leftLabel = document.getElementById("leftLabel");
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
display_btn.addEventListener('click', function (){
    console.log(display_btn.id);
})

const play_btn = document.getElementById("play_btn");
play_btn.addEventListener('click', function (){
    console.log(play_btn.id);
})

const info_btn = document.getElementById("info_btn");
info_btn.addEventListener('click', function (){
    if(!leftLabel.style.display || !rightLabel.style.display){
        leftLabel.style.display = "block";
        rightLabel.style.display = "block";
    }
    leftLabel.classList.remove("left-slide-out");
    leftLabel.classList.add("left-slide-in");
    rightLabel.classList.remove("right-slide-out");
    rightLabel.classList.add("right-slide-in");
})

const close_btn = document.getElementById("close_btn");
close_btn.addEventListener('click', function (){
    leftLabel.classList.remove("left-slide-in");
    leftLabel.classList.add("left-slide-out");
    rightLabel.classList.remove("right-slide-in");
    rightLabel.classList.add("right-slide-out");
})

// 获取当前时间
var currentTime = new Date();

// 将时间格式化为所需的字符串格式
var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();
var seconds = currentTime.getSeconds();
var timeString = hours + ":" + minutes + ":" + seconds;

// 将时间显示到HTML中
document.getElementById("time").textContent = timeString;

