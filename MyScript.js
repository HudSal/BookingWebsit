
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    captionText.innerHTML = dots[slideIndex - 1].alt;
}

function validateNonEmpty(tf, helpText) {
    var value = tf.value;
    if (value) {
        tf.className = "valid";
        helpText.innerHTML = "";
        return true; // valid
    }
    else {
        tf.className = "invalid";
        helpText.innerHTML = "Empty field";
        return false; //invalid
    }
}

function containValidate(tf, helpText) {

    var isNotEmpty = validateNonEmpty(tf, helpText);
    if (isNotEmpty == false) {//empty false
        return false;
    }
    var value = tf.value;
    var regex = /[A-Z]{1,}[a-z]{1,}/;
    var isContain2LetterAtleast = regex.test(value);
    if (isContain2LetterAtleast) {
        tf.className = "valid";
        helpText.innerHTML = "";
        return true; // valid
    }
    else { // value is not contain two letter at least
        tf.className = "invalid";
        helpText.innerHTML = "Invalid Name (at least two letters: uppercase and lowercase)";
        return false; //invalid
    }
}

var notEmptyPhone = false;
function validateNonNumber(tf, helpText) {
    if (validateNonEmpty(tf, helpText)) {
        notEmptyPhone = true;
    }
    var value = tf.value;
    var regex = /^\d{10}$/;
    var isDigits = regex.test(value);
    if (isDigits) {
        tf.className = "valid";
        helpText.innerHTML = "";
        return true; // valid
    }
    else {
        tf.className = "invalid";
        helpText.innerHTML = "Invalid phone number (10 digits only)";
        return false; //invalid
    }
}

var notEmptyEmail = false;
function validateNonEmail(tf, helpText) {
    if (validateNonEmpty(tf, helpText)) {
        notEmptyEmail = true;
    }
    var value = tf.value;
    var regex = /\S+@\S+\.\S+/;
    var isEmail = regex.test(value);
    if (isEmail) {
        tf.className = "valid";
        helpText.innerHTML = "";
        return true; // valid
    }
    else {
        tf.className = "invalid";
        helpText.innerHTML = "Invalid email address";
        return false; //invalid
    }
}

function validateAll(form) {
    var success = true;
    if (!(notEmptyEmail || notEmptyPhone)) {
        document.getElementById("invalidEmail").innerHTML = "Missing inputs -At least one contact field (email or phone) must be entered";
        document.getElementById("invalidPhoneNumber").innerHTML = "Missing inputs -At least one contact field (email or phone) must be entered";
        success = false;
        document.getElementById("invalidEmail").className = "invalid";
        document.getElementById("invalidPhoneNumber").className = "invalid";
    }

    var i = 0;
    while (i < form.elements.length) {
        var e = form.elements[i];
        switch (i) {
            case (0):
                success = e.onblur() && success;
                i++;
                break;
            case 1:
                if (notEmptyEmail) {
                    success = e.onblur() && success;
                }
                i++;
                break;
            case 2:
                if (notEmptyPhone) {
                    success = e.onblur() && success;
                }
                i++;
                break;
            case 3:
                success = e.onblur() && success;
                i++;
                break;
            default:
                i++;
                break;
        }
    }

    return success;
}

/**A variable in the global namespace.
 * @var {Date} date - to store the currunt date
 * @var firstDay - to store the first date in the each dropdown list
 * @var lastDay - to store the last date in the each dropdown list
 * @var {object[]} selectedDates - to store the selected dates 'DatePrice' objects from the all the drop lists
 */
var date = new Date(); 
var firstDay;
var lastDay;

for (var i = 0; i < 11; i += 3) {
    if (i == 9) {
        firstDay = new Date(date.getFullYear(), i, 1);
        lastDay = new Date(date.getFullYear() + 1, 0, 0);
    }
    else {
        firstDay = new Date(date.getFullYear(), i, 1);
        lastDay = new Date(date.getFullYear(), i + 3, 0);
    }
    while (firstDay <= lastDay) {
        var opt = document.createElement("option");
        var text = document.createTextNode(firstDay.toLocaleDateString());
        opt.appendChild(text);
        document.getElementById("monthsDropDown" + i).appendChild(opt);
        firstDay.setDate(firstDay.getDate() + 1);
    }
}

