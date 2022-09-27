import { useCallback } from "react";

import { Alert, Button } from "@/components";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ColorMap } from "./components/Alert";

export function SW(): JSX.Element {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  if (needRefresh) {
    return (
      <Alert type={ColorMap.INFO}>
        <div className="flex flex-col">
          New content is available, click on reload button to update.
          <div className="space-x-2 pt-2 self-end">
            <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
            <Button onClick={close}>Close</Button>
          </div>
        </div>
      </Alert>
    );
  }
  return <></>;
}
