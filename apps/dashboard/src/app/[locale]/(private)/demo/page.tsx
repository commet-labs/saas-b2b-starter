import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { getDemoOrganizations } from "@/modules/demo/lib/get-demo-organizations";
import { CreateCustomersForm } from "@/modules/demo/components/create-customers-form";
import { SeatEventsForm } from "@/modules/demo/components/seat-events-form";
import { UsageEventsForm } from "@/modules/demo/components/usage-events-form";
import { EventLog } from "@/modules/demo/components/event-log";
import { Building2, Users, Activity } from "lucide-react";

export default async function DemoPage() {
  const organizations = await getDemoOrganizations();

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
            <div className="text-2xl font-bold">
              {organizations?.length || 0}
            </div>
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
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Seats managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
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
            <CreateCustomersForm />
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
            <SeatEventsForm organizations={organizations || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Events</CardTitle>
            <CardDescription>Track usage for billing</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageEventsForm organizations={organizations || []} />
          </CardContent>
        </Card>
      </div>

      <EventLog />

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
