import "./client";
import { getRoutes } from "@lifi/sdk";
import type { RoutesRequest, RoutesResponse } from "./types";

export async function fetchRoutes(params: RoutesRequest): Promise<RoutesResponse> {
  return getRoutes(params);
}
