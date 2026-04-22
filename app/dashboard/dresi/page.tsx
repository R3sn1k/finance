import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/client";
import DresiClient, { type Dres } from "./DresiClient";

export const revalidate = 0;

export default async function DresiPage() {
  const userEmail = (await cookies()).get("userEmail")?.value || "neznan";

  const dresi = await writeClient.fetch<Dres[]>(
    `*[_type == "dres" && userEmail == $userEmail && (!defined(status) || status != "prodan")] | order(_createdAt desc) {
      _id,
      _createdAt,
      ime,
      cenaProdaje,
      status,
      "slikaUrl": slika.asset->url
    }`,
    { userEmail }
  );

  return <DresiClient dresi={dresi} />;
}
