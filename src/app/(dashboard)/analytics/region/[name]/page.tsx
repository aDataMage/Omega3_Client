export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <h1>Blog Post: {name}</h1>;
}
