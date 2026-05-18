export default function Loading() {
  return (
    <div className="max-w-lg mx-auto pt-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-gray-200" />
        <div className="p-6 space-y-5">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-blue-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
