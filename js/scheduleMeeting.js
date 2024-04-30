/**
 * returnUserData : given function can be imported from its parent js folder where used. For the time being, its made
 * available in the same js page.
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
 * selectOrganiserfunction : function, will take the number of existing user and be used as options for select organiser tag.
 */
function selectOrganiserfunction() {
  const organiserId = document.getElementById("organizer_id");
  const imageId = document.getElementById("profile_pic_id");
  const userData = returnUserData();
  const documentFragment = document.createDocumentFragment();
  userData.forEach((x) => {
    const organiser = document.createElement("option");
    organiser.value = `${x.value.userName}`;
    organiser.textContent = `${x.value.userName}`;
    imageId.src = `${x.value.profile_pic}`;
    documentFragment.appendChild(organiser);
  });
  organiserId.appendChild(documentFragment);
}

/**
 * setMeetingRoomName : function, will be the fetching the meeting room name from the roomData.json via fetch api.
 */
function setMeetingRoomName() {
  const meetingRoomContainer = document.getElementById("rooms_id");
  fetch("../data/roomdata.json")
    .then((response) => {
      //if response is not ok then throw error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const documentFragment = document.createDocumentFragment();
      data.forEach((element, index) => {
        const room = document.createElement("option");
        room.value = `${element.room_name}`;
        room.textContent = `${element.room_name}`;
        documentFragment.appendChild(room);
      });
      meetingRoomContainer.appendChild(documentFragment);
    })
    .catch((error) => {
      //if there is error in reading the json file will catch the error and log it to the console.
      console.error("Error fetching the JSON file:", error);
    });
}

/**
 * meeetingNameErrorView : function, wil validate if the input field 'meeting_name_id'.
 * @param {*} meetingName
 */
function errorView(element) {
  const adjacentSibling = element.nextElementSibling;
  if (element.value.trim() === "") {
    adjacentSibling.classList.add("error_style");
    adjacentSibling.classList.remove("error_none");
    element.classList.add("border_error");
  } else {
    adjacentSibling.classList.add("error_none");
    element.classList.remove("border_error");
  }
}

/**
 * bookNowBtnFunction : function, is a btn being handling event onsubmit for the form id 'login_form_id'.
 */
function bookNowBtnFunction() {
  const meetingDate = document.getElementById("meeting_date_id");
  const startingTime = document.getElementById("starting_time_id");
  const scheduleForm = document.getElementById("login_form_id");
  const roomName = document.getElementById("rooms_id");
  const organizer = document.getElementById("organizer_id");
  const meetingName = document.getElementById("meeting_name_id");
  const endTimeInput = document.getElementById("ending_time_id");

  meetingName.addEventListener("keyup", function () {
    errorView(meetingName);
  });

  roomName.addEventListener("change", function () {
    errorView(roomName);
  });

  organizer.addEventListener("change", function () {
    errorView(organizer);
  });

  meetingDate.addEventListener("change", function () {
    errorView(meetingDate);
  });

  let checkingTargets = [
    roomName,
    meetingName,
    organizer,
    meetingDate,
    startingTime,
    endTimeInput,
  ];

  let validatedAllInputField = false;

  scheduleForm.onsubmit = function (event) {
    console.log("form submitted");
    event.preventDefault();
    checkErrors(checkingTargets);
  };
}

/**
 * checkErrors will check for the targets element value length, and will iteratively push the boolean value for every
 * alternative length of the element value === 0
 * @param {*} checkingTargets
 */
function checkErrors(checkingTargets) {
  //all the elements validation must be done here.
  let errorBooleanBalues = [];
  checkingTargets.forEach((x) => {
    let elementValueLength = x.value.length;
    // console.log(`data : ${x.id}`);
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
    //i will check the next sibling then
  });

  //display error message will be used to display error based on the boolean value thus passed.
  displayErrorMessage(errorBooleanBalues);
}

/**
 * displayErrorMessage : function, will display error message if the boolean value is true for key element errorElement
 * @param {*} errorBooleanBalues
 */
function displayErrorMessage(errorBooleanBalues) {
  //all elements have error
  const allInputsAreEmtpy = errorBooleanBalues.every(
    (elements) => elements.errorElement === true
  );

  //all inputs have error
  if (allInputsAreEmtpy) {
    console.log("all inputs are empty ");
    everyInputFieldEmptyError(errorBooleanBalues);
  }

  //some elements have error, means some element have true errorElements.
  selectingErrorDisplay(errorBooleanBalues);
}

