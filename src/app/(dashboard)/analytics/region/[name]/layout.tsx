export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ team: string }>;
  children: React.ReactNode;
}) {
  const { team } = await params;
  return <section>{children}</section>;
}
