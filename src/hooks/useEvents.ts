import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const list = await client.models.Event.list({
        authMode: "userPool",
      });

      return list;
    },
  });
}
