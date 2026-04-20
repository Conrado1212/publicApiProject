const main = document.querySelector('.logo');
const showMenu = document.querySelector('.discover');
const showMenuu = document.querySelectorAll('.discover');
const searchInput = document.querySelector('#search-input');
const modeSw = document.querySelector(".toggle-sw");
//console.log(main);
main.addEventListener('click',()=>{
    window.location.href = "http://localhost:3000"
})


modeSw.addEventListener("click", () =>{
    body.classList.toggle("white");
   });

searchInput.addEventListener('focus', () => {
    searchInput.dataset.placeholder = searchInput.placeholder; 
    searchInput.placeholder = '';
});

searchInput.addEventListener('blur', () => {
    searchInput.placeholder = searchInput.dataset.placeholder;
});


showMenuu.forEach(menu =>{
    menu.addEventListener('click',()=>{
        const text = menu.querySelector('.discover_text');
        const spans = menu.querySelectorAll('.arrow span');
        const second = menu.querySelector('span:nth-child(2)');

        const isShow = text.textContent ==="Show All";

        text.style.transform = isShow ? "rotate(45deg)": "rotate(-45deg)";
        second.style.transform = isShow ? "rotate(135deg)": "rotate(-135deg)";
        spans.forEach(span => {
            span.style.bottom = isShow ? "60%" : "30%";
        });
        text.textContent = isShow ? "Hide All" : "Show All";
    });
});

// showMenu.addEventListener('click',()=>{
//     if(document.querySelector('.discover > span').textContent === "Show All"){
//         showMenu.querySelector('span').style.transform = "rotate(45deg)";
//         showMenu.querySelectorAll('span').forEach(span=>{
//             span.style.bottom = "60%";
//     });
//     showMenu.querySelector('span:nth-child(2)').style.transform = "rotate(135deg)";
//     document.querySelector('.discover > span').textContent ="Hide All";
//     }else{
//         showMenu.querySelector('span').style.transform = "rotate(-45deg)";
//         showMenu.querySelectorAll('span').forEach(span=>{
//             span.style.bottom = "30%";
//     });
//         showMenu.querySelector('span:nth-child(2)').style.transform = "rotate(-135deg)";
//     document.querySelector('.discover > span').textContent ="Show All";
//     }
    
// })