/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/http";
import type { EventItem } from "@/lib/events";
// 👇 import the client component (we create it in step 2)
import EventDetailClient from "./EventDetailClient";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // fetch on the server
  const { data: event } = await api.get<EventItem>(`/events/${id}`);

  return <EventDetailClient event={event} />;
}
