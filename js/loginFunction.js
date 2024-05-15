export function loginFunction() {
  const user = document.getElementById("user_name_id");
  const email = document.getElementById("email_id");
  const formContainer = document.getElementById("login_form_id");
  const viewDashboard = document.getElementById("view_dashboard_id");
  viewDashboard.removeAttribute("href");
  user.addEventListener("input", function (event) {
    userErrorView(user);
  });

  email.addEventListener("input", function (event) {
    emailErrorView(email);
  });

  formContainer.onsubmit = function (event) {
    let checkingTargets = [user, email];
    checkErrorOnformsubmit(checkingTargets);
    event.preventDefault();
  };
}

/**
 * checkErrorOnformsubmit : will check whether the length of userNameValue and emailValue is 0
 * @param {*} userNameValue
 * @param {*} emailValue
 */
export function checkErrorOnformsubmit(checkingTargets) {
  let errorBooleanBalues = [];
  checkingTargets.forEach((x) => {
    let elementValueLength = x.value.length;
    if (elementValueLength === 0) {
      const booleanObject = {
        elementId: x.id,
        errorElement: true,
      };
      errorBooleanBalues.push(booleanObject);
    } else {
      const booleanObject = {
        elementId: x.id,
        errorElement: false,
      };
      errorBooleanBalues.push(booleanObject);
    }
  });
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
  });
  //displaying error message based on the errorElement.
  displayErrorMessage(errorBooleanBalues);
}

/**
 * displayErrorMessage : function, displaying error message based on error element
 * @param {*} errorBooleanBalues
 */
export function displayErrorMessage(errorBooleanBalues) {
  //all elements have error
  const allInputHaveError = errorBooleanBalues.every(
    (elements) => elements.errorElement === true
  );
  //no elements have error
  const noErrors = errorBooleanBalues.every(
    (elements) => elements.errorElement === false
  );

  //no inputs have error
  if (noErrors) {
    noErrorsFunction(errorBooleanBalues);
  }

  //all inputs have error
  if (allInputHaveError) {
    displayAllelementError(errorBooleanBalues);
  }

  //some elements have error.
  selectingErrorDisplay(errorBooleanBalues);
}

/**
 * selectingErrorDisplay : function will display error for if some input type elements have error
 * @param {*} errorBooleanBalues
 */
function selectingErrorDisplay(errorBooleanBalues) {
  errorBooleanBalues.forEach((x) => {
    if (x.errorElement === true) {
      const element = document.getElementById(x.elementId);
      const errorSibling = element.nextElementSibling;
      displayBorderError(element);
      displayError(errorSibling);
    }
  });
}

/**
 * noErrorsFunction : function will display error for if no input type elements have error
 * @param {*} errorBooleanBalues
 */
function noErrorsFunction(errorBooleanBalues) {
  let elementValue = [];
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    elementValue.push(element.value);
    let adjacentErrorElement = element.nextElementSibling;
    adjacentErrorElement.style.display = "none";
  });
  let userNameValue = elementValue[0];
  let emailValue = elementValue[1];
  checkUser(userNameValue, emailValue);
}

/**
 * displayAllelementError : function will display error for if all the input type elements have error
 * @param {*} errorBooleanBalues
 */
function displayAllelementError(errorBooleanBalues) {
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    let adjacentErrorElement = element.nextElementSibling;
    displayError(adjacentErrorElement);
    displayBorderError(element);
  });
}

/**
 * displayError : function will display error for which the classlist is applied to
 * @param {*} element
 */
function displayError(element) {
  element.classList.add("display_error");
}

/**
 * displayBorderError : function will display border error for which the classlist is applied to
 * @param {*} borderElement
 */
function displayBorderError(borderElement) {
  borderElement.classList.add("border_error");
}

/**
 * checkUser will check for the existingUser or unique user validation
 * @param {*} userNameValue
 * @param {*} emailValue
 */
