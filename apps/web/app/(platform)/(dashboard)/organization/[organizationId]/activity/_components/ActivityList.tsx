"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "components/ActivityItem";

export const ActivityList = () => {
  const { getToken, orgId } = useAuth(); // Clerk auth
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await getToken();
        if (!token || !orgId) return;

        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/audit-logs/org/${orgId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setAuditLogs(response.data.data || []);
      } catch (error: any) {
        console.error(
          "Error fetching audit logs:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [getToken, orgId]);

  if (loading) {
    return <ActivityList.Skeleton />;
  }

  return (
    <ol className="space-y-4 mt-4">
      {auditLogs.length === 0 ? (
        <p className="text-xs text-center text-muted-foreground">
          No activity found inside this organization
        </p>
      ) : (
        auditLogs.map((log) => <ActivityItem key={log.id} data={log} />)
      )}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};
