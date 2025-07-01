import { getAuthUrl } from "../../../../lib/spotify";

export async function GET() {
  const authUrl = getAuthUrl();
  return Response.redirect(authUrl);
}
