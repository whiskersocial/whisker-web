import { decode } from "jsonwebtoken";

export function setJWT(cvalue) {
    let date = new Date(new Date().getTime() + (2*60*60*1000));
    document.cookie = "jwt=" + cvalue + ";expires=" + date.toUTCString() + ";path=/";
}

export function delJWT() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "jwt=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export function getUserId() {
    var jwt = getCookie("jwt");
    var decoded = decode(jwt);
    if (decoded === null) {
        return "";
    }
    return decoded.id;
}

// export function checkCookie() {
//     var user = getCookie("username");
//     if (user !== "") {
//         alert("Welcome again " + user);
//     } else {
//         user = prompt("Please enter your name:", "");
//         if (user !== "" && user != null) {
//             setCookie("username", user, 365);
//         }
//     }
// }

function dateIsBeforeToday(date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

export function postDateFormat(postDate, editDate) {
    let result = "";
    const date_localization = "en-us";
    const date_time_options = {
        hour: "2-digit",
        minute: "2-digit"
    }

    result += dateIsBeforeToday(postDate) ?
        postDate.toLocaleDateString(date_localization) :
        postDate.toLocaleDateString(date_localization, date_time_options);

    if (postDate.getTime() !== editDate.getTime()) {
        result += " (last edited ";
        result += dateIsBeforeToday(editDate) ?
            editDate.toLocaleDateString(date_localization) :
            editDate.toLocaleDateString(date_localization, date_time_options);
        result += ")";
    }
    return result;
}

export const NUM_POSTS_PER_PAGE = 50;

export const API_BASE_URL = "http://localhost:5000";
export default API_BASE_URL;
