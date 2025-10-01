import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { signInDetails } = await getCurrentUser();

      return signInDetails?.loginId;
    },
  });
}
