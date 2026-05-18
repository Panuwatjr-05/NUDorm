export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-6">
        <div className="w-40 flex flex-col items-center gap-2">
          <div className="h-12 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-3 bg-gray-100 rounded-full" />)}
        </div>
      </div>
      <div className="space-y-3">
        {[1,2,3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
