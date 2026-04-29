import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackTelemetryEvent } from "../services/telemetryService";

/** Emits a funnel event on every client-side route change (sanitized path only). */
export default function TelemetryRouteListener() {
  const loc = useLocation();

  useEffect(() => {
    try {
      trackTelemetryEvent("funnel.route_enter", { route: loc.pathname });
    } catch {
      /* non-fatal */
    }
  }, [loc.pathname]);

  return null;
}
