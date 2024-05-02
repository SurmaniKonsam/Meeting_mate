import {
  getCurrentTime,
  setMeetingRoomName,
  selectOrganiserfunction,
  errorView,
  displayError,
  meetingNameValidation,
  meetingDateValidation,
  displayInvalidErrorTimeField,
  optionSelectionValidation,
} from "../utils/currentTimeUtil.js";

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

  let validatedFields = false;
  scheduleForm.onsubmit = function (event) {
    console.log("form submitted");
    event.preventDefault();
    checkErrors(checkingTargets, validatedFields);
  };
}

/**
 * checkErrors will check for the targets element value length, and will iteratively push the boolean value for every
 * alternative length of the element value === 0
 * @param {*} checkingTargets
 */
function checkErrors(checkingTargets, validatedFields) {
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
  validatedFields = true;
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

  allRequiredFieldInputValidation();
}

function allRequiredFieldInputValidation() {
  const meetingNameValidated = viewErrorElementsWithValue("meeting_name_id");
  const meetingDateValidated = viewErrorElementsWithValue("meeting_date_id");
  const startingTimeValidated = viewErrorElementsWithValue("starting_time_id");
  const endingTimeValidated = viewErrorElementsWithValue("ending_time_id");

  // Check if all fields are validated
  const allFieldsValidated =
    meetingNameValidated &&
    meetingDateValidated &&
    startingTimeValidated &&
    endingTimeValidated;

  if (allFieldsValidated) {
    // All fields are validated
    console.log("All fields are validated.");
  } else {
    // At least one field is not validated
    console.log("Validation failed for one or more fields.");
  }
}

/**
 * viewErrorElementsWithValue : function, please be mindful this function sole purpose is to only and only show the erros,
 * for input fields having value or not empty.
 * @param {*} elementId
 */
function viewErrorElementsWithValue(elementId) {
  let validatedAllfield = true;
  // console.log(`before all validation : ${validatedAllfield}`);
  switch (elementId) {
    //meeting name validation completed.
    case "rooms_id":
      optionSelectionValidation(elementId);
      break;
    case "organizer_id":
      organizerValidation(elementId);
      break;
    case "meeting_name_id":
      validatedAllfield = meetingNameValidation(elementId) && validatedAllfield;
      break;
    case "meeting_date_id":
      validatedAllfield = meetingDateValidation(elementId) && validatedAllfield;
      break;
    case "starting_time_id":
      validatedAllfield =
        startingTimeValidation(elementId) && validatedAllfield;
      break;
    case "ending_time_id":
      validatedAllfield =
        endingTimeIdValidation(elementId) && validatedAllfield;
      break;
    default:
      break;
  }
  return validatedAllfield;
}

function organizerValidation(elementId) {
  const organiserElementValue = document.getElementById(elementId).value;
  if (organiserElementValue === "") {
    return false;
  }
  return true;
}

/**
 * endingTimeIdValidation : function, endingTime validation.
 * this cannot be made util, since the ending time should be compared with the starting time.
 * endingTime should also be validated with starting time.
 * @param {*} elementId
 */
function endingTimeIdValidation(elementId) {
  let endingTimeElement = document.getElementById(elementId);
  let endingTimeErrorElement = endingTimeElement.nextElementSibling;
  let endingTimeValue = endingTimeElement.value;

  // Convert the current time to a string in HH:MM format
  let currentFormattedTime = getCurrentTime();

  //validate starting time
  if (endingTimeValue <= currentFormattedTime) {
    let errorMessage = `Ending time should be greater than current time`;
    // setValidateFalse();
    //this can be made util
    displayInvalidErrorTimeField(
      endingTimeErrorElement,
      endingTimeElement,
      errorMessage
    );
    return false;
  } else {
    //starting time value for comparison
    let startingTimeValue = document.getElementById("starting_time_id").value;
    endingTimeErrorElement.style.display = "none";

    //checking starting time value.
    if (startingTimeValue === "") {
      // setValidateFalse();
      return false;
    } else {
      return endingTimeComparisonWithEndingtime(
        startingTimeValue,
        endingTimeValue
      );
    }
  }
}

/**
 * endingTimeComparisonWithEndingtime : function, will do the comparison between the ending time greater than the
 * current time, with the starting time value.
 * If the value of the starting time is greater than the ending time, then the ending time shall make appear
 * the error message.
 * @param {*} startingTimeValue
 * @param {*} endingTime
 */
function endingTimeComparisonWithEndingtime(
  startingTimeValue,
  endingTimeValue
) {
  const endingTimeElement = document.getElementById("ending_time_id");

  //adjacent error element.
  const endingtimeErrorElement = endingTimeElement.nextElementSibling;

  if (endingTimeValue <= startingTimeValue) {
    let errorMessage = "Ending time should be greater than the starting time.";
    // setValidateFalse();
    displayInvalidErrorTimeField(
      endingtimeErrorElement,
      endingTimeElement,
      errorMessage
    );
    return false;
  } else {
    // setValidatedTrue();
    endingtimeErrorElement.style.display = "none";
    //now we can persist the data from here.
    return true;
  }
}

/**
 * startingTimeValidation : function, starting time validation.
 * starting time must also be validated with the ending time.
 * @param {*} elementId
 */
function startingTimeValidation(elementId) {
  let startingTimeElement = document.getElementById(elementId);
  let startingTimeErrorElement = startingTimeElement.nextElementSibling;
  let startingTimeValue = startingTimeElement.value;

  // Convert the current time to a string in HH:MM format
  let currentFormattedTime = getCurrentTime();

  //validate starting time
  if (startingTimeValue <= currentFormattedTime) {
    let errorMessage = "Starting time must be greater than current time";
    // setValidateFalse();
    displayInvalidErrorTimeField(
      startingTimeErrorElement,
      startingTimeElement,
      errorMessage
    );
    return false;
  } else {
    let endingTimeValue = document.getElementById("ending_time_id").value;
    //now same comparison of the starting time with the ending time value.

    if (endingTimeValue === "") {
      // setValidateFalse();
      startingTimeErrorElement.style.display = "none";
      return false;
    } else {
      return startingTimeComparisonWithEndingTime(
        endingTimeValue,
        startingTimeValue
      );
    }
  }
}

/**
 * startingTimeComparisonWithEndingTime : function, starting time validation with the ending time.
 * @param {*} endingTimeValue
 * @param {*} startingTimeValue
 */
function startingTimeComparisonWithEndingTime(
  endingTimeValue,
  startingTimeValue
) {
  const startingTimeElement = document.getElementById("starting_time_id");
  const startingTimeErrorElement = startingTimeElement.nextElementSibling;

  if (endingTimeValue <= startingTimeValue) {
    let errorMessage = "Starting time must be less than the ending time";
    // setValidateFalse();
    displayInvalidErrorTimeField(
      startingTimeErrorElement,
      startingTimeElement,
      errorMessage
    );
    return false;
  } else {
    startingTimeErrorElement.style.display = "none";
    // setValidatedTrue();
    //time to persist from here.
    return true;
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
  // setValidateFalse();
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

/**
 * scheduleMeetingPageLogo : function, clicking the logo of the page will redirect you to the dashboard page.
 */
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
selectOrganiserfunction();
setMeetingRoomName();
