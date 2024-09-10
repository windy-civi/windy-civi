//  https://www.w3schools.com/js/js_cookies.asp
export function getCookieFromString(cookieString: string, cname: string) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(cookieString);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// https://www.w3schools.com/js/js_cookies.asp
export function setCookieInDom(
  doc: typeof document,
  cookieName: string,
  cookieValue: string,
  expirationDays: number | "DELETE"
) {
  let expires = "";
  if (expirationDays === "DELETE") {
    expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
  } else {
    const d = new Date();
    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    expires = "expires=" + d.toUTCString();
  }
  doc.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

/**
 *      (o)(o)
 *    w"      "w
 *   W  -====-  W
 *    "w      w"
 *   w""""""""""w
 *  W            W
 *  Cookie Factory
 *   nom nom nom
 */
export const cookieFactory = (doc: typeof document) => {
  return {
    get: (cookieName: string) => getCookieFromString(doc.cookie, cookieName),
    set: (
      cookieName: string,
      cookieValue: string,
      expirationDays: number = 10065
    ) => setCookieInDom(doc, cookieName, cookieValue, expirationDays),
    delete: (cookieName: string) =>
      setCookieInDom(doc, cookieName, "", "DELETE"),
  };
};

export function formatDate(date?: string) {
  let d = date ? new Date(date) : new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
