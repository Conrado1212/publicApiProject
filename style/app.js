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
        li.addEventListener('click',(e)=>{
            e.stopPropagation();
            trigger.textContent = li.textContent;
            //dodac wywolanie funkcji 
            options.style.display = 'none';
            console.log('options ',options);
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

let page = 2;
let loading = false;
const loadCircle = document.querySelector('.circle_wrapper')
async function loadMore(){
    if(loading)return;
    loading = true;
    loadCircle.style.display = 'flex';
    const order = document.querySelector('.dropdown_filter_select span').textContent.toLowerCase();
    try{
    const res = await fetch(`/api/games?page=${page}&ordering=-${order}`);
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
    const load = document.getElementById("load");

    for (let i = 0; i < data.results.length; i += 4) {
        const group = data.results.slice(i, i + 4);

        
        const col = document.createElement("div");
        col.classList.add("discover_columns_column");

       
        group.forEach(game => {
            const imgSrc = game.background_image || "images/No_Image_Available.jpg";
            const genre = game.genres
            .map(gen => `<span><a href="">${gen.name}</a></span>`)
                     .join(', ') 
            col.insertAdjacentHTML(
                "beforeend",
                `
                <div class="game_card">
                    <div class="card_wrapper" tabindex="0">
                        <div class="card_media">
                            <img src="${imgSrc}" alt="">
                        </div>
                        <div class="card_info">
                            <div class="info_platforms">
                            
                            </div>
                            <div class="card_title">
                                <a href="" class="">${game.name}</a>
                             </div>
                             <div class="card_button">
                             <button>
                                 <i class="fa-solid fa-plus"></i>
                             </button>
                             <ul class="card_about">
                                                    <li class="card_about_info">
                                                        <div class="term">Release date:</div>
                                                        <div class="description">${game.released}</div>
                                                    </li>
                                                    <li class="card_about_info">
                                                        <div class="term">Genres:</div>
                                                        <div class="description">
                                                        ${genre}
                                                        </div>
                                                    </li>
                            </ul>
                            <div class="more">
                                                    <a href="/games-like-" class="show_more_like">Show more like this</a>
                                                    <div class="arrow">
                                                        <span></span>   
                                                        <span></span>
                                                    </div>
                                                </div>
                             </div>
                        </div>
                    </div>
                </div>
                `
            );
        });

        load.appendChild(col);
    }

    page++;
}finally{
    loadCircle.style.display ='none';
    loading = false;
}
   
}
//let size = 20;

//let page = 2;

async function filterMain(){
    if(loading)return;
    loading = true;
    const order = document.querySelector('.dropdown_filter_select span').textContent.toLowerCase();
    const page = 1;
    try{
    const res = await fetch(`/api/games?page=${page}&ordering=-${order}`);
    const data = await res.json(); 
    console.log("RAW data:", data, "type:", typeof data);
    }finally{
        loading = false;
    }
}




    window.addEventListener("scroll",()=>{
        //check
       if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 ){
          loadMore();
       }
    });
    //animate card

    // const cards = document.querySelectorAll('.game_card');
    // cards.forEach(card=>{
    //     card.addEventListener('mouseenter',(e)=>{
    //         //class
    //         console.log(e.target);
    //         console.log(card.offsetHeight);
    //         card.style.height = `${card.offsetHeight}px`;
    //         card.classList.add('game-card_opened');
         
    //         card.querySelector('.card_about').style.display="block";
    //     });


    //     card.addEventListener('mouseleave',()=>{
    //         card.querySelector('.card_about').style.display="none";
    //         card.style.height = '';
    //         card.classList.remove('game-card_opened');
    //     });
    // });

   
    document.addEventListener('mouseover', e => {
        const card = e.target.closest('.game_card');
        if (!card) return;
    
        card.style.height = `${card.offsetHeight}px`;
        card.classList.add('game-card_opened');
        card.querySelector('.card_about').style.display = "block";
    });
    
    document.addEventListener('mouseout', e => {
        const card = e.target.closest('.game_card');
        if (!card) return;
    
        card.querySelector('.card_about').style.display = "none";
        card.style.height = '';
        card.classList.remove('game-card_opened');
    });
    


    // async function loadSimilar(id) {
    //     const html = await fetch(`/game/${id}/similar`).then(r => r.text());
    //     console.log(html);
    //   //  document.querySelector("#main").innerHTML = html;
    //   }


//min
function min(a,b){
   return a > b ? b :a ;
}




 //   console.log(min(0, 10));
// → 0
//console.log(min(0, -10));
//-10


function isEven(a){
    if(a < 0){
      a = a*-1
        return  isEven(a)
    }
    if(a == 0){
        return true;
    }else if(a === 1){
        return false
    }else{
       return  isEven(a-2)
      
    }
}
//console.log(isEven(50));
// → true
//console.log(isEven(75));
// → false
//console.log(isEven(-1));
// → ??
function countBs(abc){
    let count  = 0;
    const dd = abc.split('');
    for(let i=0;i<dd.length;i++){
        if(dd[i]=='B'){
            count++;
        }
    }
    return count;
}

console.log(countBs("BOB"));

function countChar(abc, char){
    let count  = 0;
    const dd = abc.split('');
    for(let i=0;i<dd.length;i++){
        if(dd[i]==char){
            count++;
        }
    }
    return count;
}
console.log(countChar("kakkerlak", "k"));