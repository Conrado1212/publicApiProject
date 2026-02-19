const main = document.querySelector('.logo')
console.log(main);
main.addEventListener('click',()=>{
    window.location.href = "http://localhost:3000"
})

const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('focus', () => {
    searchInput.dataset.placeholder = searchInput.placeholder; 
    searchInput.placeholder = '';
});

searchInput.addEventListener('blur', () => {
    searchInput.placeholder = searchInput.dataset.placeholder;
});
