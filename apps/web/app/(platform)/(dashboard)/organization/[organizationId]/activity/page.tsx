"use client"; 

import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ActivityList } from "./_components/ActivityList";

const ActivityPage: React.FC = () => {
  return (
    <div className="w-full">
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