var selectedDates = new Array();
/**@function displayDate
 * @param {string} monthDropDown - to pass the id for drop down list which is chosen to select the date to book
 * @param {string} selectedDropDown - to pass the id for drop down list where the selected dates will display
 * @description To save the selected dooking dates in the selectedDates array and display it in the selectedDates drop down list and display the total booking price for all Dates
*/
function displayDate(monthDropDown, selectedDropDown) {
    var selectedDate = monthDropDown.value;
    selectedDates.push(new DatePrice(selectedDate));
    var total = 0;
    for (var i = 0; i < selectedDates.length; i++) {
        total += selectedDates[i].p;
    }
    document.getElementById("Price").innerHTML = total;

    selectedDropDown.innerHTML = "";
    for (var i = 0; i < selectedDates.length; i++) {
        var opt = document.createElement("option");
        var text = document.createTextNode(selectedDates[i].d.toLocaleDateString());
        opt.appendChild(text);
        selectedDropDown.appendChild(opt);
    }
}
/**@function removeFromArray
 * @description To remove the selected dooking dates in the selectedDates array and remove it from the selectedDates drop down list and display the total booking price for the rest Dates
*/
function removeFromArray() {//using binary search
    var total = document.getElementById("Price").innerHTML;
    selectedDates.sort(compare);
    var selectedDate = document.getElementById("selectedDateDropDown").value;//searchDate  
    let selectedIndex = binarySearch(selectedDate, selectedDates);
    total -= selectedDates[selectedIndex].p;
    var deletedDate= selectedDates.splice(selectedIndex, 1);
    document.getElementById("selectedDateDropDown").remove(deletedDate);
    document.getElementById("Price").innerHTML = total;
}
/**@function compare 
 * @param {object} a - first selectedDates DatePrice object in the selectedDates[]
 * @param {object} b - second selectedDate DatePrice object in the selectedDates[]
 * @returns {number} - Return the value of coparison: 1 =>if selectedDateA > selectedDateB, -1=>if selectedDateA < selectedDateB, otherwise zero.
 * @description To Sort the selectedDates Array.
*/
function compare(a, b) {
    /**@constant {Date} selectedDateA - its value is a.selectedDate */
    const selectedDateA = a.d;
    /**@constant {Date} selectedDateB - its value is b.selectedDate */
    const selectedDateB = b.d;
    let comparison = 0;
    if (selectedDateA > selectedDateB) {
        comparison = 1;
    } else if (selectedDateA < selectedDateB) {
        comparison = -1;
    }
    return comparison;
}
/**
 * To find the position of required athlete by using binary search algorithm in athleteArray[].
 * @function binarySearch
 * @param {Object[]} list - The selectedDates Array.
 * @param {string} value - The selectedDate that we have to get its position in the array.
 * @returns {number} position value for required selectedDate, or -1 if tha selectedDate is not found in the selectedDates Array.
 */
function binarySearch(value, list) { //value=selectedDate, list= selectedDates
    let first = 0;    //left endpoint
    let last = list.length - 1;   //right endpoint
    let position = -1;
    let found = false;
    let middle;

    while (found === false && first <= last) {
        middle = Math.floor((first + last) / 2);
        if (selectedDates[middle].d.toLocaleDateString() == value) {
            found = true;
            position = middle;
        } else if (list[middle].d.toLocaleDateString() > value) {  //if in lower half
            last = middle - 1;
        } else {  //in in upper half
            first = middle + 1;
        }
    }
    return position;
}
/**Class DatePrice information */
class DatePrice {
/**
* Storing selectedDates details (Name, Height).
* @constructor
* @param {Date} d - The selectedDate.
*/
    constructor(d) {
        this.d = new Date(d);
        this.p = this.getPrice(); 
    }
/**
* Get the price value.
* @return {number} The price for the selected date.
*/
    getPrice() {
        var fDate1 = new Date(this.d.getFullYear(), 1, 1);// fDate1.toLocaleDateString()="2/1/2020"
        var lDate1 = new Date(this.d.getFullYear(), 5, 0);// lDate1.toLocaleDateString()="5/31/2020"

        var fDate2 = new Date(this.d.getFullYear(), 5, 1);// fDate2.toLocaleDateString()="6/1/2020"
        var lDate2 = new Date(this.d.getFullYear(), 8, 0);// lDate2.toLocaleDateString()="8/31/2020"

        var fDate3 = new Date(this.d.getFullYear(), 8, 1);// fDate3.toLocaleDateString()="9/1/2020"
        var lDate3 = new Date(this.d.getFullYear(), 11, 18);// lDate3.toLocaleDateString()="12/18/2020"

        if (this.d >= fDate1 && this.d <= lDate1) { // 2/1/2020 -> 5/31/2020
            return 220;
        }
        else if (this.d >= fDate2 && this.d <= lDate2) {// 6/1/2020 -> 8/31/2020
            return 200;
        }
        else if (this.d >= fDate3 && this.d <= lDate3) {// 9/1/2020 -> 12/18/2020
            return 150;
        }
        else {// 12/19/2020 -> 1/31/2020
            return 250;
        }

    }

}
