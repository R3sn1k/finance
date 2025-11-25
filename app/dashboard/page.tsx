// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { writeClient } from "@/sanity/lib/client";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const userEmail = (await cookies()).get("userEmail")?.value ?? "neznan";

  const data = await writeClient.fetch(
    `
    {
      "prihodkiSkupaj": math::sum(*[_type == "prodaja" && userEmail == $userEmail].cenaProdaje) || 0,
      "prihodkiTaMesec": math::sum(*[_type == "prodaja" && userEmail == $userEmail && dateTime(datum) > dateTime(now()) - 30*24*60*60*1000].cenaProdaje) || 0,
      "odhodkiSkupaj": 0,
      "odhodkiTaMesec": 0,
      "steviloProdaj": count(*[_type == "prodaja" && userEmail == $userEmail])
    }
  `,
    { userEmail }
  );

  return (
    <DashboardClient
      userEmail={userEmail}
      prihodkiSkupaj={Number(data.prihodkiSkupaj) || 0}
      prihodkiTaMesec={Number(data.prihodkiTaMesec) || 0}
      odhodkiSkupaj={Number(data.odhodkiSkupaj) || 0}
      odhodkiTaMesec={Number(data.odhodkiTaMesec) || 0}
      steviloProdaj={data.steviloProdaj || 0}
    />
  );
}