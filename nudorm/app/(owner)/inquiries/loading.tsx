export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded-lg mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
