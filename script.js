//***** Selecting the DOM *****//
const reviewInput = document.querySelector("#user-review");
const usernameInput = document.querySelector("#username");
const reviewsContainer = document.querySelector("#reviews");
const formElement = document.querySelector("#form");
const starElements = document.querySelectorAll("#star");
const submitBtn = document.querySelectorAll("#btn-submit");

// toggle buttons holder
const filterBtnHolder = document.querySelector("#filter-holders");
const sortBtnHolder = document.querySelector("#sort-holders");

//toggle buttons
const filterBtn = document.querySelector("#btn-filter");
const sortBtn = document.querySelector("#btn-sort");
const defaultBtn = document.querySelector("#btn-default");

//filters buttons
const goodReviewsBtn = document.querySelector("#good");
const badReviewsBtn = document.querySelector("#bad");
const namedReviewsBtn = document.querySelector("#named");
const anonymousReviewsBtn = document.querySelector("#anonymous");
const likedReviewsBtn = document.querySelector("#liked");

//sort buttons
const goodFirstReviewBtn = document.querySelector("#good-bad");
const badFirstReviewBtn = document.querySelector("#bad-good");
const oldestFirstReviewBtn = document.querySelector("#oldest-newest");
const newestFirstReviewBtn = document.querySelector("#newest-oldest");

//***** Initiating the variables *****/
const reviews = [];
let starRating = 0;
let isUpdating = false;
let toUpdateReview = {};
let updateReviewIndex = 0;
let showFilter = false;
let showSort = false;

// ***** Funtions *****//
function onSubmit(e, username, review, starRate) {
  e.preventDefault();
  if (!review || !starRate) {
    return alert("Review field is required");
  }
  if (!username) {
    username = "anonymous";
  }
  const reviewObj = {
    username,
    review,
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    starRate,
  };

  if (isUpdating) {
    reviews.splice(updateReviewIndex, 1, reviewObj);
    isUpdating = false;
    toUpdateReview = {};
    updateReviewIndex = 0;
  } else {
    reviews.unshift(reviewObj);
  }
  colorSelectedStars(0);
  reviewInput.value = "";
  usernameInput.value = "";
  starElements.forEach((element) => (element.style.color = "gray"));
  starRating = 0;
  renderReviews(reviews);
}

//to take the user rating
function takeStarRating(number) {
  starRating = number;
}

//to activate the color on the star when hover
function colorStarOnHover(number) {
  for (let i = 0; i <= number; i++) {
    starElements[i].style.color = "yellow";
  }
}

//color all the star till the selected star rating
function colorSelectedStars(number) {
  starRating = number;
  starElements.forEach((element, index) => {
    if (index < number) {
      element.style.color = "yellow";
    } else {
      element.style.color = "gray";
    }
  });
}

// to cancel the color on star when mouse goes out
function colorStarOnMouseOut(number) {
  for (let i = 0; i <= number; i++) {
    if (i >= starRating) {
      starElements[i].style.color = "gray";
    }
    if (starRating === 0) {
      starElements[0].style.color = "gray";
    }
  }
}

//to render the reviews on browser
function renderReviews(data) {
  //clearing the existing element
  if (reviewsContainer.children) {
    const removeElement = document.querySelectorAll("#review-holder");
    for (let i = 0; i < removeElement.length; i++) {
      removeElement[i].remove();
    }
  }

  //looping to the reviews to render each review
  data.map((element, index) => {
    //creating a DOM element
    const reviewHolder = document.createElement("div");
    const titleAndButtonHolder = document.createElement("div");
    const headingElement = document.createElement("h3");
    const buttonHolder = document.createElement("div");
    const editImg = document.createElement("img");
    const editButton = document.createElement("button");
    const deleteImg = document.createElement("img");
    const deleteButton = document.createElement("button");
    const starPara = document.createElement("p");
    const ParaAndTimeHolder = document.createElement("div");
    const reviewPara = document.createElement("p");
    const timeSpan = document.createElement("span");

    //setting id attribute to give style
    reviewHolder.id = "review-holder";
    titleAndButtonHolder.id = "title-btn-holder";
    buttonHolder.id = "btn-holders";
    editImg.src = "/assets/icon/edit.svg";
    editButton.id = "btn-edit";
    deleteImg.src = "/assets/icon/delete.svg";
    deleteButton.id = "btn-delete";
    ParaAndTimeHolder.id = "para-time-holder";

    // assiging data to respective element
    headingElement.innerText = element.username;
    reviewPara.innerText = element.review;
    timeSpan.innerText = element.time;

    let stars = "";
    for (let i = 0; i < element.starRate; i++) {
      stars = stars + "⭐";
    }
    starPara.innerText = stars;

    const finalIndex = element.index ? element.index : index;

    //adding edit funtion to the editButton
    editButton.addEventListener("click", () => editReview(finalIndex));
    //adding delete funtion to the deleteButton
    deleteButton.addEventListener("click", () => deleteReview(finalIndex));

    //appending element to their respective parent
    editButton.appendChild(editImg);
    deleteButton.appendChild(deleteImg);
    buttonHolder.appendChild(editButton);
    buttonHolder.appendChild(deleteButton);
    titleAndButtonHolder.appendChild(headingElement);
    titleAndButtonHolder.appendChild(buttonHolder);
    ParaAndTimeHolder.appendChild(reviewPara);
    ParaAndTimeHolder.appendChild(timeSpan);
    reviewHolder.appendChild(titleAndButtonHolder);
    reviewHolder.appendChild(starPara);
    reviewHolder.appendChild(ParaAndTimeHolder);
    reviewsContainer.appendChild(reviewHolder);
  });
}

