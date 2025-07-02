import TopBar from "../components/TopBar"; // wherever your TopBar is
import { Suspense } from "react";

export default function TopBarPage() {
  return (
    <Suspense fallback={<div>Loading stream bar...</div>}>
      <TopBar />
    </Suspense>
  );
}
