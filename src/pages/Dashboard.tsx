import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import ProgressStats from '../components/ProgressStats';
import CategoryList from '../components/CategoryList';
import DayNavigation from '../components/DayNavigation';
import { Plus, RefreshCw, Filter, X } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tasks, getTasksByDay, currentDay, resetProgress, categories } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const currentDayTasks = getTasksByDay(currentDay);
  
  const filteredTasks = selectedCategory 
    ? currentDayTasks.filter(task => task.categoryId === selectedCategory)
    : currentDayTasks;
  
  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };
  
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  return (
    <div>
      <ProgressStats />
      <DayNavigation />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today's Tasks</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTaskForm}
                  className="flex items-center text-sm px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </button>
                <button
                  onClick={resetProgress}
                  className="flex items-center text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>
            
            {categories.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2 overflow-x-auto">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    } transition-colors duration-200`}
                  >
                    <span className={`w-2 h-2 rounded-full ${category.color} mr-1`}></span>
                    {category.name}
                    {selectedCategory === category.id && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            <div className="p-4">
              {showTaskForm && (
                <div className="mb-4">
                  <TaskForm onClose={toggleTaskForm} />
                </div>
              )}
              
              {filteredTasks.length > 0 ? (
                <div>
                  {filteredTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {currentDayTasks.length > 0 
                      ? "No tasks match your filter. Try a different category."
                      : "You have no tasks for today. Add a task to get started!"}
                  </p>
                  {!showTaskForm && currentDayTasks.length === 0 && (
                    <button
                      onClick={toggleTaskForm}
                      className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200"
                    >
                      Add Your First Task
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <CategoryList />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tips for Success</h2>
            </div>
            <div className="p-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Break large tasks into smaller, manageable ones</li>
                <li>Stay consistent to build your streak</li>
                <li>Prioritize tasks with high impact on your placement</li>
                <li>Set clear, achievable goals for each day</li>
                <li>Use categories to organize different areas of preparation</li>
                <li>Reflect on your progress daily and adjust as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;