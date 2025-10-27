import { api } from "./http";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO date
  capacity: number;
  imageUrl?: string | null;
  tags?: string[] | null;
  seatsLeft: number;
};

export type EventsListResponse = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: EventItem[];
};

export async function listEvents(params?: {
  status?: "upcoming" | "past" | "all";
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "date_asc" | "date_desc";
}): Promise<EventsListResponse> {
  try {
    console.log(
      "Requesting events from:",
      api.defaults.baseURL + "/events",
      params
    );

    const res = await api.get<EventsListResponse>("/events", { params });
    console.log(" Events fetched successfully:", res.data);
    return res.data;
  } catch (err: any) {
    console.error(" Error fetching events:", err.message);
    throw err;
  }
}
