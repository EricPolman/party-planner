import { useUser } from "@/hooks/useUser";

export function User() {
  const { data: user } = useUser();

  return <div>{user}</div>;
}
