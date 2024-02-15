// const emailEl = document.querySelector("#email");
// const telEl = document.querySelector("#usertel");
// const numberEl = document.querySelector("#number");
// const checkBoxEl = document.querySelector("#checkbox");

let formField;

const checkUsername = (e) => {
  let valid = false;

  const min = 3,
    max = 25;

  formField = e.target.closest(".form-field");
  let usernameEl = formField.querySelector("[data-user-name]");
  let username = usernameEl.value.trim();

  // usernameEl.addEventListener("keydown", getOnlyLetters);

  // function getOnlyLetters(e) {
  //   if (e.key.match(/[0-9]/)) {
  //      e.preventDefault();

  //   }

  // }

  // usernameEl.addEventListener("input", () => {
  //   usernameEl.value = usernameEl.value.replace(/[0-9]/g, "");
  // });

  if (!isRequired(username)) {
    showError(usernameEl, "Имя не может быть пустым.");
  } else if (!isBetween(username.length, min, max)) {
    showError(
      usernameEl,
      `Имя пользователя должно содержать от ${min} до ${max} символов.`
    );
  } else {
    showSuccess(usernameEl);
    valid = true;
  }
  return valid;
};

const checkEmail = (e) => {
  let valid = false;

  formField = e.target.closest(".form-field");
  let emailEl = formField.querySelector("[data-user-email]");

  let email = emailEl.value.trim();

  if (!isRequired(email)) {
    showError(emailEl, "Email не может быть пустым.");
  } else if (!isEmailValid(email)) {
    showError(emailEl, "Email не является допустимым.");
  } else {
    showSuccess(emailEl);
    valid = true;
  }
  return valid;
};

const checkNumber = (e) => {
  let valid = false;

  formField = e.target.closest(".form-field");
  let numberEl = formField.querySelector("[data-user-number]");

  let number = numberEl.value.trim();
  if (!isRequired(number)) {
    showError(numberEl, "Значение не может быть пустым.");
  } else {
    showSuccess(numberEl);
    valid = true;
  }
  return valid;
};

const checkBox = (e) => {
  let valid = false;

  formField = e.target.closest(".form-field");
  let checkBoxEl = formField.querySelector("[data-user-checkbox]");
  const checkbox = checkBoxEl.checked;
  if (!checkbox) {
    showError(checkBoxEl, "Чтобы продолжить, дайте согласие.");
  } else {
    showSuccess(checkBoxEl);
    valid = true;
  }
  return valid;
};
//
const checkTel = (e) => {
  let valid = false;

  formField = e.target.closest(".form-field");
  let telEl = formField.querySelector("[data-phone-pattern]");

  let tel = telEl.value.trim().replace(/\D/g, "");

  if (!isRequired(tel)) {
    showError(telEl, "Телефон не может быть пустым.");
  } else if (tel.length < 11) {
    showError(telEl,   `Введите ещё ${11-tel.length} ${(7>tel.length > 0 ? 'цифр' : tel.length < 10  ? 'цифры' : 'цифру')}`);
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
//

const isEmailValid = (email) => {
  const re =
    /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isTelValid = (tel) => {
  return /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(tel);
};

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

window.addEventListener("submit", function (e) {
  // prevent the form from submitting
  e.preventDefault();
  console.log(a)
  // validate forms
  let isUsernameValid = checkUsername(),
    isEmailValid = checkEmail(),
    isTelValid = checkTel(),
    isNumberValid = checkNumber(),
    isCheckBoxValid = checkBox();

  let isFormValid =
    isUsernameValid &&
    isEmailValid &&
    isTelValid &&
    isNumberValid &&
    isCheckBoxValid;

  // submit to the server if the form is valid
  if (isFormValid) {
    form.classList.add("_sending");
    if (!document.querySelector(".spinner")) {
      form.insertAdjacentHTML(
        "beforebegin",
        '<div class="spinner"><div class="spinner-icon"></div></div>'
      );
    }
    formSendServer();
  }
});

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
const debounce = (fn, delay = 0) => {
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
window.addEventListener(
  "input",
  debounce(function (e) {
    if (e.target.id == "username") {
      checkUsername(e);
    }
      if (e.target.id == "email") {
        checkEmail(e);
      }
      if (e.target.id == "usertel") {
        checkTel(e);
      }
      if (e.target.id == "number") {
        checkNumber(e);
      }
      if (e.target.id == "checkbox") {
        checkBox(e);
      }
    
  })
);
