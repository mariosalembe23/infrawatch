import { Suspense } from "react";
import Redirect from "./Redirect";

export default function RedirectPage() {
  return (
    <Suspense fallback={<div></div>}>
      <Redirect />
    </Suspense>
  );
}
