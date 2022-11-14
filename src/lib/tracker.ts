import Plausible from "plausible-tracker";

export let tracker: ReturnType<typeof Plausible>;

export function setup() {
  tracker = Plausible({
    domain: "evavolfova.cz",
    apiHost: "https://evavolfova.cz",
  });
  // tracker.enableAutoPageviews();
  // tracker.enableAutoOutboundTracking();
}
