import { DashboardView } from "@/app/dashboard/(home)/dashboard-view";

export default async function HomePage() {
  // const users = await prisma.user.findMany({
  //   include: {
  //     posts: true,
  //   },
  // });

  // console.log(users);

  return <DashboardView />;
}
