const usernameEl = document.querySelector("#username");
const emailEl = document.querySelector("#email");
const telEl = document.querySelector("#usertel");
const numberEl = document.querySelector("#number");
const checkBoxEl = document.querySelector("#checkbox");

const checkUsername = () => {
  let valid = false;

  const min = 3,
    max = 25;

  const username = usernameEl.value.trim();

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

const checkEmail = () => {
  let valid = false;
  const email = emailEl.value.trim();
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

const checkNumber = () => {
  let valid = false;
  const number = numberEl.value.trim();
  if (!isRequired(number)) {
    showError(numberEl, "Значение не может быть пустым.");
  } else {
    showSuccess(numberEl);
    valid = true;
  }
  return valid;
};

const checkBox = () => {
  let valid = false;
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
//
usernameEl.addEventListener("keydown", getOnlyLetters);

function getOnlyLetters(e) {
  if (e.key.match(/[0-9]/)) {
    return e.preventDefault();
  }
}

usernameEl.addEventListener("input", () => {
  usernameEl.value = usernameEl.value.replace(/[0-9]/g, "");
});

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

form.addEventListener("submit", function (e) {
  // prevent the form from submitting
  e.preventDefault();

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
form.addEventListener(
  "input",
  debounce(function (e) {
    switch (e.target.id) {
      case "username":
        checkUsername();
        break;
      case "email":
        checkEmail();
        break;
      case "usertel":
        checkTel();
        break;
      case "number":
        checkNumber();
        break;
      case "checkbox":
        checkBox();
        break;
    }
  })
);
