import DormCompare from "@/components/dorm/DormCompare";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const initialIds = ids?.split(",").filter(Boolean) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">เปรียบเทียบหอพัก</h1>
      <DormCompare initialIds={initialIds} />
    </div>
  );
}
