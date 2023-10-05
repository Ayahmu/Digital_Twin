import {page_config} from "./config.js";

const back_btn = document.getElementById("back_btn");
back_btn.addEventListener('click', function (){
    // window.open(page_config.url, '_blank');
})

const home_btn = document.getElementById("home_btn");
home_btn.addEventListener('click', function (){
    console.log(home_btn.id);
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
};