//when some element's value is empty.
function selectingErrorDisplay(errorBooleanBalues) {
  console.log("\n");
  console.log("\n");
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    const adjacentErrorElement = element.nextElementSibling;
    if (x.errorElement === true) {
      displayError(adjacentErrorElement, element);
    } else {
      adjacentErrorElement.classList.add("error_none");
      element.classList.remove("border_error");
      viewErrorElementsWithValue(x.elementId);
      //yhape persist krna.
    }
  });
}

/**
 * displayError : function, will be displayed for if all the error element is true.
 * @param {*} adjacentErrorElement
 * @param {*} element
 */
function displayError(adjacentErrorElement, element) {
  switch (element.id) {
    case "meeting_date_id":
      adjacentErrorElement.textContent = "Date selection is empty!!!";
      break;
    case "starting_time_id":
      adjacentErrorElement.textContent = "Starting time selection is empty!!!";
      break;
    case "ending_time_id":
      adjacentErrorElement.textContent = "Ending time selection is empty!!!";
      break;
  }
  //if all the values are empty error_none is removed.
  adjacentErrorElement.classList.remove("error_none");
  adjacentErrorElement.classList.add("display_error");
  adjacentErrorElement.classList.add("error_style");
  element.classList.add("border_error");
}

/**
 * viewErrorElementsWithValue : function, please be mindful this function sole purpose is to only and only show the erros,
 * for input fields having value or not empty.
 * @param {*} elementId
 */
function viewErrorElementsWithValue(elementId) {
  switch (elementId) {
    //meeting name validation completed.
    case "meeting_name_id":
      meetingNameValidation(elementId);
      break;
    case "meeting_date_id":
      meetingDateValidation(elementId);
      break;
    case "starting_time_id":
      startingTimeValidation(elementId);
      break;
    case "ending_time_id":
      console.log("ending time id validation");
      endingTimeIdValidation(elementId);
      break;
    default:
      // console.log("other name id");
      break;
  }
}

function endingTimeIdValidation(elementId) {
  let endingTimeElement = document.getElementById(elementId);
  let endingTimeErrorElement = endingTimeElement.nextElementSibling;
  let endingTime = startingTimeElement.value;
  let endingTimeWrapper = document.getElementById("starting_wrapper_id");

  //Get the current time
  let currentTime = new Date();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();

  // Convert the current time to a string in HH:MM format
  let currentFormattedTime =
    (currentHours < 10 ? "0" : "") +
    currentHours +
    ":" +
    (currentMinutes < 10 ? "0" : "") +
    currentMinutes;

  //validate starting time
  if (endingTime <= currentFormattedTime) {
    // console.log(`starting time is invalid`);
    endingTimeWrapper.classList.add("ending_wrapper_alignment");
    endingTimeErrorElement.style.display = "block";
    endingTimeErrorElement.textContent = `Selected ending time is invalid`;
    endingTimeErrorElement.classList.add("error_style");
    document.getElementById("starting_time_id").value = "";
  } else {
    console.log(`Ending time is valid`);
    //with this block the value of starting time will be retained.
    endingTimeErrorElement.style.display = "none";
    endingTimeWrapper.classList.remove("ending_wrapper_alignment");
    let endingTimeId = "ending_time_id";
    // endingTimeValidation(endingTimeId, startingTime);
  }
}

/**
 * meetingNameValidation : function, input field : meeting_name_id validation.
 * @param {*} elementId
 */
function meetingNameValidation(elementId) {
  let element = document.getElementById(elementId);
  let adjacentSibling = element.nextElementSibling;
  let elementValue = element.value;

  // Regular expression to match names starting with an uppercase letter
  const nameRegex = /^[A-Z][a-zA-Z\s]*$/;

  if (!nameRegex.test(elementValue)) {
    adjacentSibling.textContent = `Meeting name must start with an uppercase letter.`;
    adjacentSibling.classList.remove("error_none");
    adjacentSibling.classList.add("error_style");
  } else {
    console.log("Name matches with the regex");
  }
}

/**
 * meetingDateValidation : function, used for validating the input field 'meeting_date_id'
 * @param {*} elementId
 */
function meetingDateValidation(elementId) {
  let dateValue = document.getElementById(elementId).value;
  let meetingDate = document.getElementById(elementId);
  let dateErrorElement = meetingDate.nextElementSibling;

  const selectedDateValue = new Date(dateValue);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  selectedDateValue.setHours(0, 0, 0, 0);

  //now time for validation.

  if (selectedDateValue.getTime() < currentDate.getTime()) {
    console.log("expiry date is lesser than the current date");
    dateErrorElement.classList.remove("error_none");
    dateErrorElement.textContent = `Selected date must be greater than the current Date`;
    dateErrorElement.classList.add("error_style");
  } else {
    console.log("Date matches with the regex");
  }
}

/**
 * startingTimeValidation : function, starting time validation.
 * @param {*} elementId
 */
