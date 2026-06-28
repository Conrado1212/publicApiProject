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
        const platformMap = {
            "PC": "<i class=\"fa-brands fa-windows\"></i>",
                "PlayStation 5": "<i class=\"fa-brands fa-playstation\"></i>",
                     "PlayStation 4": "<i class=\"fa-brands fa-uncharted\"></i>",
                         "Xbox Series S/X": "<i class=\"fa-brands fa-xbox\"></i>",
                             "Xbox One": '<img class="" src="./images/xboxOne.jpg">',
                             "Nintendo Switch": "<i class=\"fa-solid fa-gamepad\"></i>",
                                 "macOS": "<i class=\"fa-brands fa-apple\"></i>",
                                    "Linux": "<i class=\"fa-brands fa-linux\"></i>"

                                        };
       
        group.forEach(game => {
            const imgSrc = game.background_image || "images/No_Image_Available.jpg";

            const genre = game.genres.map(gen => `<span><a href="">${gen.name}</a></span>`).join(', ') ;
            const gallery = game.short_screenshots.map(img=> `<img src="${img.image}" alt="">`).join('');
            console.log('gallery', gallery);
            const platform = (game.platforms ?? []).map(plat => platformMap[plat?.platform?.name]).filter(Boolean).join(" ");

            const progress = game.short_screenshots.length > 1 ? game.short_screenshots.map(()=> `<span class="progress"></span>`).join('') : '';
            col.insertAdjacentHTML(
                "beforeend",
                `
                <div class="game_card">
                    <div class="card_wrapper" tabindex="0">
                        <div class="card_media">
                            <img src="${imgSrc}" alt="">
                            <div class="screenshot-gallery">
                                 <div class="screenshot-gallery_wrapper">
                                     ${gallery}
                                 </div>
                                 <div class="screenshot-gallery_progress_wrapper">
                                    ${progress}
                                 </div>
                            </div>
                        </div>
                        <div class="card_info">
                            <div class="info_platforms">
                                    ${platform}
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
//funkcja filtrowania na stronie do dodania 
async function filterMain(){
    if(loading)return;
    loading = true;
    const order = document.querySelector('.dropdown_filter_select span').textContent.toLowerCase();
    const page = 1;
    const platform = '';
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
           console.log(('scroll'));
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
        card.querySelector('.screenshot-gallery').style.display = "block";
        const images = card.querySelectorAll('.screenshot-gallery_wrapper img');
        
       
        const wrapper = card.querySelector('.screenshot-gallery')
        const progress = wrapper.querySelectorAll('span');
       // console.log(progress);
        wrapper.addEventListener('mousemove', e =>{
            //get width heaig of my wrapper
            const rect = wrapper.getBoundingClientRect();
            //mouse position 
            const x = e.clientX - rect.left;
            //divide widht for 1 segment 
            const segmentWidth = rect.width / progress.length;
            //index of segment
        const index = Math.floor(x / segmentWidth);
        //index 
        const safeIndex = Math.max(0, Math.min(index, progress.length - 1));
        //remove active
        progress.forEach(s => s.classList.remove('active_screen'));
        //add active to one 
        progress[safeIndex].classList.add('active_screen');
        //remove dispaly of imges
        images.forEach(img => img.style.display = 'none');
        //add block for img 
        images[safeIndex].style.display = 'block';
        })
       
      
    });
    
    document.addEventListener('mouseout', e => {
        const card = e.target.closest('.game_card');
        if (!card) return;
        card.querySelector('.screenshot-gallery').style.display = "none";
        card.querySelector('.card_about').style.display = "none";
        card.style.height = '';
        card.classList.remove('game-card_opened');
    });
    


    // async function loadSimilar(id) {
    //     const html = await fetch(`/game/${id}/similar`).then(r => r.text());
    //     console.log(html);
    //   //  document.querySelector("#main").innerHTML = html;
    //   }


const returnBtn = document.getElementById('return');
if(returnBtn){
returnBtn.addEventListener('click',(e)=>{
    window.history.back();
})
}



 const current = window.location.pathname;
console.log('current',current);
// document.querySelectorAll("nav li a").forEach(link => {
//   if (link.getAttribute("href") === current) {
//     link.classList.add("active");
//   }
// });














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

//console.log(countBs("BOB"));

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
//console.log(countChar("kakkerlak", "k"));




function getWiderAspectRatio(a, b) {
  const [w1, h1] = a.split('x').map(Number);
  const [w2, h2] = b.split('x').map(Number);
   
let w,h;
let ratioW, ratioH;
if(w1/h1 > w2/h2){
    w = w1;
    h = h1;
     ratioW = w1;
     ratioH = h1;
}else{
    w = w2;
    h = h2;
     ratioW = w2;
     ratioH = h2;
}

let reszta  = w % h ;

       while(reszta !== 0){
         w = h
        
         h = reszta
        
         reszta = w % h
       }
    
    const nwd  = h
    
   
  

    return `${ratioW / nwd}:${ratioH /nwd}`;
  }
  //getWiderAspectRatio("1080x1350", "2048x1536")




  function getBestHand(cards) {
let  rangs = {'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'T':0,'J':0,'Q':0,'K':0,'A':0};
let  color = {'h':0,'d':0,'c':0,'s':0};

cards?.forEach(card =>{
    if(card.slice(0,-1) in  rangs){
        rangs[card.slice(0,-1)]++;
    }
   console.log(card.slice(-1));
    if(card.slice(-1) in color){
        color[card.slice(-1)]++;
    }
});

const pary = Object.values(rangs).filter(v => v === 2);
const rankOrder = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const pattern = rankOrder.map(r => rangs[r] > 0 ? 'X' : '_').join('');
const faceRanks = ['A', 'K', 'Q', 'J', 'T'];
const isRoyal   = faceRanks.every( d => rangs[d] === 1) && Object.values(color).includes(5);
const isStraight =
    pattern.includes("XXXXX") || (rangs['A'] && rangs['2'] && rangs['3'] && rangs['4'] && rangs['5']);
if(Object.values(rangs).includes(3) && !Object.values(rangs).includes(2)){
    return 'Three of a Kind';
}else if(Object.values(rangs).includes(4)){
    return 'Four of a Kind';
}else if(Object.values(rangs).includes(3) && Object.values(rangs).includes(2)){
    return 'Full House';
}else if(isRoyal){
    return 'Royal Flush';
}else if(isStraight && Object.values(color).includes(5)){
    return 'Straight Flush';
}else if(pary.length === 2){
    return 'Two Pair';
}else if(pary.length === 1){
    return 'Pair';
}else if(Object.values(color).includes(5)){
    return 'Flush';
}else if(isStraight){
    return "Straight";
}else{
    return "High Card";
}


  }
  //getBestHand(["9c", "8c", "7c", "6c", "5c"])
  //getBestHand(["7s", "7h", "7d", "2c", "5h"]);

  //getBestHand(["Ks", "Kh", "Kd", "4s", "4h"])

  //getBestHand(["2h", "5h", "7h", "9h", "Jh"])

  //getBestHand(["Ts", "Th", "9d", "9c", "8h"])

  function getCombinations(n) {
        let result  =[];
        
        function helper(open=0,close=0,current=""){
            if(current.length === n*2){
                result.push(current);
                return;
            }
            if(open < n){
                helper(open+1,close,current +"(");
            }
            if(close < open){
                helper(open,close+1,current +")")
            }
        }
   
        helper()
    return result.length;
  }

  //getCombinations(2);

  //getCombinations(3)


  function isBalanced(s) {
      const samo =['a','e','i','o','u']
        const chasr = s.split("");


        if(chasr.length %2 === 1){
            const mid  = Math.floor(chasr.length/2);
            chasr.splice(mid, 1);
        }
        
        const left = chasr.slice(0,chasr.length/2)

        const right = chasr.slice(chasr.length/2);
     console.log(left);
     console.log(right);
      const countVolwels  = arr => arr.filter(ch => samo.includes(ch.toLowerCase())).length;
      
    return countVolwels(left) === countVolwels(right);
  }

  //isBalanced("Lorem Ipsum")
  //isBalanced("racecar")


  function isValidNumber(n, base) {
    const chasr = n.toUpperCase().split("");
    const char  = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'A':10,'B':11,
'C':12,'D':13,'E':14,'F':15,'G':16,'H':17,'I':18,'J':19,'K':20,'L':21,'M':22,'N':23,'O':24,'P':25,'Q':26,'R':27,'S':28,'T':29,'U':30,'V':31,
'W':32,'X':33,'Y':34,'Z':35}


for(const h of chasr){
   // console.log(char[h])
    if(!(h in char)){
        return false;
    }
    if(char[h] >= base){
        return false
    }
}
return true;
  }

  //isValidNumber("10101", 2)

  function fibonacciSequence(startSequence, length) {
      let result =[...startSequence]
      if(length === 1){
        result.splice(1);
      }else if(length===0){
          result = [];
      }
      while(result.length !== length){
        result.push(result[result.length-1]+result[result.length-2])
      }
   
    return result;
  }

  //fibonacciSequence([0, 1], 20)

  //fibonacciSequence([21, 32], 1)



  function spaceJam(s) {
   // console.log(JSON.stringify(s));
    return  s.replace(/ /g, '').toUpperCase().split('').join('  ');
   
  }

  //spaceJam("freeCodeCamp")

  function jbelmu(text) {
    const ttt = text.split(' ');
    let result =[];
    ttt.forEach(t =>{
     if(t.length > 2){
      let xd =  t[0]+ t.slice(1,-1).split('').sort().join('') + t[t.length-1];
        result.push(xd);
     }else{
         result.push(t);
     }
    })
   return result.join(' ');
  }

 // jbelmu("hello world")


 function areAnagrams(str1, str2) {

    return str1.toLowerCase().split('').sort().join('')  === str2.toLowerCase().split('').sort().join('');
  }
  //areAnagrams("listen", "silent")

  //areAnagrams("School master", "The classroom")


  //snippett


  // 1. Namespace 
window.Conrado = window.Conrado || {};

// 2. Moduł odpowiedzialny za zmianę kontrolki
window.Conrado.controlEnhancer = {
    initialized: false,
    observer: null,

    init() {
        if (this.initialized) return;
        this.initialized = true;

       
        const ctrl = document.querySelector('[data-control-id="xdfdddd"]');
        if (!ctrl) return;

        ctrl.placeholder = "dddddd";

      
        ctrl.addEventListener("input", () => {
            console.log("Change value:", ctrl.value);
        });

       
        const list = document.querySelector('#grid_12345');
        if (!list) return;

        this.observer = new MutationObserver(mutations => {
            console.log("mutation");
        });

        this.observer.observe(list, { childList: true, subtree: true });
    },
    stop(){
        if(this.observer){
            this.observer.disconnect();
        }
        this.initialized = false;
    }
};


window.Conrado.controlEnhancer.init();



function findTarget(arr, target) {
    for(let i=0;i<arr.length;i++){
        for(let j=i+1;j<arr.length;j++){
            console.log(i ,'', j);
            if(arr[i] + arr[j] === target){
                return [i,j]
            }
        }
    }
    return "Target not found"
  }
  //findTarget([3, 2, 4, 5], 6)  

  //findTarget([2, 7, 11, 15], 9)

 // findTarget([1, 3, 5, 7], 14)


 function factorial(n) {
     let fac =1
        for(let i =1;i<=n;i++){
                   fac = fac *i;        
        }
    
    return fac;
  }

  //factorial(5)

  function sumOfSquares(n) {
    let sum = 0;
    for(let i =1;i<=n;i++){
        sum +=i**2; 
        console.log(sum);
    }
    return sum;
  }

  //sumOfSquares(5)

  function squaresWithThree(n) {
    let result = [];
    for(let i =1;i<=n;i++){
        const square  = i*i;
        if(square.toString().includes(3)){
            result.push(square);
        }
    }
    return result.length;
  };

  function milePace(miles, duration) {
    const [min,sec] = duration.split(':').map(Number)
    const totalMIn = min * 60 + sec;
    const seconds = totalMIn /miles;

    const mins = Math.floor(seconds/ 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");

    return `${mins}:${secs}`;
   
  }
  //milePace(3, "24:00")

  function decode(message, shift) {
    const alphabetArray = [
        "A","B","C","D","E","F","G","H","I","J","K","L","M",
        "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
      ];
      let result = ""
      const orginal = message.split('');
      const texzt  = message.toUpperCase().split('');
     
          for(let i=0;i<texzt.length;i++){
              if(!alphabetArray.includes(texzt[i])){
                result +=texzt[i];
                continue;
              }
                const index  = (alphabetArray.indexOf(texzt[i])-shift + alphabetArray.length) % alphabetArray.length;
                let decoded = alphabetArray[index];

                if (orginal[i] === orginal[i].toLowerCase()) {
                    decoded = decoded.toLowerCase();
                  }
              result +=decoded;
          }
    
      
    return result;
  }
  //decode("Byffi Qilfx!", 20)
  //decode("Xlmw mw e wigvix qiwweki.", 4)

  function isUnnaturalPrime(n) {
    if(n < 2 && n > -2) return false;
    if(n <  -2){
      n=n*-1;
    }
    for(let i=2;i<Math.sqrt(n*n);i++){
        if(n % i === 0){
            console.log(i);
            return false
        }
    }
        return true;
  }
  //isUnnaturalPrime(1);

  //isUnnaturalPrime(-1)

  //isUnnaturalPrime(19);


  function battle(myArmy, opposingArmy) {
        let value=0;
        let value1=0;
        if(myArmy.length > opposingArmy.length){
            return "Opponent retreated";
        }else if(myArmy.length < opposingArmy.length){
            return "We retreated";
        }


        function strength(ch){
            if(ch>='a' && ch<='z') return ch.charCodeAt(0) - 96;
            if(ch>='A' && ch<='Z') return ch.charCodeAt(0) - 38;
            if(ch>='0' && ch<='9') return Number(ch);
            return 0;
        }

        for(let i=0;i<myArmy.length;i++){
            const myVal = strength(myArmy[i]);
            const oppVal = strength(opposingArmy[i]);
            if(myVal > oppVal) value++;
            else if(myVal < oppVal) value1++;
        }
    
        if(value < value1) return "We lost"
       if(value > value1) return "We won"
          return "It was a tie"
        
  }

  //battle("Wizards", "Dragons");



  function toCamelCase(s) {
     return s.toLowerCase().split(/[\s-_]+/).map((word, index) =>{
            if(index === 0) return word;
            return word[0].toUpperCase()+word.slice(1);
     }).join("");

  }

  //toCamelCase("secret agent-X")

  function decode(s) {
      let result =[]
    s.split('').forEach(l=>{
        if(l === ')'){
         //   console.log(result);
            let temp = []
            while(result[result.length-1] !== '('){
                    temp.push(result.pop());
                }
            result.pop() ;
            temp.forEach(t => result.push(t));
        }else{
            result.push(l)
        } 
    })
    return result.join('');
  }

  decode("(f(b(dc)e)a)")

  function evaluate(numbers, operators) {
      let result =numbers[0];
    numbers.shift();
      
     numbers.forEach((n,i) =>{
        
    let  operator = operators [i%operators.length];
       if(operator === '+'){
           result +=n;
       }else if(operator === '-'){
        result -=n;
       }else if(operator === '%'){
        result %=n;
       }else if(operator === '/'){
        result /=n;
       }else if(operator === '*'){
        result *=n;
       }

     })
    return result;
  }
  //evaluate([17, 61, 40, 24, 38, 14], ['+', '%'])
  //evaluate([5, 6, 7, 8, 9], ['+', '-'])


  function getLaptopCost(laptops, budget) {
      let result =  [...new Set(laptops)];
      let l =result.length
    console.log('adad',result);
   let sort =  result.sort((a, b) => b - a);
    console.log(sort);
    let t = result.filter(price => price <= budget)

    if(l === t.length && t.length >=2) return t[1];

    if(l !== t.length && t.length >=2) return t[0];
    if(t.length === 1)return t[0]

     return 0
  }
 // getLaptopCost([1500, 2000, 1800, 1400],1900)
 // getLaptopCost([2099, 1599, 1899, 1499], 2200)
 // getLaptopCost([1500, 2000, 2000, 1800, 1400], 1900)

 function burnCandles(candles, leftoversNeeded) {
     let result  = candles  
     
        while(candles >= leftoversNeeded){
           let r = Math.floor(candles/leftoversNeeded);
            let reszta =  candles%leftoversNeeded
            candles = r +reszta 
           
            result +=r
        }
      
        return result
   
    
  }
  //burnCandles(7, 2)



  //burnCandles(10, 5)


  function findDuplicates(arr) {
    let newA =[];
    let diff = []
    for(let i=0;i<arr.length;i++){
        if(!newA.includes(arr[i])){
            newA.push(arr[i])
        }else if(!diff.includes(arr[i])){
            diff.push(arr[i])
        }
    }
  
    return diff.sort((a, b) => a-b);
  }
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  function generateHex(color) {
    if(color !== 'red' && color !== 'green' && color !== 'blue') return "Invalid color";
    let xd  = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
    
    if(color === 'red') return `${xd}0000`;
    if(color === 'green') return `00${xd}00`;
    if(color === 'blue') return `0000${xd}`;
   
  }
  //generateHex("red")
  //generateHex("yellow")

  function tribonacciSequence(startSequence, length) {
     
    if(length === 0) return [];
    if(length < 3) return startSequence.slice(0,length)
    let result = [...startSequence];
     while(result.length < length){
        let next = result[result.length-1] + result[result.length-2]+ result[result.length-3];
                result.push(next);
     }
    
    return result;
  }
  //tribonacciSequence([0, 0, 1], 20)
  //tribonacciSequence([10, 20, 30], 2)


  function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const toHex = c => c.toString(16).padStart(2, "0");

   
    return "#" + toHex(r) + toHex(g) + toHex(b);
   
  }

  rgbToHex("rgb(255, 255, 255)");



  function isPangram(sentence, letters) {
   
   const test =  sentence.toLowerCase().replace(/[^a-z]/g, "");
   console.log(test);
   const uniq = new Set(test);
    console.log(uniq);
   for(const letter of letters.toLowerCase()){
       console.log(letter);
       if(!uniq.has(letter)){
           return false;
       }
   }
   for (const letter of uniq) {
    if (!letters.includes(letter)) return false;
  }

   return true;
  }

  function repeatVowels(str) {
      let result = '';
      let repeat = 0;
 str.split('').forEach(el=>{
     
    if(el.toLowerCase() === 'a' || el.toLowerCase() === 'e' || el.toLowerCase() === 'i' || el.toLowerCase() === 'o' || el.toLowerCase() === 'u'){
            console.log(el);
        if(repeat > 0 ){
            result +=el + el.toLowerCase().repeat(repeat)
            repeat ++;
        }else{
            result +=el;
            repeat ++;
        }
       
    }else{
        result += el;
    }
 })
    return result;
  }
 // repeatVowels("AEIOU")
 // repeatVowels("hello world")



 //


 function isValidIPv4(ipv4) {
     const check =  ipv4.split('.')
    if(check.length !== 4)return false;
   return check.every(el=>{
       if(el === '' || isNaN(el)) return false;


    if (el.length > 1 && el.startsWith('0')) return false;
       const num = Number(el);
       return  num >=0 && num <=255;
   })
  }


 // isValidIPv4("192.168.1.1");



 function rotate(matrix) {
    
     const result = Array.from({length: matrix.length}, () =>Array(n).fill(0));
     console.log('test',result);
    
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      result[j][matrix.length - 1 - i] = matrix[i][j];
    }
  }
   return result;
  }
  //rotate([[1]]);




  function parseRomanNumeral(numeral) {
      let sum =0;
     
    const keyValue ={
        "I":1,
        "V":5,
        "X":10,
        "L":50,
        "C":100,
        "D":500,
        "M":1000
    }
    for(let i=0;i<numeral.length;i++){
        const current  = keyValue[numeral[i]];
        const next = keyValue[numeral[i+1]];
        if(next && current < next){
            sum -=current;
        }else{
            sum +=current
        }
    }

    return sum;
  }
  //parseRomanNumeral("III");


  function buildAcronym(str) {
      let newT = '';
    str.split(' ').forEach(el=>{
        if(el !== 'a' && el !== 'for' && el !== 'an' && el !== 'and' && el !== 'by' && el !== 'of'){
            newT += el[0].toUpperCase();
        }
       
        
    })
    return newT;
  }
  //buildAcronym("National Aeronautics and Space Administration") 

  //buildAcronym("Search Engine Optimization")


  function allUnique(str) {
    let uniq =[];
    let dd  = [];
    str.split('').forEach(el=>{
        if(uniq.includes(el)){
            dd.push(el);
        }else{
            uniq.push(el);
        }
    })
    if(dd.length >0){
        return false
    }else{
        return true;
    }
  
  }

  //allUnique("abc")