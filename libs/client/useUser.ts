import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IUserProfile {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  // const [user, setUser] = useState();
  // const router = useRouter();
  // useEffect(() => {
  // 	fetch("/api/users/me")
  // 	.then( (response) => response.json() )
  // 	.then( (data) => {
  // 		if(!data.ok) {
  // 			return router.replace("/enter"); // replace doesn't leave history
  // 		}
  // 		setUser(data.profile);
  // 	})
  // },[router])
  // return user;

  // const { data, error } = useSWR("/api/users/me", fetcher);

  const router = useRouter();
  const publicPages: string[] = ["/enter"];
  const checkPages: boolean = publicPages.includes(router.pathname);

  const { data, error } = useSWR(
    typeof window === "undefined" ? null : "/api/users/me"
  ); // fetcher moved to _app.js
  useEffect(() => {
    if (data && !data.ok && !checkPages) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
