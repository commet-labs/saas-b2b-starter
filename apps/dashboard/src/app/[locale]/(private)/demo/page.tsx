"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { CreateCustomersForm } from "@/modules/demo/components/create-customers-form";
import { SeatEventsForm } from "@/modules/demo/components/seat-events-form";
import { UsageEventsForm } from "@/modules/demo/components/usage-events-form";
import { EventLog } from "@/modules/demo/components/event-log";
import { getDemoOrganizations } from "@/modules/demo/actions/demo-actions";
import type { DemoEvent } from "@/modules/demo/lib/demo-utils";
import { Building2, Users, Activity, Loader2 } from "lucide-react";

export default function DemoPage() {
  const [organizations, setOrganizations] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    seatEvents: 0,
    usageEvents: 0,
  });

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const result = await getDemoOrganizations();
      if (result.success && result.data) {
        setOrganizations(result.data);
        setStats((prev) => ({ ...prev, customers: result.data.length }));
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleEventCreated = (event: DemoEvent) => {
    setEvents((prev) => [event, ...prev.slice(0, 49)]);

    // Update stats
    if (event.type === "customer") {
      setStats((prev) => ({ ...prev, customers: prev.customers + 1 }));
    } else if (event.type === "seat") {
      setStats((prev) => ({ ...prev, seatEvents: prev.seatEvents + 1 }));
    } else if (event.type === "usage") {
      setStats((prev) => ({ ...prev, usageEvents: prev.usageEvents + 1 }));
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commet Integration Demo</h1>
        <p className="text-muted-foreground">
          Test Commet's billing features: create customers, manage seats, and
          track usage events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">
              Organizations created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.seatEvents}</div>
            <p className="text-xs text-muted-foreground">Seats added/removed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usageEvents}</div>
            <p className="text-xs text-muted-foreground">Events tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Customers</CardTitle>
            <CardDescription>
              Create demo organizations as Commet customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCustomersForm
              onEventCreated={handleEventCreated}
              onRefresh={loadOrganizations}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seat Events</CardTitle>
            <CardDescription>
              Add or remove seats for organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeatEventsForm
              organizations={organizations}
              onEventCreated={handleEventCreated}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Events</CardTitle>
            <CardDescription>Track usage for billing</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageEventsForm
              organizations={organizations}
              onEventCreated={handleEventCreated}
            />
          </CardContent>
        </Card>
      </div>

      <EventLog events={events} />

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">How to use this demo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong>1. Create Customers:</strong> Click the buttons to create
            demo organizations. Each will be registered as a customer in Commet.
          </p>
          <p>
            <strong>2. Manage Seats:</strong> Select an organization and add or
            remove seats (admin, user, or viewer).
          </p>
          <p>
            <strong>3. Track Usage:</strong> Select an organization and send
            usage events for billing (API calls, storage, compute).
          </p>
          <p>
            <strong>4. Check Logs:</strong> View events in the Event Log and
            check your server console for Commet SDK calls.
          </p>
          <p className="pt-2 text-xs">
            All events are sent to Commet in sandbox mode. Check your Commet
            dashboard to see the data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
