import { auth, Token } from "@clerk/nextjs/server";

export const getToken = async () => {
  const { getToken } = await auth();
  try {
    const token = await getToken({ template: "convex" });
    return token;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
