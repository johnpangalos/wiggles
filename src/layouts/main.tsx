import React from "react";
import { Outlet } from "react-router-dom";

import { Loading, BottomNavigation } from "@/components";
import { useAuth } from "@/hooks";

export function MainLayout() {
  const { loading, user } = useAuth();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        {loading ? <Loading /> : <Outlet />}
      </div>

      {user && <BottomNavigation />}
    </div>
  );
}
