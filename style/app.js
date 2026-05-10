const main = document.querySelector('.logo');
const showMenu = document.querySelector('.discover');
const showMenuu = document.querySelectorAll('.discover');
const searchInput = document.querySelector('#search-input');
const grid = document.querySelector('#grid');
const column = document.querySelector('#column');
const modeSw = document.querySelector(".toggle-sw");
const select = document.querySelector("#select");
var body = document.querySelector('body');
//console.log(main);
main.addEventListener('click',()=>{
    window.location.href = "http://localhost:3000"
})


modeSw.addEventListener("click", (e) =>{
    console.log(e.target);
    body.classList.toggle("white");  
    body.classList.contains('white') ? (document.querySelector('.sun').style.opacity ='1' , document.querySelector('.moon').style.opacity = '0') : (document.querySelector('.sun').style.opacity ='0' , document.querySelector('.moon').style.opacity ='1');
   });

searchInput.addEventListener('focus', () => {
    searchInput.dataset.placeholder = searchInput.placeholder; 
    searchInput.placeholder = '';
});

searchInput.addEventListener('blur', () => {
    searchInput.placeholder = searchInput.dataset.placeholder;
});
//add hide on list

showMenuu.forEach(menu =>{
    menu.addEventListener('click',()=>{
        const ulMenu = menu.parentNode.parentNode;
       // console.log(ulMenu);
      
        const text = menu.querySelector('.discover_text');
        const spans = menu.querySelectorAll('.arrow span');
        const first = menu.querySelector('span')
        const second = menu.querySelector('span:nth-child(2)');

        const isShow = text.textContent ==="Show All";

        first.style.transform = isShow ? "rotate(45deg)": "rotate(-45deg)";
        second.style.transform = isShow ? "rotate(135deg)": "rotate(-135deg)";
        spans.forEach(span => {
            span.style.bottom = isShow ? "60%" : "30%";
        });
      
            ulMenu.querySelectorAll('li.initial-hidden').forEach(li =>li.classList.toggle('hidden', !isShow));
        
        text.textContent = isShow ? "Hide All" : "Show All";
    });
});
document.querySelectorAll('.dropdown_filter_select').forEach(drop =>{
    const trigger = drop.querySelector('.select-trigger span');
    const options = drop.querySelector('.select-options');
    const defaultValue = drop.dataset.default;

    trigger.textContent = defaultValue;

    //open options
    drop.addEventListener('click',()=>{
        console.log('drop');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    options.querySelectorAll('li').forEach(li=>{
        li.addEventListener('click',()=>{
            trigger.textContent = li.textContent;
            options.style.display = 'none';
        });
    });

    document.addEventListener('click',(e)=>{
        if(!drop.contains(e.target)){
            options.style.display = 'none';
        }
    });
});


[column,grid].forEach(e=>{
    e.addEventListener('click',()=>{
        column.classList.toggle('active');
        grid.classList.toggle('active');
    })
})
    document.querySelectorAll('.select-options li').forEach(li=>{ 
        
        li.addEventListener('mouseenter',(e)=>{
            const child = li.querySelector('.children');
            if(child){
                child.style.opacity ='1';
                child.style.pointerEvents ='auto';
            }
        });
        li.addEventListener('mouseleave',(e)=>{
            const child = li.querySelector('.children');
            if(!child) return;
            if(child && child.contains(e.relatedTarget)) return;
            child.style.opacity ='0';
            child.style.pointerEvents ='none';
        });
    });




let size = 20;

let page = 1;
let loading = false;
async function loadMore(){
    if(loading)return;
    loading = true;
    const res = await fetch(`/api/games?page=${page}`);
    const data = await res.json(); 
    console.log(page);
    console.log("RAW data:", data, "type:", typeof data);
   // console.log(data.next);
    if(!data?.next === null){
        console.log("No more data");
        loading = false;
        return;
    }
    //console.log("Next page", data.next);
    page++;
    loading = false;
}
    window.addEventListener("scroll",()=>{
        //check
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 ){
            loadMore();
        }
    });