//delete review
function deleteReview(index) {
  reviews.splice(index, 1);
  renderReviews(reviews);
}

//edit review
function editReview(index) {
  const reviewsHolder = document.querySelectorAll("#review-holder");
  reviewsHolder[index].style.background = "#2C2C55";
  isUpdating = true;
  updateReviewIndex = index;
  toUpdateReview = reviews[index];
  reviewInput.value = toUpdateReview.review;
  if (toUpdateReview.username !== "anonymous") {
    usernameInput.value = toUpdateReview.username;
  }
  submitBtn.innerText = "Update";
  colorSelectedStars(toUpdateReview.starRate);
}

//remove sort div
function removeFilterDiv() {
  filterBtnHolder.style.display = "none";
}

//show sort div
function showFilterDiv() {
  filterBtnHolder.style.display = "flex";
}

//remove sort div
function removeSortDiv() {
  sortBtnHolder.style.display = "none";
}

//show sort div
function shsowSortDiv() {
  sortBtnHolder.style.display = "flex";
}

//toggle funtion for sort and filter
function toggle(name) {
  if (name === "filter") {
    showSort = false;
    removeSortDiv();
    if (showFilter) {
      removeFilterDiv();
    } else {
      showFilterDiv();
    }

    showFilter = !showFilter;
  } else {
    showFilter = false;
    removeFilterDiv();
    if (showSort) {
      removeSortDiv();
    } else {
      shsowSortDiv();
    }
    showSort = !showSort;
  }
}

//filter the review
function filterReview(input) {
  //closing the filter and sor holders
  showFilter = false;
  showSort = false;
  removeFilterDiv();
  removeSortDiv();

  const result = [];

  if (input === "good") {
    result.push(
      ...reviews.filter((review, index) => {
        if (review.starRate >= 4) return { ...review, index };
      })
    );
  } else if (input === "bad") {
    result.push(
      ...reviews.filter((review, index) => {
        if (review.starRate <= 4) return { ...review, index };
      })
    );
  } else if (input === "named") {
    result.push(
      ...reviews.filter((review, index) => {
        if (review.username !== "anonymous") return { ...review, index };
      })
    );
  } else if (input === "anonymous") {
    result.push(
      ...reviews.filter((review, index) => {
        if (review.username === "anonymous") return { ...review, index };
      })
    );
  } else if (input === "default") {
    result.push(...reviews);
  }
  // else {
  //   result.push(...reviews.filter((review) => review.starRate >= 4));
  // }

  if (result.length < 1) {
    const head = document.createElement("p");
    head.innerText = "No review found with this filter";
    reviewsContainer.appendChild(head);
  } else {
    renderReviews(result);
  }
}

//sort the review
function sortReview(input) {
  // goodFirst badFirst oldestFirst newestFirst

  //closing the filter and sor holders
  showFilter = false;
  showSort = false;
  removeFilterDiv();
  removeSortDiv();

  console.log("sort");

  let result = [];

  reviews.forEach((review, index) => result.push({ ...review, index }));

  if (input === "goodFirst") {
    result.sort((a, b) => b.starRate - a.starRate);
  } else if (input === "badFirst") {
    result.sort((a, b) => a.starRate - b.starRate);
  } else if (input === "oldestFirst") {
    result.reverse();
  } else if (input === "newestFirst") {
    result = [...reviews];
  }

  if (result.length < 1) {
    const head = document.createElement("p");
    head.innerText = "No review found with this filter";
    reviewsContainer.appendChild(head);
  } else {
    renderReviews(result);
  }
}

//***** Addding funtion to element *****//

//adding function to form element when it is submitted
formElement.addEventListener("submit", (e) =>
  onSubmit(e, usernameInput.value, reviewInput.value.trim(), starRating)
);

//adding funtion to each star element to show the star that have selected
starElements.forEach((element, index) => {
  element.addEventListener("click", () => colorSelectedStars(index + 1));
});

//adding funtion to each star element to take star rating and show selected by changing color
starElements.forEach((element, index) => {
  element.addEventListener("click", () => takeStarRating(index + 1));
});

//adding funtion to each star element to show selected whenever hover
starElements.forEach((element, index) => {
  element.addEventListener("mouseover", () => colorStarOnHover(index));
});

//adding funtion to each star element to unselected whenever mouse goes out
starElements.forEach((element, index) => {
  element.addEventListener("mouseout", () => colorStarOnMouseOut(index));
});

// adding toggle to relative funtion
filterBtn.addEventListener("click", () => toggle("filter"));
sortBtn.addEventListener("click", () => toggle());

// adding filter to respective buttons
goodReviewsBtn.addEventListener("click", () => filterReview("good"));
badReviewsBtn.addEventListener("click", () => filterReview("bad"));
namedReviewsBtn.addEventListener("click", () => filterReview("named"));
anonymousReviewsBtn.addEventListener("click", () => filterReview("anonymous"));
defaultBtn.addEventListener("click", () => filterReview("default"));

// adding sort to respective buttons
goodFirstReviewBtn.addEventListener("click", () => sortReview("goodFirst"));
badFirstReviewBtn.addEventListener("click", () => sortReview("badFirst"));
oldestFirstReviewBtn.addEventListener("click", () => sortReview("oldestFirst"));
newestFirstReviewBtn.addEventListener("click", () => sortReview("newestFirst"));

defaultBtn.addEventListener("click", () => sortReview("default"));
