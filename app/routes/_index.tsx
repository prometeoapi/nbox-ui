
export default function Index() {
  return (
      <div className="flex flex-col dark:bg-slate-800">
        <div className="bg-blue-500 text-white text-center py-4">
          Top Section
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-blue-500 text-white text-center py-4">
            Left Column
          </div>
          <div className="w-full md:w-1/2 bg-gray-200 text-center py-4">
            Right Column
          </div>
        </div>
      </div>
  );
}

