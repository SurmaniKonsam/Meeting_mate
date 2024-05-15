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
} from "../utils/scheduelMeetingUtil.js";

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

  scheduleForm.onsubmit = function (event) {
    console.log(`form submitted `);
    event.preventDefault();

    //need starting time and ending time validation here.
    showAlertAndDisableTime(
      startingTime,
      endTimeInput,
      meetingDate,
      checkingTargets
    );
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
    everyInputFieldEmptyError(errorBooleanBalues);
  }

  //some elements have error, means some element have true errorElements.
  selectingErrorDisplay(errorBooleanBalues);
}

//when some element's value is empty.
function selectingErrorDisplay(errorBooleanBalues) {
  errorBooleanBalues.forEach((x) => {
    const element = document.getElementById(x.elementId);
    const adjacentErrorElement = element.nextElementSibling;
    if (x.errorElement === true) {
      //for the element which have error or is empty.
      displayError(adjacentErrorElement, element);
    } else {
      //this block will repeat for everytime if the input fields have a value.
      adjacentErrorElement.classList.add("error_none");
      element.classList.remove("border_error");
      viewErrorElementsWithValue(x.elementId);
      //yhape persist krna.
    }
  });

  allRequiredFieldInputValidation();
}

/**
 * allRequiredFieldInputValidatio : function, will validated all the input fields.
 */
function allRequiredFieldInputValidation() {
  const roomNameValidated = viewErrorElementsWithValue("rooms_id");
  const organiserValidated = viewErrorElementsWithValue("organizer_id");
  const meetingNameValidated = viewErrorElementsWithValue("meeting_name_id");
  const meetingDateValidated = viewErrorElementsWithValue("meeting_date_id");
  const startingTimeValidated = viewErrorElementsWithValue("starting_time_id");
  const endingTimeValidated = viewErrorElementsWithValue("ending_time_id");

  // Check if all fields are validated
  const allFieldsValidated =
    roomNameValidated &&
    organiserValidated &&
    meetingNameValidated &&
    meetingDateValidated &&
    startingTimeValidated &&
    endingTimeValidated;

  if (allFieldsValidated) {
    // All fields are validated
    console.log("All fields are validated.");

    //time for persistance.
    validateAndPersistMeetingData();
  } else {
    // At least one field is not validated
    console.log("Validation failed for one or more fields.");
  }
}

/**
 * checkLoggedInUserForUpcomingMeetingList : function, will check if the upcoming_meeting list local storage
 * contains the logged in user or not.
 * If not, it will update the "upcoming_meetings" key, with the new updated object containing the new loggedInuser
 * with the empty upcomingMeetingList : []
 * const newUserUpcomingMeetings = {
 *    email: loggedInUser,
 *    upcomingMeetingList: [],
 *  };
 */
function checkLoggedInUserForUpcomingMeetingList() {
  let loggedInUser = getLoggedInUserEmailId();
  let upcomingMeetings = getUpcomingMeetings();
  let updatedUpcomingMeetings = [];
  upcomingMeetings.forEach((data) => {
    updatedUpcomingMeetings.push(data);
  });
  let index_found_via_date = upcomingMeetings.findIndex(
    (data) => data.email === loggedInUser
  );
  if (index_found_via_date < 0) {
    const newUserUpcomingMeetings = {
      email: loggedInUser,
      upcomingMeetingList: [],
    };
    updatedUpcomingMeetings.push(newUserUpcomingMeetings);
    localStorage.setItem(
      "upcoming_meetings",
      JSON.stringify(updatedUpcomingMeetings)
    );
  }
}

/**
 * validateAndPersistMeetingData : function, will check for if the meeting data is already booked for the current date
 * or not.
 */
