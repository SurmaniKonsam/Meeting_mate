// import { displayErrorMessage } from "./loginFunction.js";

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
 * getParameterByName : function, was not imported due to some unknown error.
 * @param {*} name
 * @param {*} url
 * @returns
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
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
    // meeting_name_error.classList.add("display_error");
    console.log("value is empty");
    adjacentSibling.classList.add("error_style");
    adjacentSibling.classList.remove("error_none");
    element.classList.add("border_error");
  } else {
    adjacentSibling.classList.add("error_none");
    element.classList.remove("border_error");
  }
}

// function roomNameErrorView(roomName){

// }
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
  const checkbox = document.getElementById("anonymous_meeting_id");
  const endTimeInput = document.getElementById("ending_time_id");

  meetingName.addEventListener("input", function (event) {
    errorView(meetingName);
  });

  roomName.addEventListener("change", function (event) {
    errorView(roomName);
  });

  organizer.addEventListener("change", function (event) {
    errorView(organizer);
  });

  meetingDate.addEventListener("change", function (event) {
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

  scheduleForm.onsubmit = function (event) {
    event.preventDefault();
    const expiry = meetingDate.value;
    checkErrors(checkingTargets);
    // checkDateFunction(expiry, startingTime);
  };
}

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
  displayErrorMessage(errorBooleanBalues);
}

function displayErrorMessage(errorBooleanBalues) {
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
    console.log("no errors");
    //we need to persist our data here.
    noEmptyValuesFunction();
  }

  //all inputs have error
  if (allInputHaveError) {
    console.log("all inputs have error ");
    displayAllelementError(errorBooleanBalues);
  }

  //some elements have error.
  selectingErrorDisplay(errorBooleanBalues);
}

//when some element's value is empty
function selectingErrorDisplay(errorBooleanBalues) {
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    const adjacentErrorElement = element.nextElementSibling;
    if (x.errorElement === true) {
      displayError(adjacentErrorElement, element);
    } else {
      adjacentErrorElement.classList.add("error_none");
      element.classList.remove("border_error");
    }
  });
}

//when all element value is empty
function displayAllelementError(errorBooleanBalues) {
  console.log(`inside display all element error`);
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    let adjacentErrorElement = element.nextElementSibling;
    displayError(adjacentErrorElement, element);
  });
}

/**
 * noErrorsFunction : function, where if no value is empty. we will be validating again
 * especially date, starting time and ending time
 * @param {*} errorBooleanBalues
 */
function noEmptyValuesFunction() {
  console.log("inside no empty values functio");
  const meetingDate = document.getElementById("meeting_date_id");
  const startingTime = document.getElementById("starting_time_id");
  checkDateFunction(meetingDate, startingTime);
  //here three main validation needs to be done :
  /**
   * date
   * starting time
   * ending time
   */
}

// function borderError(element) {
//   element.classList.add("border_error");
// }

function displayError(adjacentErrorElement, element) {
  adjacentErrorElement.classList.remove("error_none");
  adjacentErrorElement.classList.add("display_error");
  adjacentErrorElement.classList.add("error_style");
  element.classList.add("border_error");
}

function roomDetails(expiry, startingTime) {
  try {
    let startingTimeValue = startingTime.value;
    //one validation required here.
    validateStartingTime(startingTimeValue, expiry);
  } catch (e) {
    console.log(`error : ${e}`);
  }
}

/**
 * validateStartingTime : function, will validate the starting value will the current time.
 * @param {*} startingTime
 */
function validateStartingTime(startingTime, expiry) {
  // Get the current time
  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  // Convert the current time to a string in HH:MM format
  var currentFormattedTime =
    (currentHours < 10 ? "0" : "") +
    currentHours +
    ":" +
    (currentMinutes < 10 ? "0" : "") +
    currentMinutes;

  console.log(`currentFormattedTime : ${currentFormattedTime}`);
  // Compare the input time with the current time
  if (startingTime <= currentFormattedTime) {
    document.getElementById("starting_time_id").value = "";
    // Clear the input field if the entered time is invalid
  } else {
    console.log(`you have entered valid current time : ${startingTime}`);
    validateEndTime(startingTime, expiry);
  }
}

/**
 * validateEndTime : function, will validate the ending time with the current time and the starting time input value
 * @param {*} startingTime
 */
function validateEndTime(startingTime, expiry) {
  const endTimeInput = document.getElementById("ending_time_id");
  const endTimeValue = endTimeInput.value;

  // Get the current time
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Format the current time as HH:MM
  const currentFormattedTime = `${
    currentHours < 10 ? "0" : ""
  }${currentHours}:${currentMinutes < 10 ? "0" : ""}${currentMinutes}`;

  // Compare the ending time with the starting time and the current time
  if (endTimeValue <= startingTime || endTimeValue <= currentFormattedTime) {
    console.log(
      `Ending time : ${endTimeValue} must be greater than the starting time and the current time.`
    );
    endTimeInput.value = ""; // Clear the input field if the entered time is invalid
  } else {
    console.log(`before persisting value`);
    persistUserMeetingRoomDetails(startingTime, expiry, endTimeValue);
  }
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
  const roomName = document.getElementById("rooms_id");
  const organizer = document.getElementById("organizer_id");
  const meetingName = document.getElementById("meeting_name_id");
  const checkbox = document.getElementById("anonymous_meeting_id");
  console.log(`room name : ${roomName.value}`);
  const upcomingMeetings = {
    roomName: roomName.value,
    meetingName: meetingName.value,
    organizer: organizer.value,
    checkbox: checkbox.value,
    expiryDate: expiry,
    startingTime: startingTime,
    endingTime: endTimeValue,
  };

  //i can do my validation over here.

  //fetchMeetingDetails(upcomingMeetings);
  setUpcomingMeetings(upcomingMeetings);
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
    let emailValue = getParameterByName("email");
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
  let emailId = getParameterByName("email");
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
    // window.location.href = "dashboard.htm";
  }

  //at the end re-setting the upcoming_meetings
  localStorage.setItem(
    "upcoming_meetings",
    JSON.stringify(fetchUpcomingmeetingData)
  );
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
 * checkDateFunction : function, will validate the date with the current date defined 'currentDate'.
 * If, passed the validation it will be redirected to the roomDetails function, where we will validate
 * the entire 'upcoming_meetings' key structure.
 * @param {*} expiry
 * @param {*} startingTime
 */
function checkDateFunction(meetingDate, startingTime) {
  // if empty string expiry this if condition will be implemented
  let dateErrorElement = document.getElementById(
    meetingDate.nextElementSibling.id
  );
  let expiry = meetingDate.value;
  const expiryDate = new Date(expiry);
  const currentDate = new Date();

  if (expiryDate < currentDate) {
    dateErrorElement.style.display = "block";
    dateErrorElement.textContent = `expiry date is not 2134 valid`;
  } else {
    dateErrorElement.style.display = "none";
    roomDetails(expiry, startingTime);
  }
}

bookNowBtnFunction();
setMeetingRoomName();
selectOrganiserfunction();