function startingTimeValidation(elementId) {
  let startingTimeElement = document.getElementById(elementId);
  let startingTimeErrorElement = startingTimeElement.nextElementSibling;
  let startingTime = startingTimeElement.value;
  let startingTimeWrapper = document.getElementById("starting_wrapper_id");

  // Get the current time
  let currentTime = new Date();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();
  // Convert the current time to a string in HH:MM format
  let currentFormattedTime =
    (currentHours < 10 ? "0" : "") +
    currentHours +
    ":" +
    (currentMinutes < 10 ? "0" : "") +
    currentMinutes;

  //validate starting time
  if (startingTime <= currentFormattedTime) {
    // console.log(`starting time is invalid`);
    startingTimeWrapper.classList.add("ending_wrapper_alignment");
    startingTimeErrorElement.classList.remove("error_none");
    startingTimeErrorElement.textContent = `Selected starting time is invalid`;
    startingTimeErrorElement.classList.add("error_style");
    document.getElementById("starting_time_id").value = "";
  } else {
    //with this block the value of starting time will be retained.
    console.log(`starting time is valid`);
    startingTimeWrapper.classList.remove("ending_wrapper_alignment");
    let endingTimeId = "ending_time_id";
    endingTimeValidation(endingTimeId, startingTime);
  }
}

/**
 * endingTimeValidation : function, ending time validation.
 */
function endingTimeValidation(elementId, startingTime) {
  let endingTimeElement = document.getElementById(elementId);
  let endingTimeErrorElement = endingTimeElement.nextElementSibling;
  let endingTime = endingTimeElement.value;
  let endingWrapper = document.getElementById("ending_time_wrapper_id");

  // Get the current time
  let currentTime = new Date();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();
  // Convert the current time to a string in HH:MM format
  let currentFormattedTime =
    (currentHours < 10 ? "0" : "") +
    currentHours +
    ":" +
    (currentMinutes < 10 ? "0" : "") +
    currentMinutes;

  //validate starting time
  if (endingTime <= currentFormattedTime && endingTime < startingTime) {
    console.log(`ending time is invalid`);
    endingWrapper.classList.add("ending_wrapper_alignment");
    // endingTimeErrorElement.classList.remove("error_none");
    endingTimeErrorElement.style.display = "block";
    endingTimeErrorElement.textContent = `Selected ending time is invalid`;
    endingTimeErrorElement.classList.add("error_style");
    document.getElementById("ending_time_id").value = "";
  } else if (endingTime > startingTime) {
    endingTimeErrorElement.style.display = "none";
    endingWrapper.classList.remove("ending_wrapper_alignment");
    console.log(`ending time is valid`);
  }
}

//when all element value is empty
function everyInputFieldEmptyError(errorBooleanBalues) {
  // console.log(`all input field with empty value error`);
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    let adjacentErrorElement = element.nextElementSibling;
    displayError(adjacentErrorElement, element);
  });
}

/**
 * persistUserMeetingRoomDetails : function, after validation of 'startingTime','expiry' and 'endTimeValue'.
 * The function mentioned, will be creating an object for persisting into the local storage key name : 'upcoming_meetings'
 * The value used to structured the object will be passed onto the 'setUpcomingMeetings(upcomingMeetings)' : function.
 * for persisting into the local storage.
 * @param {*} startingTime
 * @param {*} expiry
 * @param {*} endTimeValue
 */
function persistUserMeetingRoomDetails(startingTime, expiry, endTimeValue) {
  console.log("persisting room details");
  const roomName = document.getElementById("rooms_id");
  const organizer = document.getElementById("organizer_id");
  const meetingName = document.getElementById("meeting_name_id");
  const checkbox = document.getElementById("anonymous_meeting_id");
  const isChecked = checkbox.checked;
  const value = isChecked ? true : false;
  // console.log(`return checkbox value : ${returnCheckboxValue}`);

  const upcomingMeetings = {
    roomName: roomName.value,
    meetingName: meetingName.value,
    organizer: organizer.value,
    checkbox: value,
    expiryDate: expiry,
    startingTime: startingTime,
    endingTime: endTimeValue,
  };

  //i can do my validation over here.

  //fetchMeetingDetails(upcomingMeetings);
  setUpcomingMeetings(upcomingMeetings);
}

/**
 * loggedInUserEmailId : function, returning logged in user email id.
 * @returns
 * Its a util function.
 */
function getLoggedInUserEmailId() {
  let emailId = localStorage.getItem("email");
  return emailId;
}

/**
 * setUpcomingMeetings : function, will set the local storage key named 'upcoming_meetings' to be persisted with the passed on
 * argument : which is the structured object data.
 * @param {*} upcomingMeetings
 */
