import { auth, Token } from "@clerk/nextjs/server";

export const getToken = async () => {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  return token ?? undefined;
};
