// "use client"
// import { BACKEND_URL } from "@/utils";
// import axios from "axios";
// import { useEffect, useState } from "react"

// interface Task {
//     "id": number,
//     "amount": number,
//     "title": string,
//     "options": {
//         id: number;
//         image_url: string;
//         task_id: number
//     }[]
// }

// // CSR
// export const NextTask = () => {
//     const [currentTask, setCurrentTask] = useState<Task | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//         setLoading(true);
//         axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
//             headers: {
//                 "Authorization": localStorage.getItem("token")
//             }
//         })
//             .then(res => {
//                 setCurrentTask(res.data.task);
//                 setLoading(false)
//             })
//             .catch(e => {
//                 setLoading(false)
//                 setCurrentTask(null)
//             })
//     }, [])
    
//     if (loading) {
//         return <div className="h-screen flex justify-center flex-col">
//             <div className="w-full flex justify-center text-2xl">
//                 Loading...
//             </div>
//         </div>
//     }

//     if (!currentTask) {
//         return <div className="h-screen flex justify-center flex-col">
//             <div className="w-full flex justify-center text-2xl">
//                 Please check back in some time, there are no pending tasks at the moment
//             </div>
//         </div>
//     }

//     return <div>
//         <div className='text-2xl pt-20 flex justify-center'>
//             {currentTask.title}
//             <div className="pl-4">
//                 {submitting && "Submitting..."}
//             </div>
//         </div>
//         <div className='flex justify-center pt-8'>
//             {currentTask.options.map(option => <Option onSelect={async () => {
//                 setSubmitting(true);
//                 try {
//                     const response = await axios.post(`${BACKEND_URL}/v1/worker/submission`, {
//                         taskId: currentTask.id.toString(),
//                         selection: option.id.toString()
//                     }, {
//                         headers: {
//                             "Authorization": localStorage.getItem("token")
//                         }
//                     });
    
//                     const nextTask = response.data.nextTask;
//                     if (nextTask) {
//                         setCurrentTask(nextTask)
//                     } else {
//                         setCurrentTask(null);
//                     }
//                     // refresh the user balance in the appbar
//                 } catch(e) {
//                     console.log(e);
//                 }
//                 setSubmitting(false);

//             }} key={option.id} imageUrl={option.image_url} />)}
//         </div>
//     </div>
// }

// function Option({imageUrl, onSelect}: {
//     imageUrl: string;
//     onSelect: () => void;
// }) {
//     return <div>
//         <img onClick={onSelect} className={"p-2 w-96 rounded-md"} src={imageUrl} />
//     </div>
// }






"use client";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  "id": number,
  "amount": number,
  "title": string,
  "options": {
    id: number;
    image_url: string;
    task_id: number
  }[]
}

export const NextTask = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchNextTask = () => {
    setLoading(true);
    axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    })
      .then(res => {
        setCurrentTask(res.data.task);
        setError("");
      })
      .catch(e => {
        console.error("Error fetching tasks:", e);
        setError("Failed to load tasks. Please try again later.");
        setCurrentTask(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNextTask();
  }, []);

  const handleSubmission = async (optionId: number) => {
    if (submitting || !currentTask) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/v1/worker/submission`, {
        taskId: currentTask.id.toString(),
        selection: optionId.toString()
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });

      const nextTask = response.data.nextTask;
      if (nextTask) {
        setCurrentTask(nextTask);
      } else {
        setCurrentTask(null);
      }
    } catch (e) {
      console.error("Submission error:", e);
      setError("Failed to submit your selection. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="h-64 flex justify-center items-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-600">Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-auto max-w-2xl mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
                <button 
                  onClick={fetchNextTask}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : !currentTask ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <svg className="h-16 w-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Tasks Available</h2>
            <p className="text-slate-500 mb-6">Please check back later. There are no pending tasks at the moment.</p>
            <button 
              onClick={fetchNextTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-slate-800">{currentTask.title}</h1>
                  {submitting && (
                    <div className="flex items-center text-indigo-600">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-sm text-slate-500 flex items-center">
                  <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reward: {currentTask.amount} tokens
                </div>
                
                <div className="mt-4 text-sm text-slate-500">
                  Select the best option based on the task description
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentTask.options.map(option => (
                  <Option 
                    key={option.id} 
                    imageUrl={option.image_url} 
                    onSelect={() => handleSubmission(option.id)} 
                    disabled={submitting}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-16 py-6 bg-slate-800 text-slate-200 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Label3 - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

function Option({
  imageUrl, 
  onSelect, 
  disabled
}: {
  imageUrl: string;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <div 
      className={`
        relative rounded-xl overflow-hidden shadow-md 
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg transform transition-all duration-200 hover:scale-105 cursor-pointer'}
      `}
      onClick={disabled ? undefined : onSelect}
    >
      <img 
        className="w-full h-64 object-cover" 
        src={imageUrl} 
        alt="Task option" 
      />
      
      {!disabled && (
        <div className="absolute inset-0 bg-indigo-600 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 opacity-0 hover:opacity-100 transform translate-y-4 hover:translate-y-0 transition-all duration-200">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}