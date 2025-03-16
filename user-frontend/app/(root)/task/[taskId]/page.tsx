"use client";
import { Appbar } from '@/components/Appbar';
import { BACKEND_URL } from '@/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';

async function getTaskDetails(taskId: string) {
  const response = await axios.get(`${BACKEND_URL}/v1/user/task?taskId=${taskId}`, {
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  });
  return response.data;
}

export default function Page({
  params: { taskId }
}: { params: { taskId: string } }) {
  const [result, setResult] = useState<Record<string, {
    count: number;
    option: {
      imageUrl: string
    }
  }>>({});
  const [taskDetails, setTaskDetails] = useState<{
    title?: string
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getTaskDetails(taskId)
      .then((data) => {
        setResult(data.result);
        setTaskDetails(data.taskDetails);
      })
      .catch((err) => {
        console.error("Error fetching task details:", err);
        setError("Failed to load task results. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-600">Loading task results...</p>
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
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Task Results
              </h1>
              <p className="text-xl text-indigo-600 font-medium">
                {taskDetails.title || "Task Details"}
              </p>
            </div>

            {Object.keys(result).length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto">
                <p className="text-slate-600">No results available for this task yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Object.keys(result || {}).map(resultId => (
                  <Task 
                    key={result[resultId].option.imageUrl} 
                    imageUrl={result[resultId].option.imageUrl} 
                    votes={result[resultId].count} 
                    totalVotes={getTotalVotes(result)}
                  />
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Task
              </button>
            </div>
          </>
        )}
      </div>
      
      <footer className="mt-16 py-6 bg-slate-800 text-slate-200 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Label3 - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

// Helper function to calculate total votes
function getTotalVotes(result: Record<string, { count: number; option: { imageUrl: string } }>) {
  return Object.values(result).reduce((sum, item) => sum + item.count, 0);
}

function Task({
  imageUrl, 
  votes,
  totalVotes
}: {
  imageUrl: string;
  votes: number;
  totalVotes: number;
}) {
  // Calculate percentage of votes
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative">
        <img 
          className="w-full h-56 object-cover" 
          src={imageUrl} 
          alt="Task option" 
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-sm font-bold py-1 px-3 rounded-full">
          {votes} vote{votes !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="p-4">
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span className="font-medium">{percentage}%</span>
          <span>{votes} of {totalVotes}</span>
        </div>
      </div>
    </div>
  );
}
