window.addEventListener("input", debounce(function (e) {
  if (e.target.id== "usertel") {
      checkTel();
  }
})
);

// let telWrapper = e.target.closest(".form-field");
let telEl = document.querySelector("[data-phone-pattern]");

const checkTel = () => {
  let valid = false;
  const tel = telEl.value.trim().replace(/\D/g, "");

  if (!isRequired(tel)) {
    showError(telEl, "Телефон не может быть пустым.");
  } else if (tel.length < 11) {
    showError(telEl, "Введите телефон полностью.");
  } else {
    showSuccess(telEl);
    valid = true;
  }
  return valid;
};

//mask phone
let eventCalllback = function (e) {
  let el = e.target,
    pattern = el.dataset.phonePattern,
    matrix_def = "+7(___) ___-__-__",
    matrix = pattern ? pattern : matrix_def,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = e.target.value.replace(/\D/g, "");
  if (def.length >= val.length) val = def;
  e.target.value = matrix.replace(/./g, function (a) {
    return /[_\d]/.test(a) && i < val.length
      ? val.charAt(i++)
      : i >= val.length
      ? ""
      : a;
  });
};
var phone_inputs = document.querySelectorAll("[data-phone-pattern]");
for (let elem of phone_inputs) {
  for (let ev of ["input", "blur", "focus"]) {
    elem.addEventListener(ev, eventCalllback);
  }
}


const isRequired = (value) => (value === "" ? false : true);
const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const showError = (input, message) => {
  // get the form-field element
  const formField = input.parentElement;
  // add the error class
  formField.classList.remove("success");
  formField.classList.add("error");

  // show the error message
  const error = formField.querySelector("small");
  error.textContent = message;
};

const showSuccess = (input) => {
  // get the form-field element
  const formField = input.parentElement;

  // remove the error class
  formField.classList.remove("error");
  formField.classList.add("success");

  // hide the error message
  const error = formField.querySelector("small");
  error.textContent = "";
};



async function formSendServer() {
  let response = await fetch("sendmail.php", {
    method: "POST",
    body: new FormData(form),
  });
  if (response.ok) {
    let result = await response.json();
    alert(result.message);
    form.reset;
  } else {
    alert("ошибка");
  }
}
const debounce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};
//