function validateAndPersistMeetingData() {
  const roomName = document.getElementById("rooms_id").value;
  const organizer = document.getElementById("organizer_id").value;
  const meetingName = document.getElementById("meeting_name_id").value;
  const meetingDate = document.getElementById("meeting_date_id").value;
  const startingTime = document.getElementById("starting_time_id").value;
  const endingTime = document.getElementById("ending_time_id").value;
  const checkbox = document.getElementById("anonymous_meeting_id");
  const isChecked = checkbox.checked;
  const checkboxValue = isChecked ? true : false;

  const upcomingMeetingsListData = {
    roomName: roomName,
    meetingName: meetingName,
    organizer: organizer,
    checkbox: checkboxValue,
    expiryDate: meetingDate,
    startingTime: startingTime,
    endingTime: endingTime,
  };

  const bookedSlotsData = {
    roomName: roomName,
    startingTime: startingTime,
    endingTime: endingTime,
  };

  /**
   * retrieving the upcoming meeting list
   */
  let fetchedUpcomingMeetings = getUpcomingMeetings();
  if (!Array.isArray(fetchedUpcomingMeetings)) {
    fetchedUpcomingMeetings = []; //converting retrieved object back to array.
  }

  /**
   * retrieving time slots in array format
   */
  let fetchTimeSlots = getTimeslots();
  if (!Array.isArray(fetchTimeSlots)) {
    fetchTimeSlots = [];
  }

  /*
    First look for if we have any meeting data in the local storage.
  */
  if (fetchedUpcomingMeetings.length === 0 && fetchTimeSlots.length === 0) {
    //if its so, now time to persist the data in the local storage.
    let meetingList = [];
    meetingList.push(upcomingMeetingsListData);
    let emailValue = getLoggedInUserEmailId();
    const upcomingMeetingData = {
      email: emailValue,
      upcomingMeetingList: meetingList,
    };
    fetchedUpcomingMeetings.push(upcomingMeetingData);

    /**
     * meetingSlotsData ; constructing data for the meeting slots object.
     */

    /**
     * persisting the meeting room data to the bookedSlots.
     * Since, for a specific date we can have many booked time slots. Hence, it should be of type array.
     */
    let bookedSlots = [];
    bookedSlots.push(bookedSlotsData);
    const meetingSlotsData = {
      date: meetingDate,
      bookedTimeSlots: bookedSlots,
    };
    fetchTimeSlots.push(meetingSlotsData);

    /**
     * set "time_slots"
     */
    localStorage.setItem("time_slots", JSON.stringify(fetchTimeSlots));

    /**
     * set "upcoming_meetings"
     */
    localStorage.setItem(
      "upcoming_meetings",
      JSON.stringify(fetchedUpcomingMeetings)
    );

    //we need to set for the time slots here to.
  } else {
    let getTimeSlots = getTimeslots();

    /**
     * we are finding the index based on the 'date' for the key 'time_slots'
     */
    let index_found_via_date = getTimeSlots.findIndex(
      (data) => data.date === meetingDate
    );

    let loggedInUser = getLoggedInUserEmailId();
    /**
     * we will find the index for the ls key 'upcoming_meetings' using the logged in email id.
     */
    let upcomingMeetings = getUpcomingMeetings();
    let upcoming_meeting_index_via_email = upcomingMeetings.findIndex(
      (data) => data.email === loggedInUser
    );

    /*
      if the fetched index is not negative: it states that we have found our key with the meeting date
      similar to the selected date.
      That is if the meeting date is found.
      Means, the index to persist the new meeting data to the existing data is found.
    */
    if (index_found_via_date !== -1) {
      /**
       * finding the object having the same meeting date via the 'meetingDate'
       * This object fetched selectively out of the meeting date have 'bookedTimeSlots'.
       * Which we will use for iteration and comparisons.
       */
      let time_slots_fetched_data_for_the_selected_date = getTimeSlots.find(
        (data) => data.date === meetingDate
      );

      /**
       * find the upcoming meeting data based on the logged in user email id.
       * We will then fetch the upcoming meetings from the fetched data, and then update our data accordingly.
       */
      let upcoming_meeting_data = upcomingMeetings.find(
        (data) => data.email === loggedInUser
      );

      /**
       * this piece of code, is used to update the upcoming_meeting_list array with the existing meeting data.
       * So that, the new upcoming meeting data can get pushed to the existing ones.
       */
      let upcoming_meeting_list = [];
      upcoming_meeting_data.upcomingMeetingList.forEach((meeting) => {
        upcoming_meeting_list.push(meeting);
      });

      /**
       * this piece of code will be validated only for if the selected time slots matches exactly as that of the
       * time slots available in the local storage, for the selected date booked slots.
       * If the meeting room name matches in the selected date booked slots,
       * it will give you the index on which the meeting room name was matched in the selected date booked.
       * If the index of the same meeting room name is found, then via that index we can alert the user that
       * the meeting room is not available.
       * Else,
       * it will return you '0'/
       */
      let returnRoomAvailability = roomAvailablity(
        time_slots_fetched_data_for_the_selected_date.bookedTimeSlots,
        roomName,
        startingTime,
        endingTime
      );

      let bookedSlots = [];
      /**
       * repopulating the booked slots with an empty booked slots, so that it can get populated with a new data
       * to an existing one.
       */
      time_slots_fetched_data_for_the_selected_date.bookedTimeSlots.forEach(
        (x) => {
          bookedSlots.push(x);
        }
      );

      /**
       * returntimeIndex : will be either '0' or 'index' on which the roomName is found.
       * is used to indicate so that the return time index is always true
       */
      if (returnRoomAvailability) {
        alert(`Meeting room available`);

        /**
         * This code will return the update time slots of type 'Array' from the addTimeSlots
         */
        let updatedBookedSlots = addTimeSlots(
          time_slots_fetched_data_for_the_selected_date.bookedTimeSlots,
          startingTime,
          endingTime,
          bookedSlotsData,
          bookedSlots,
          upcoming_meeting_list,
          upcomingMeetings,
          upcoming_meeting_index_via_email,
          upcomingMeetingsListData
        );

        //here bookedSlots is being returned and assigned to the indexfoundViaDate index.
        fetchTimeSlots[index_found_via_date].bookedTimeSlots =
          updatedBookedSlots;

        localStorage.setItem("time_slots", JSON.stringify(fetchTimeSlots));
      } else {
        alert(`Meeting room not available`);
        const scheduleForm = document.getElementById("login_form_id");
        // scheduleForm.reset();
      }
    } else {
      //if the meeting date is not found.
      //we will push new date to the time slots.
      alert("New meeting date detected!!!");
      let timeSlots = getTimeslots();
      let resetTimeSlots = [];
      timeSlots.forEach((x) => {
        resetTimeSlots.push(x);
      });

      let bookedSlots = [];
      bookedSlots.push(bookedSlotsData);

      const newTimeSlots = {
        date: meetingDate,
        bookedTimeSlots: bookedSlots,
      };

      resetTimeSlots.push(newTimeSlots);
      localStorage.setItem("time_slots", JSON.stringify(resetTimeSlots));

      console.log(
        `upcoming meeting index via email : ${upcoming_meeting_index_via_email}`
      );

      //repopulate the upcoming meeting keys again.
      let updatedMeetingList = [];

      let upcoming_meeting_data = upcomingMeetings.find(
        (data) => data.email === loggedInUser
      );

      upcoming_meeting_data.upcomingMeetingList.forEach((meeting) => {
        updatedMeetingList.push(meeting);
      });

      updatedMeetingList.push(upcomingMeetingsListData);

      upcomingMeetings[upcoming_meeting_index_via_email].upcomingMeetingList =
        updatedMeetingList;

      localStorage.setItem(
        "upcoming_meetings",
        JSON.stringify(upcomingMeetings)
      );
    }
  }
}

