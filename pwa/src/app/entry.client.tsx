import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log(
//           `ServiceWorker registration successful with scope: ${registration.scope}`
//         );
//         return registration.update();
//       })
//       .then((registration) => console.log(`ServiceWorker updated`))
//       .catch((err) => console.log("ServiceWorker registration failed: ", err));
//   });
// }