function setUpcomingMeetings(upcomingMeetings) {
  let fetchedUpcomingMeetings = getUpcomingMeetings();
  if (!Array.isArray(fetchedUpcomingMeetings)) {
    fetchedUpcomingMeetings = []; //converting retrieved object back to array.
  }

  /*
    fetchedUpcomingMeetings.length : if length is 0, we will structure the object for the key 'upcoming_meetings'.
  */
  if (fetchedUpcomingMeetings.length === 0) {
    //this piece of code is to persist the meeting details.
    let meetingList = [];
    meetingList.push(upcomingMeetings);
    let emailValue = getLoggedInUserEmailId();
    const upcomingMeetingData = {
      email: emailValue,
      upcomingMeetingList: meetingList,
    };
    fetchedUpcomingMeetings.push(upcomingMeetingData);

    localStorage.setItem(
      "upcoming_meetings",
      JSON.stringify(fetchedUpcomingMeetings)
    );
  } else {
    /*
      Else, if the length is > 0, we will pass on the structured upcoming meeting passed as argument, for validation in 
      function : findUpcomingMeetingDetailsViaemail
    */
    findUpcomingMeetingDetailsViaemail(upcomingMeetings);
  }
}

/**
 * fetchUpcomingmeetingData : function used to persist the meeting list data into the local storage named : upcoming_meetings
 * Now, since the time will always be different then the current one we don't need to sort or fetch the unique meeting list
 * data.
 * The upcoming_meeting key, will be validated over in this function to check if it exist in the local storage. Which is
 * validated via the findIndex, function.
 * Using findIndex, we wil either update the key 'upcomingMeetingList'.
 * else,
 * we will be restructing the object of the
 * 'upcoming_meetings' with a fresh structure, with the key 'upcomingMeetingList' with the latest submitted form data.
 * Which is 'upcomingMeetings'.
 * Its a success.
 * @param {*} upcomingMeetings
 */
function findUpcomingMeetingDetailsViaemail(upcomingMeetings) {
  //problem is with the email id
  let emailId = getLoggedInUserEmailId();
  let fetchUpcomingmeetingData = getUpcomingMeetings();

  //here we are finding the index based on the email id.
  let meeting_fetched_data_index = fetchUpcomingmeetingData.findIndex(
    (data) => data.email === emailId
  );

  //find the upcoming meeting data so that we can re-initialise the upcoming_meeting list
  let meeting_fetched_data = fetchUpcomingmeetingData.find(
    (data) => data.email === emailId
  );

  let meetingData = [];

  //  !== -1, if the fetched object is found
  if (meeting_fetched_data_index !== -1) {
    /*
      The following iteration has been done to, push the existing upcoming meeting data to the array 'meetingData' first.
      Then,
      It will push the new upcoming meetings to the meetin data.
    */
    meeting_fetched_data.upcomingMeetingList.forEach((x) => {
      meetingData.push(x);
    });

    //new meeting data pushed with the existing one.
    meetingData.push(upcomingMeetings);
    fetchUpcomingmeetingData[meeting_fetched_data_index].upcomingMeetingList =
      meetingData;
    // window.location.href = "dashboard.htm";
  } else {
    //constructing upcoming meeting details again if email, or index we are looking for is not found.
    //the else section will restructure the upcoming_meetings key to initial one, where the user doesn't have any meeting list.
    meetingData.push(upcomingMeetings);

    //restructuring the object to initial phase, where the meeting data is pushed with the new upcoming meeting data.
    const upcomingMeetingData = {
      email: emailId,
      upcomingMeetingList: meetingData,
    };
    fetchUpcomingmeetingData.push(upcomingMeetingData);
  }

  //at the end re-setting the upcoming_meetings
  localStorage.setItem(
    "upcoming_meetings",
    JSON.stringify(fetchUpcomingmeetingData)
  );
  // window.location.href = "dashboard.htm";
}

/**
 * getUpcomingMeetings : function, used to fetch the upcoming_meetings details in the form of array.
 * @returns
 */
function getUpcomingMeetings() {
  let upcomingMeetings =
    JSON.parse(localStorage.getItem("upcoming_meetings")) || [];
  return upcomingMeetings;
}

function scheduleMeetingPageLogo() {
  const scheduleMeetingPageLogo = document.getElementById(
    "schedule_meeting_page_logo"
  );
  scheduleMeetingPageLogo.classList.add("schedule_logo_style");
  scheduleMeetingPageLogo.addEventListener("click", function () {
    window.location.href = "dashboard.htm";
  });
}

scheduleMeetingPageLogo();
bookNowBtnFunction();
setMeetingRoomName();
selectOrganiserfunction();
