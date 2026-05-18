export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto pb-16 animate-pulse">
      {/* Image */}
      <div className="h-[440px] bg-gray-200 rounded-2xl mb-8" />

      {/* Title */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 pb-6 border-b border-gray-100">
            <div className="h-7 bg-gray-200 rounded-full w-20" />
            <div className="h-7 bg-gray-200 rounded-full w-24" />
          </div>
          <div className="py-6 border-b border-gray-100 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="py-6 border-b border-gray-100">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-5 bg-gray-100 rounded" />)}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-24 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-12 bg-gray-200 rounded-xl" />
              <div className="h-12 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
