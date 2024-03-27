import SideNav from "@/components/SideNav";



// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto py-12">
      <div className="flex gap-8">
        <SideNav />

        <div className="w-full">
          {children}
        </div>
      </div>

    </main>
  );
}
