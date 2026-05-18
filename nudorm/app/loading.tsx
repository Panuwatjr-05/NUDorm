export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-64" />
        ))}
      </div>
    </div>
  );
}
