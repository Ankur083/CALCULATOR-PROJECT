
let screen;

window.onload = function(){
    screen = document.getElementById("screen");
}


/* ---------- INPUT ---------- */

function pressNumber(num){
    screen.value += num;
}

function pressOperator(op){
    screen.value += op;
}

function pressln(){
    screen.value += "ln(";
}

function pressDot(){
    screen.value += ".";
}

function clearScreen(){
    screen.value="";
}

function deleteLast(){
    screen.value = screen.value.slice(0,-1);
}


/* ---------- CALCULATE RESULT ---------- */
function degSin(x){
    return Math.sin(x * Math.PI / 180);
}
function degCos(x){
    return Math.cos(x * Math.PI / 180);
}
function degTan(x){
    return Math.tan(x * Math.PI / 180);
}

function calculateResult(){
    try{
        let expression = screen.value;


        // convert symbols
        expression = expression
            .replace(/×/g,"*")
            .replace(/÷/g,"/");

        // convert functions (CASE INSENSITIVE)
        expression = expression
            .replace(/ln\(/gi,"Math.log(")
            .replace(/sin\(/gi,"degSin(")
            .replace(/cos\(/gi,"degCos(")
            .replace(/tan\(/gi,"degTan(");

        // evaluate
        let result = eval(expression);

        if(isNaN(result) || !isFinite(result)){
            screen.value = "Error";
        }else{
            screen.value = Number(result.toFixed(10));
        }
    }
    catch{
        screen.value = "Error";
    }
}





/* ---------- MATH FUNCTIONS ---------- */

function squareNumber(){
    let value = Number(screen.value);
    if(isNaN(value)) return;
    screen.value = value*value;
}

function squareRoot(){
    let value = Number(screen.value);
    if(value < 0){
        screen.value="Error";
        return;
    }
    screen.value = Math.sqrt(value);
}

// trig functions now use DEGREES

function calculateSin(){
    screen.value += "sin(";
}

function calculateCos(){
    screen.value += "cos(";
}

function calculateTan(){
    screen.value += "tan(";
}



/* ---------- Currency Popup ---------- */

function openCurrencyBox(){
    document.getElementById("currencyBox").style.display="block";
}

function closeCurrencyBox(){
    document.getElementById("currencyBox").style.display="none";
}

// function convertMoney(){

//     let value = Number(screen.value);
//     if(isNaN(value)) return;

//     let from = document.getElementById("fromCurrency").value;
//     let to = document.getElementById("toCurrency").value;

//     let rates = {
//         inr:1,
//         usd:0.012,
//         eur:0.011
//     };

//     let result = value / rates[from] * rates[to];

//     screen.value = result.toFixed(2);

//     closeCurrencyBox();
// }



const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

// Fetch currency list
async function loadCurrencies() {
    try{
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await res.json();

        const currencies = Object.keys(data.rates);

        currencies.forEach(currency=>{
            let option1 = document.createElement("option");
            let option2 = document.createElement("option");

            option1.value = option2.value = currency;
            option1.text = option2.text = currency;

            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        });

        fromCurrency.value = "USD";
        toCurrency.value = "INR";
    }
    catch(err){
        console.log("Currency load error:",err);
    }
}


// ---------- FIXED convertMoney ----------
async function convertMoney(){

    let value = Number(screen.value);
    if(isNaN(value)){
        alert("Enter number in calculator first");
        return;
    }

    let from = fromCurrency.value;
    let to = toCurrency.value;

    try{
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await res.json();

        const rate = data.rates[to];

        if(!rate){
            screen.value = "Error";
            return;
        }

        const result = value * rate;

        screen.value = result.toFixed(2);
        closeCurrencyBox();
    }
    catch(err){
        console.log("Conversion error:",err);
        screen.value = "Error";
    }
}

loadCurrencies();

const clickSound = new Audio("/click.mp3");
clickSound.volume = 0.4; // softer sound

document.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
        clickSound.currentTime = 0;
        clickSound.play();
    });
});