function checkUser(userNameValue, emailValue) {
  const arr = returnUserData();
  let emailIdIsUnique = checkExistingUser(emailValue);
  let userDetailLength = arr.length;
  if (userDetailLength === 0 || emailIdIsUnique === true) {
    persistUserData(userNameValue, emailValue);
    //persisting email id to a key named "email" for retrieval and constructing the dom in other pages.
    persistingEmailId(emailValue);
    //if unique emailId and number of users in the local storage is 0,
    //then the user will be redirected to the dashboard page.
    goToDashboard(userNameValue, emailValue);
  } else {
    //here will be validating if the user is existing user.
    checkUserName(emailValue, userNameValue);
  }
}

/**
 * goToDashboard : function, will redirect us to the dashboard page using window.location.href.
 */
function goToDashboard() {
  window.location.href = `dashboard.htm`;
}

/**
 * checkUserName will check if the existimg data in the local storage 'user_details' have any user with the given email_id
 * @param {*} emailValue
 * @param {*} userNameValue
 */
function checkUserName(emailValue, userNameValue) {
  const arr = returnUserData();
  const userExists = arr.some(
    (user) =>
      user.value.userName === userNameValue && user.value.email === emailValue
  );
  if (userExists) {
    //if the user exists, the user will be redirected to the dashboard page.
    persistingEmailId(emailValue);
    goToDashboard(userNameValue, emailValue);
  } else {
    console.log("user name is wrong");
  }
}

/**
 * returnUserData will return user_detailsl credential from the local storage
 * @returns
 */
function returnUserData() {
  let user_data = JSON.parse(localStorage.getItem("user_details")) || [];
  const arr = Object.keys(user_data).map((key) => ({
    key,
    value: user_data[key],
  }));

  return arr;
}

/**
 * checkExistingUser will check if the return array from the local storage have any email value which matches with the email
 * value
 * @param {*} email_value
 * @returns
 */
function checkExistingUser(email_value) {
  let uniqueEmailId = true;
  let arr = returnUserData();
  arr.forEach((x) => {
    let value = x.value;
    if (value.email === email_value) {
      uniqueEmailId = false;
    }
  });
  return uniqueEmailId;
}

/**
 * persistUserData will persist login detail in local storage for every unique login credentials
 * @param {*} userNameValue
 * @param {*} emailValue
 */
function persistUserData(userNameValue, emailValue) {
  let user_data = JSON.parse(localStorage.getItem("user_details")) || [];
  let profile = `https://preview.redd.it/solo-leveling-trailer-been-out-for-a-min-how-are-people-v0-0ydwudqtwqpa1.png?auto=webp&s=082b91b16d2b7fd8f7513208c654828ddbf50223`;

  if (!Array.isArray(user_data)) {
    user_data = []; //converting retrieved object back to array.
  }

  const login_data = {
    userName: userNameValue,
    email: emailValue,
    profile_pic: profile,
  };

  user_data.push(login_data);
  localStorage.setItem("user_details", JSON.stringify(user_data));
}

//persisting email id to the key "email"
function persistingEmailId(emailValue) {
  localStorage.setItem("email", emailValue);
}

/**
 * userErrorView will view the error if the userName value is invalid
 */
function userErrorView(user) {
  const userError = document.getElementById("user_error_id");
  if (user.value.trim() === "") {
    userError.style.display = "block";
    user.classList.add("border_error");
  } else {
    userError.style.display = "none";
    user.classList.remove("border_error");
  }
}

/**
 * email_value function
 * @param {*} email
 */
function emailErrorView(email) {
  const loginBtn = document.getElementById("log_in_btn_id");
  const emailError = document.getElementById("email_error_id");
  if (email.value.trim() === "" || validateEmailRegex(email.value) === false) {
    emailError.style.display = "block";
    email.classList.add("border_error");
    loginBtn.disabled = true;
  } else if (email.value.trim() !== "") {
    loginBtn.disabled = false;
    emailError.style.display = "none";
    email.classList.remove("border_error");
  }
}

/**
 * Function to validate the email with the given regex
 * @param {*} email_value
 * @returns
 */
function validateEmailRegex(email_value) {
  const emailRegex = /^[a-zA-Z]+(?:\d+)?@[a-zA-Z]+\.[a-zA-Z]+$/;
  return emailRegex.test(email_value);
}

export function readReturnFrombookNowPage() {
  let value = getParameterByName("returnFrombookNow");
  return value;
}
