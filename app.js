const checkUsername = (e) => {
  const MIN = 3,
    MAX = 25;
  let valid = false,
    formField = e.target.closest("[data-user-form]"),
    userNameEl = formField.querySelector("[data-user-name]"),
    userName = userNameEl.value.trim();

  if (!isRequired(userName)) {
    showError(userNameEl, "Имя не может быть пустым.");
  } else if (!isBetween(userName.length, MIN, MAX)) {
    showError(
      userNameEl,
      `Имя пользователя должно содержать от ${MIN} до ${MAX} символов.`
    );
  } else {
    showSuccess(userNameEl);
    valid = true;
  }
  return valid;
};

//enter letters only
function getOnlyLetters(e){
 e.target.value = e.target.value.replace(/[^a-zA-ZА-Яа-яЁё]/g,'')
}
document.querySelectorAll("[data-user-name]").forEach((e) => {
  for (let ev of ["keydown", "input", "blur", "focus", "paste"]) {
    ev === "paste"
    ?e.addEventListener(ev, (e) => e.preventDefault())
    :e.addEventListener(ev, getOnlyLetters)
  }
})

const checkEmail = (e) => {
  let valid = false,
    formField = e.target.closest("[data-user-form]"),
    emailEl = formField.querySelector("[data-user-email]"),
    email = emailEl.value.trim();
   
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

const checkBox = (e) => {
  let valid = false,
    formField = e.target.closest("[data-user-form]"),
    checkBoxEl = formField.querySelector("[data-user-checkbox]");
  const CHECKBOX = checkBoxEl.checked;
  if (!CHECKBOX) {
    showError(checkBoxEl, "Чтобы продолжить, дайте согласие.");
  } else {
    showSuccess(checkBoxEl);
    valid = true;
  }
  return valid;
};
//
const checkTel = (e) => {
  let valid = false,
    formField = e.target.closest("[data-user-form]"),
    telEl = formField.querySelector("[data-phone-pattern]"),
    tel = telEl.value.trim().replace(/\D/g, "");

  if (!isRequired(tel)) {
    showError(telEl, "Телефон не может быть пустым.");
  } else if (tel.length < 11) {
    showError(
      telEl,
      `Введите ещё ${11 - tel.length} ${
        7 > tel.length > 0 ? "цифр" : tel.length < 10 ? "цифры" : "цифру"
      }`
    );
  } else {
    showSuccess(telEl);
    valid = true;
  }
  return valid;
};

//mask phone
let maskPhone = function (e) {
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
let phone_inputs = document.querySelectorAll("[data-phone-pattern]");
for (let elem of phone_inputs) {
  for (let ev of ["input", "blur", "focus"]) {
    elem.addEventListener(ev, maskPhone);
  }
}
//
const isEmailValid = (email) => {
  const RE =
    /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return RE.test(email);
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

  // validate forms
  let isUsernameValid = checkUsername(e),
    isEmailValid = checkEmail(e),
    isTelValid = checkTel(e),
    isCheckBoxValid = checkBox(e);

  let isFormValid =
    isUsernameValid &&
    isEmailValid &&
    isTelValid &&
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
// for (let ev of ["input", "click"]) {
  window.addEventListener(
    "input",
    debounce(function (e) {
      if (e.target.name == "username") {
        checkUsername(e);
      }
      if (e.target.name == "email") {
        checkEmail(e);
      }
      if (e.target.name == "usertel") {
        checkTel(e);
      }
      if (e.target.name == "number") {
        checkNumber(e);
      }
      if (e.target.name == 'checkbox') {
        checkBox(e);
      }
    })
  );
// }


const USER_DATA = document.querySelectorAll("[data-user-data]")
let USER_TIME = document.querySelectorAll("[data-user-time]")

let today = new Date(),
 dd = today.getDate(),
 mm = today.getMonth() + 1, // Месяца идут с 0, так что добавляем 1.
 yyyy = today.getFullYear(),
 h = today.getHours(),
 s = today.getMinutes();
if(dd < 10){
  dd='0' + dd
} 
if(mm < 10){
  mm='0' + mm
} 

today = yyyy + '-' + mm + '-' + dd;
USER_DATA.forEach(e=>{
  e.setAttribute("min", today);
  e.value = today
})


const GET_TIME = setInterval(function() {
  let time = new Date();
  USER_TIME.forEach(e=>{
    e.value = (time.getHours() + ":" + time.getMinutes());
  })
}, 1000);