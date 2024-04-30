// Get the current time
export function getCurrentTime() {
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

  return currentFormattedTime;
}

/**
 * returnUserData : function, returns all the user_data stored in the key 'user_details'
 * @returns
 */
export function returnUserData() {
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
export function selectOrganiserfunction() {
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
export function setMeetingRoomName() {
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
 * errorView : function, errorView is for viewing error when added event listener to the input fields
 * @param {*} element
 */
export function errorView(element) {
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
 * displayError : function, will be displayed for if all the error element is true.
 * @param {*} adjacentErrorElement
 * @param {*} element
 */
export function displayError(adjacentErrorElement, element) {
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
 * meetingNameValidation : function, input field : meeting_name_id validation.
 * @param {*} elementId
 */
export function meetingNameValidation(elementId) {
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
export function meetingDateValidation(elementId) {
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

