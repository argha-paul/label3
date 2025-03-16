export const Hero = () => {
    return (
      <div className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
          Welcome to Label3
        </h1>
        <div className="text-xl text-slate-600 max-w-2xl mx-auto">
          Your one-stop destination for getting your data labeled accurately and efficiently
        </div>
        <div className="mt-8 flex justify-center">
          <a 
            href="#upload-section" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Create a Task
          </a>
        </div>
      </div>
    );
  };