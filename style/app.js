const main = document.querySelector('.logo');
const searchInput = document.querySelector('#search-input');
//console.log(main);
main.addEventListener('click',()=>{
    window.location.href = "http://localhost:3000"
})



searchInput.addEventListener('focus', () => {
    searchInput.dataset.placeholder = searchInput.placeholder; 
    searchInput.placeholder = '';
});

searchInput.addEventListener('blur', () => {
    searchInput.placeholder = searchInput.dataset.placeholder;
});
