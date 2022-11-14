import Plausible from "plausible-tracker";

export let tracker: ReturnType<typeof Plausible>;

export function setup() {
  tracker = Plausible({
    domain: "arleto.cz",
    apiHost: "https://arleto.mvolfik.com",
  });
  // tracker.enableAutoPageviews();
  // tracker.enableAutoOutboundTracking();
}