/**
 * addTimeSlots : function, will validate the order of the time slots thus added.
 * It will sort the time slots thus added both in the local storage key 'time_slots' and 'upcoming_meetings'.
 * @param {*} bookedTimeSlots
 * @param {*} startingTime
 * @param {*} endingTime
 * @param {*} bookedSlotsData
 * @param {*} bookedSlots
 * @param {*} upcoming_meeting_list
 * @param {*} upcomingMeetings
 * @param {*} upcoming_meeting_index_via_email
 * @param {*} upcomingMeetingsListData
 * @returns
 */
function addTimeSlots(
  bookedTimeSlots,
  startingTime,
  endingTime,
  bookedSlotsData,
  bookedSlots,
  upcoming_meeting_list,
  upcomingMeetings,
  upcoming_meeting_index_via_email,
  upcomingMeetingsListData
) {
  let inserted = false;
  for (let i = 0; i < bookedTimeSlots.length; i++) {
    if (endingTime < bookedTimeSlots[i].startingTime) {
      bookedSlots.splice(i, 0, bookedSlotsData);
      upcoming_meeting_list.push(upcomingMeetingsListData);
      inserted = true;
      break;
    } else if (
      startingTime === bookedTimeSlots[i].startingTime &&
      endingTime === bookedTimeSlots[i].endingTime
    ) {
      upcoming_meeting_list.push(upcomingMeetingsListData);
      bookedSlots.splice(i + 1, 0, bookedSlotsData);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    upcoming_meeting_list.push(upcomingMeetingsListData);
    bookedSlots.push(bookedSlotsData); // Insert at the end if not inserted earlier
  }

  //this can be removed if the code doesn't work.
  upcomingMeetings[upcoming_meeting_index_via_email].upcomingMeetingList =
    upcoming_meeting_list;

  /**
   * This piece of code could also be removed.
   * Setting the local storage "upcoming_meetings" again.
   */
  localStorage.setItem("upcoming_meetings", JSON.stringify(upcomingMeetings));
  return bookedSlots;
}

/**
 * returnFoundIndex : will find the index via validating starting time and ending time.
 * From here, if not meeting room with the selected time slots is found, then it will return 0.
 * Which will then be used in the if condition to check if the room name is available or not.
 * Since, the return value if meeting room name not available will always be 0.
 * The validation will pass for the meeting room excluding the meeting room available in the first index
 * Conclusion : time slots collision.
 * @param {*} bookedTimeSlots
 */
function roomAvailablity(bookedTimeSlots, roomName, startingTime, endingTime) {
  for (let i = 0; i < bookedTimeSlots.length; i++) {
    //we need to first check whether the starting time and ending time slots are available.
    if (
      bookedTimeSlots[i].startingTime === startingTime &&
      bookedTimeSlots[i].endingTime === endingTime
    ) {
      if (bookedTimeSlots[i].roomName === roomName) {
        console.log(`room with same name found!!!`);
        //room with same name found return true.
        return false;
      }
    } else if (
      (startingTime === bookedTimeSlots[i].startingTime &&
        endingTime < bookedTimeSlots[i].endingTime) ||
      (startingTime === bookedTimeSlots[i].startingTime &&
        endingTime > bookedTimeSlots[i].endingTime) ||
      (endingTime === bookedTimeSlots[i].endingTime &&
        startingTime > bookedTimeSlots[i].startingTime) ||
      (endingTime === bookedTimeSlots[i].endingTime &&
        startingTime < bookedTimeSlots[i].startingTime) ||
      (startingTime > bookedTimeSlots[i].startingTime &&
        endingTime < bookedTimeSlots[i].endingTime) ||
      (startingTime < bookedTimeSlots[i].startingTime &&
        endingTime > bookedTimeSlots[i].startingTime &&
        endingTime < bookedTimeSlots[i].endingTime) ||
      (endingTime > bookedTimeSlots[i].endingTime &&
        startingTime > bookedTimeSlots[i].startingTime &&
        startingTime < bookedTimeSlots[i].endingTime)
    ) {
      alert("selected time slot collides!!!");
      return false;
    }
    /**
     * if for the collision false is returned from here, i don't have to validate in the addTimeSlots anymore.
     */
  }
  return true;
}

/**
 * getTimeslots : function, wil return the upcoming time slots for which the user has persisted the meetings as per the
 * selected date.
 * the object thus persisted in the time_slots will be as:
 * {
 *    date : date,
 *    upcoming_meetings : []
 *    //where the object inside the upcoming meetings will be as :
 *     {
 *        room_name : room_name,
 *        starting_time : starting_time,
 *        ending_time : ending_time
 *      }
 * }
 * 'date' key : will be of two type:
 * A current date.
 * A future date.
 * A current date : a current date, will take up the time slots in which the starting and the ending time have been compared
 * with the current time.
 * A future date : a future date, there will be no comparison with the current time, the only comparison will be made between
 * the starting time and the ending time.
 * @returns
 */
function getTimeslots() {
  let timeSlots = JSON.parse(localStorage.getItem("time_slots")) || [];
  return timeSlots;
}

/**
 * viewErrorElementsWithValue : function, please be mindful this function sole purpose is to only and only show the erros,
 * for input fields having value or not empty.
 * @param {*} elementId
 */
function viewErrorElementsWithValue(elementId) {
  // console.log(`validating all fields with value.`);
  let validatedAllfield = true;
  // console.log(`before all validation : ${validatedAllfield}`);
  switch (elementId) {
    //meeting name validation completed.
    case "rooms_id":
      validatedAllfield = optionSelectionValidation(elementId);
      break;
    case "organizer_id":
      validatedAllfield = optionSelectionValidation(elementId);
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

/**
 * endingTimeIdValidation : function, endingTime validation.
 * this cannot be made util, since the ending time should be compared with the starting time.
 * endingTime should also be validated with starting time.
 * @param {*} elementId
 */
function endingTimeIdValidation(elementId) {
  let endingTimeElement = document.getElementById(elementId);

  let selectedDate = document.getElementById("meeting_date_id").value;

  //current date value.
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let currentDateValueInhrs = currentDate.getTime();

  //selected date value.
  const selectedDateValue = new Date(selectedDate);
  selectedDateValue.setHours(0, 0, 0, 0);
  let selectedDateValueTimeinHrs = selectedDateValue.getTime();

  //if the current date is equal to the selected date, then the current time validation should be done.
  if (selectedDateValueTimeinHrs === currentDateValueInhrs) {
    return endtimeValidationIfSelectedDateIsEqualToTheCurrentDate(
      endingTimeElement
    );
  } else if (selectedDateValueTimeinHrs > currentDateValueInhrs) {
    return endtimeValidationIfSelectedDateIsGreaterThanTheCurrentDate(
      endingTimeElement
    );
  }
}

/**
 * endtimeValidationIfSelectedDateIsGreaterThanTheCurrentDate : function, this will validate the ending time with the
 * starting time.
 * If all the fields are validated properly then it will return true,
 * else for every failed validation we will have returned false.
 * @param {*} endingTimeElement
 * @returns
 */
function endtimeValidationIfSelectedDateIsGreaterThanTheCurrentDate(
  endingTimeElement
) {
  let startingTimeElement = document.getElementById("starting_time_id");
  let startingTimeErrorElement = startingTimeElement.nextElementSibling;
  let startingTimeValue = startingTimeElement.value;

  /**
   * ending time elements/ending time error element.
   */
  let endingTimeValue = endingTimeElement.value;
  let endingTimeErrorElement = endingTimeElement.nextElementSibling;
  if (endingTimeValue === "") {
    let errorMessage = "Ending time is empty !!!";
    displayInvalidErrorTimeField(
      endingTimeErrorElement,
      endingTimeElement,
      errorMessage
    );
    return false;
  } else {
    endingTimeErrorElement.style.display = "none";
    if (startingTimeValue === "") {
      let errorMessage = "Starting time is empty !!!";
      displayInvalidErrorTimeField(
        startingTimeErrorElement,
        startingTimeElement,
        errorMessage
      );
      return false;
    } else {
      startingTimeErrorElement.style.display = "none";
      if (endingTimeValue < startingTimeValue) {
        let errorMessage = "Ending time should be greater than the ending time";
        displayInvalidErrorTimeField(
          endingTimeErrorElement,
          endingTimeElement,
          errorMessage
        );
        return false;
      } else {
        startingTimeErrorElement.style.display = "none";
        endingTimeErrorElement.style.display = "none";
        return true;
      }
    }
  }
}

/**
 * endtimeValidationIfSelectedDateIsEqualToTheCurrentDate : function, if the selected date is equal to the current date
 * the validation for the ending time value with the current time and the starting time will be done here.
 * @param {*} endingTimeElement
 * @returns
 */
function endtimeValidationIfSelectedDateIsEqualToTheCurrentDate(
  endingTimeElement
) {
  let startingTimeValue = document.getElementById("starting_time_id").value;
  let endingTimeErrorElement = endingTimeElement.nextElementSibling;
  let endingTimeValue = endingTimeElement.value;
  let currentFormattedTime = getCurrentTime();

  if (
    endingTimeValue >= currentFormattedTime &&
    endingTimeValue > startingTimeValue
  ) {
    endingTimeErrorElement.style.display = "none";
    return true;
    /**
     * step by step
     * first : the ending time needs to be greater than the current time
     * if so, then the ending time needs to be greater than the starting time value.
     */
  } else if (endingTimeValue < currentFormattedTime) {
    let errorMessage = "Ending time should be greater than current time";
    displayInvalidErrorTimeField(
      endingTimeErrorElement,
      endingTimeElement,
      errorMessage
    );
    return false;
  }
}

/**
 * startingTimeValidation : function, starting time validation.
 * starting time must also be validated with the ending time.
 * startingTim
 * @param {*} elementId
 */
function startingTimeValidation(elementId) {
  /**
   * In this block we will only validate for selected date which is greater than or equal to the current date.
   */
  let startingTimeElement = document.getElementById(elementId);
  let selectedDate = document.getElementById("meeting_date_id").value;

  //current date value.
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let currentDateValueInhrs = currentDate.getTime();

  //selected date value.
  const selectedDateValue = new Date(selectedDate);
  selectedDateValue.setHours(0, 0, 0, 0);
  let selectedDateValueTimeinHrs = selectedDateValue.getTime();

  //current time
  let currentFormattedTime = getCurrentTime();

  //if the current date is equal to the selected date, then the current time validation should be done.
  if (selectedDateValueTimeinHrs === currentDateValueInhrs) {
    return timeValidationIfSelectedDateIsEqualtoCurrentDate(
      currentFormattedTime,
      startingTimeElement
    );
  } else if (selectedDateValueTimeinHrs > currentDateValueInhrs) {
    return timeValidationIfTheSelectedDateIsGreaterThanTheCurrentDate(
      startingTimeElement
    );
  }
}

/**
 * timeValidationIfTheSelectedDateIsGreaterThanTheCurrentDate : function, will validate for the starting time
 * when the selected date is greater than the current date.
 * @param {*} startingTimeElement
 * @returns
 */
function timeValidationIfTheSelectedDateIsGreaterThanTheCurrentDate(
  startingTimeElement
) {
  let startingTimeValue = startingTimeElement.value;
  let startingTimeErrorElement = startingTimeElement.nextElementSibling;
  if (startingTimeValue === "") {
    let errorMessage = "Starting time is empty!!!";
    displayInvalidErrorTimeField(
      startingTimeErrorElement,
      startingTimeElement,
      errorMessage
    );
    return false;
  } else {
    /**
     * starting value is not empty, now we need to check only with the ending time value.
     */
    startingTimeErrorElement.style.display = "none";
    let endingTimeElement = document.getElementById("ending_time_id");
    let endingTimeValue = endingTimeElement.value;
    let endingTimeErrorElement = endingTimeElement.nextElementSibling;
    if (endingTimeValue === "") {
      let errorMessage = "Ending element is empty !!!";
      displayInvalidErrorTimeField(
        endingTimeErrorElement,
        endingTimeElement,
        errorMessage
      );
      return false;
    } else {
      if (endingTimeValue > startingTimeValue) {
        return true;
      } else {
        return false;
      }
    }
  }
}

/**
 * timeValidationIfSelectedDateIsEqualtoCurrentDate : function, if the selected date is equal to the current date, then
 * the validation for the selected time will be done with the current time.
 * It means, the selected time should be either equal to or greater than the current time, if the selected date
 * is equal to the current date.
 * @param {*} currentFormattedTime
 * @param {*} startingTimeElement
 * @returns
 */
function timeValidationIfSelectedDateIsEqualtoCurrentDate(
  currentFormattedTime,
  startingTimeElement
) {
  let startingTimeErrorElement = startingTimeElement.nextElementSibling;
  let startingTimeValue = startingTimeElement.value;

  //starting time value if less than the current formatted time.
  if (startingTimeValue < currentFormattedTime) {
    let errorMessage = "Starting time should be greater than current time";
    displayInvalidErrorTimeField(
      startingTimeErrorElement,
      startingTimeElement,
      errorMessage
    );
    return false;
  } else {
    //starting time is greater than the current formated time, needs to be now compared with the ending time.
    let endingTimeValue = document.getElementById("ending_time_id").value;
    //now same comparison of the starting time with the ending time value.

    if (endingTimeValue === "") {
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

//to show alert if the date is not selected.
function showAlertAndDisableTime(
  startingTime,
  endTimeInput,
  meetingDate,
  checkingTargets
) {
  try {
    if (meetingDate.value === "") {
      alert("meeting date value is empty");
      emptyTimeInputs(startingTime, endTimeInput);
      checkErrors(checkingTargets);
    } else {
      //else if the meeting date is not empty.
      const currentDate = new Date();
      const selectedDate = new Date(meetingDate.value);

      const currentDateStr = currentDate.toISOString().split("T")[0];
      const selectedDateStr = selectedDate.toISOString().split("T")[0];

      // console.log(`comparing : ${currentDateStr > selectedDateStr}`);

      if (selectedDateStr < currentDateStr) {
        emptyTimeInputs(startingTime, endTimeInput);
        checkErrors(checkingTargets);
      } else {
        /**
         * first : for the date equal to the current date
         * second : for the date greater than the current date.
         */
        console.log("date OK needs validation!!!");
        checkErrors(checkingTargets);
      }
    }
  } catch (e) {
    console.log(`error : ${e.errorMessage}`);
  }
}

/**
 * disableTimeInputs : functiion, will disable the time input if the selected date is less than the current date.
 * @param {*} startingTime
 * @param {*} endTimeInput
 */
function emptyTimeInputs(startingTime, endTimeInput) {
  startingTime.value = "";
  endTimeInput.value = "";
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
 * loggedInUserEmailId : function, returning logged in user email id.
 * @returns
 * Its a util function.
 */
function getLoggedInUserEmailId() {
  let emailId = localStorage.getItem("email");
  return emailId;
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
checkLoggedInUserForUpcomingMeetingList();
