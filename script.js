let tax_form = document.getElementById("tax_form");
let mainContainer = document.getElementById("main-container");
let grossIncomeInput = document.getElementsByName('grossIncome')[0];
let extraIncomeInput = document.getElementsByName('extraIncome')[0];
let deductionsInput = document.getElementsByName('deductions')[0];
let ageInput = document.getElementsByName('age')[0];
let resetBtn = document.getElementsByClassName("reset_btn")[0];
let grossIncomeInfo = document.getElementById("gross_income_info");
let extraIncomeInfo = document.getElementById("extra_income_info");
let deductionInfo = document.getElementById("deduction_info");
let ageInfo = document.getElementById("age_select_info");
let grossInputValid = document.getElementById("gross_input_valid");
let extraInputValid = document.getElementById("extra_input_valid");
let deductionInputValid = document.getElementById("deduction_input_valid");


// Event listener to toggle info display
tax_form.addEventListener('click', function(e){
  const infoClasses = document.querySelectorAll(".info_class");
  const validInfoClasses = document.querySelectorAll(".valid_info");

  infoClasses.forEach(infoClass => {
    // if (infoClass.contains(e.target)) {
    //   e.target.closest(".info_class").children[1].classList.toggle('hide_container');
    // } else {
    //   infoClass.children[1].classList.add('hide_container');
    // }
    if (e.target.closest(".info_class") === infoClass) {
      e.target.closest(".info_class").children[1].classList.toggle('hide_container');
    } else {
      infoClass.children[1].classList.add('hide_container');
    }

  });
  validInfoClasses.forEach(infoClass => {
    if (e.target.closest(".valid_info") === infoClass) {
      e.target.closest(".valid_info").children[1].classList.toggle('hide_container');
    } else {
      infoClass.children[1].classList.add('hide_container');
    }
  });
});

// Function to display modal with calculated income
function addModal(income) {
  const html = `  <div id="modal">
                  <h2>Your overall income will be <span>₹ ${income.toLocaleString('en-IN')}</span></h2>
                  <p>After tax deduction. </p>
                  <button id="closeModal">Close</button>`;
          
  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  

  mainContainer.insertAdjacentElement('beforebegin',overlay)
  mainContainer.insertAdjacentHTML("beforeend", html);
  
  let modal = document.getElementById("modal");

  let closeModalBtn = document.getElementById("closeModal");
  let overlayClose = document.querySelector(".overlay");

  function closeModal() {
      modal.parentNode.removeChild(modal);
      overlay.parentNode.removeChild(overlay);
      document.removeEventListener("keydown", escapeModal);
  }

  const escapeModal = (e)=>{
    console.log(e.key);
      if(e.key === 'Escape'){
        closeModal()
      }
  }

  closeModalBtn.addEventListener('click', closeModal);
  overlayClose.addEventListener('click', closeModal );
  document.addEventListener("keydown", escapeModal);
}

// Calculate total income
const salaryCalculator = ({ grossIncome, extraIncome, deductions }) =>
  (+grossIncome) + (+extraIncome) - (+deductions);

// Calculate salary after tax deduction
const taxCalculator = (salary, taxRate) =>
  salary - (taxRate * (salary - 800000)) / 100;

// Calculate tax deducted salary based on age and income
const taxDeductedSalary = (data) => {
  const calculatedSalary = salaryCalculator(data);
  let tax = 0;

  return (calculatedSalary <= 8_00_000)
    ? calculatedSalary - tax
    : +data?.age === 1
    ? taxCalculator(calculatedSalary, 30)
    : +data?.age === 2
    ? taxCalculator(calculatedSalary, 40)
    : taxCalculator(calculatedSalary, 10);
};

// Function to validate number inputs
const numberValidator =numb=> +numb;

// Function to toggle border color on input validation
function togglingBorder(method){
  grossIncomeInput.classList[`${method}`]('invalid');
  extraIncomeInput.classList[`${method}`]('invalid');
  deductionsInput.classList[`${method}`]('invalid');
  ageInput.classList[`${method}`]('invalid');
}

// Form submission handler
function submitHandler(e) {
  e.preventDefault();
  const formData = [...new FormData(tax_form)];
  const data = Object.fromEntries(formData);

 togglingBorder("remove");

  if (!data.age ||!numberValidator(data?.grossIncome)
  || (!numberValidator(data?.extraIncome) &&  +data?.extraIncome !== 0 )
  || (!numberValidator(data?.deductions) && +data?.deductions !==0  )
)
   {
    !+data?.age && ageInput.classList.add('invalid');
    !numberValidator(data?.grossIncome) && grossIncomeInput.classList.add('invalid');
    (!numberValidator(data?.extraIncome) &&  +data?.extraIncome !== 0 ) && extraIncomeInput.classList.add('invalid');
    (!numberValidator(data?.deductions) && +data?.deductions !==0  ) && deductionsInput.classList.add('invalid');
  }
 
  else{
    const salaryAfterTax = taxDeductedSalary(data);
    grossIncomeInput.value="";
    extraIncomeInput.value="";
    deductionsInput.value="";
    ageInput.value=0;
    addModal(salaryAfterTax);
  }
}

// Event listener for form submission
tax_form.addEventListener("submit", submitHandler);
resetBtn.addEventListener('click', ()=>  togglingBorder("remove"));

