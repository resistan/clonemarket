import type { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div className="px-4 py-16">
      <div>
        <div>
          <label className="w-full text-gray-600 hover:text-orange-400 hover:border-orange-400 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
							<title>Upload image</title>
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>
      <div className="my-5">
        <label htmlFor="price" className="mb-1 text-sm font-medium text-gray-700">Price</label>
        <div className="rounded-md relative shadow-sm flex items-center">
          <div className="absolute left-0 pl-3 flex items-center justify-center pointer-events-none">
            <span className="text-gray-500 text-sm">$</span>
          </div>
          <input id="price" type="text" placeholder="0.00" 
						className="appearance-none w-full 
							px-3 py-2 pl-7
							border-gray-300 rounded-md shadow-sm 
							placeholder:text-gray-400"
					/>
          <div className="absolute right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">USD</span>
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 text-sm font-medium text-gray-700">Description</label>
        <div>
          <textarea rows={4} className="mt-1 shadow-sm w-full border-gray-300 rounded-md"/>
        </div>
      </div>
      <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 
					mt-5 py-2 px-4 border-transparent rounded-md shadow-sm 
					text-white font-medium text-sm
					focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 focus:outline-none
				">Upload product</button>
    </div>
  );
};

export default Upload;
