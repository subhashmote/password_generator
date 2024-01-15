
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[passwordLengthInterger]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[copyMessageDisplay]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-strengthindicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '!#$%^&*(){}[]?';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// setIndicator("#ccc");


function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function getRndNumber(){
    return getRndInteger(0,9);
}


function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const ind = getRndInteger(0,symbols.length);
    return symbols.charAt(ind);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCaseCheck.checked)
    {
        hasUpper=true;
    }

    if(lowerCaseCheck.checked){
        hasLower=true;
    }

    if(numberCheck.checked){
        hasNumber=true;
    }

    if(symbolcheck.checked)
    {
        hasSymbol=true;
    }

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("green");
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("red");
    }
    else {
        setIndicator("red");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
     // fisher yates methode 
     for(let i=array.length-1;i>0;i--){
        // finding random j in range from 0 to i and swap the contents of array[i] and array[j].
        const j= Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
     }

     let str="";
     array.forEach((el)=>(str += el));
     return str;
}

function handlecheckboxchange(){
    checkCount=0;
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener("change",handlecheckboxchange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copybtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value){
    copyContent();
    }
})


generateBtn.addEventListener("click",() => {
    // if non of the checkboxes are selected
    if(checkCount==0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's create new password
    // remove old password
    password = "";

    // console.log("let's start the journey");


    // let's put the stuffs on password on the basis of which check boxes are checked ot which are not

    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }


    // if(lowerCaseCheck.checked){
    //     password += generateLowercase();
    // }

    // if(numberCheck.checked){
    //     password += getRndNumber();
    // }

    // if(symbolcheck.checked){ 
    //     password += generateSymbol();
    // }


    let funarray = [];

    if(upperCaseCheck.checked){
        funarray.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funarray.push(generateLowercase);
    }
    if(numberCheck.checked){
        funarray.push(getRndNumber);
    }
    if(symbolcheck.checked){
        funarray.push(generateSymbol);
    }

    // compulsary addition 
    for(let i=0;i<funarray.length;i++){
        password += funarray[i]();
    }

    // remaining addition
    for(let i=0;i<passwordLength - funarray.length;i++){
        const randomIndex = getRndInteger(0,funarray.length);
        password += funarray[randomIndex]();
    }

    console.log(password);

    // Shuffle Password
    password = shufflePassword(Array.from(password));

    console.log(password);

    // console.log(password);
    // update password on display box or input where we expect passsword will be shown
    passwordDisplay.value = password;

    // calculate strength
    calStrength();
})