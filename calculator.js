const numpads = document.querySelectorAll('button.number, button.operator');
const topView = document.getElementById('topView');
const bottomView = document.getElementById('bottomView');
const equals = document.getElementById('equals');
const clearAll = document.querySelector('.ac');
const del = document.querySelector('.del');
const prevAns = document.querySelector('.ans');
const func = document.querySelectorAll('button.function.trig');
const demo = document.getElementById('demo');
const errorDisplay = document.getElementById('error');

let answers = [0]; // Answer history
let topViewValues = [];
let valuationBits = []; // Stores values to be evaluated
let userExpression = []; // Stores user expressions

function reset(){
  valuationBits = [];
  topViewValues = [];
  topView.value = '';
  bottomView.value = 0;
  demo.innerText = '';
  errorDisplay.style.display = 'none';
}
function error(){
  errorDisplay.style.display = 'block';
  errorDisplay.style.textAlign = 'center';
  errorDisplay.style.paddingTop = '5px';
}
function evaluate(){
  if(valuationBits.length === 0) {return;} // Prevent evaluation if no input

  let expr = valuationBits.join('').replace(/(\d)\s*\(/g, "$1*(");
  let ans;
  try {
    ans = eval(expr);
    bottomView.value = (ans * 10) / 10;

    if(isNaN(ans) || !isFinite(ans)){
      errorDisplay.innerText = 'Math Error';
      ans = 0;
      reset();
      error();
    };
    
    if(expr !== '') {
      answers.push(ans.toString());
      // Extract the expression part from the last history entry
      const lastExpr = userExpression.length > 0
        ? userExpression[userExpression.length - 1].split(' = ')[0]
        : null;
      if(expr !== lastExpr){
        userExpression.push(topViewValues[topViewValues.length-1] + ' = ' + ans);
        console.log(userExpression);
      };
    }
    else{expr = 0}
  } catch (e) {
    if(e instanceof SyntaxError){
      errorDisplay.innerText = 'Syntax Error';
      reset();
      error();
    }
  }
  if(expr === ''){
    bottomView.value = 0;
  }

}
function backspace(){
  topViewValues.pop();
  topView.value = topViewValues.map(val => symbolMap[val] || val).join('');
  valuationBits.pop();
  demo.innerText = valuationBits.join('');
}
function prevAnswer(){
  if (valuationBits.length > 0 && /[\d)]$/.test(valuationBits[valuationBits.length - 1])) {
    valuationBits.push('*');
    topViewValues.push('×');
  }
  topViewValues.push('Ans');
  topView.value = topViewValues.map(val => symbolMap[val] || val).join('');


  valuationBits.push(`(${answers[answers.length-1]})`);
  demo.innerText = valuationBits.join('');
}
const symbolMap = {
  '*': '×',
  '/': '÷',
  '-': '−'
};

// Type values into calculator viewport
numpads.forEach((numpad) => {
  numpad.addEventListener('click', ()=>{
    if ((numpad.value === '0'|| numpad.value === '00') && valuationBits.join('') === '') {
      return; // Prevent multiple leading zeros
    }
    if (valuationBits.length > 0 && /^\(/g.test(valuationBits[valuationBits.length - 1])) {
      valuationBits.pop();
      valuationBits.push('*(');
      topViewValues.push('');
    }

    valuationBits.push(numpad.value);
    topViewValues.push(numpad.value);
    demo.innerText = valuationBits.join('');
    topView.value = topViewValues.map(val => symbolMap[val] || val).join('');
  })
});

const digits = '1 2 3 4 5 6 7 8 9 0 - + * / ( ) .';

document.addEventListener('keydown', (event)=>{
  for(let i of digits.split(' ')){
    if(i == event.key){
      if ((event.key === '0'|| event.key === '00') && valuationBits.join('') === '') {
        return; // Prevent multiple leading zeros
      }
    if (valuationBits.length > 0 && /^\(/g.test(valuationBits[valuationBits.length - 1])) {
      valuationBits.pop();
      valuationBits.push('*(');
      topViewValues.push('');
    }
    valuationBits.push(event.key);
    topViewValues.push(event.key);
    demo.innerText = valuationBits.join('');
    topView.value = topViewValues.map(val => symbolMap[val] || val).join('');
  }};

  if(event.key == 'Enter' || event.key == '='){evaluate()}
  else if(event.key == 'Backspace' || event.key == 'Delete'){backspace()}
  else if(event.key == 'Control'){reset()}
  else if(event.key == 'a'){prevAnswer()};
});

// Evaluates expression
equals.addEventListener('click', evaluate);
// Recalls previous answers
prevAns.addEventListener('click', prevAnswer);
// Clears all expression
clearAll.addEventListener('click', reset);
// Backspace
del.addEventListener('click', backspace)

// Trigonometric functions
func.forEach((trig)=> {
  trig.addEventListener('click', () => {
    if (valuationBits.length > 0 && /[\d)]$/.test(valuationBits[valuationBits.length - 1])) {
      valuationBits.push('*');
      topViewValues.push('');
    }
    valuationBits.push(`Math.${trig.textContent}(Math.PI / 180 * `);
    topViewValues.push(trig.textContent+('('));
    demo.innerText = valuationBits.join('');
    topView.value = topViewValues.map(val => symbolMap[val] || val).join('');
  })
});

//use your random.js for random numbers