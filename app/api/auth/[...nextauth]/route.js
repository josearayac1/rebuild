import { getServerSession } from "next-auth";
import { authOptions } from "./options";

export { authOptions };

export async function GET(req) {
  const session = await getServerSession(authOptions);
 
}

export async function POST(req) {
  return await getServerSession(authOptions);
}