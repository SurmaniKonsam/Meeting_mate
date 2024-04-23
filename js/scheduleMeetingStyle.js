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

selectOrganiserfunction();
