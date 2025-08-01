import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Plus, X, Edit, Check } from 'lucide-react';
import { Category } from '../types';

const CategoryList: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTaskContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-blue-500');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-teal-500', label: 'Teal' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-cyan-500', label: 'Cyan' },
  ];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setNewCategoryName('');
      setNewCategoryColor('bg-blue-500');
      setIsAdding(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      updateCategory({
        id,
        name: editName.trim(),
        color: editColor,
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between">
              {editingId === category.id ? (
                <div className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-grow p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <select
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {colorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveEdit(category.id)}
                    className="p-1 text-green-500 hover:text-green-600 transition-colors duration-200"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full ${category.color} mr-2`}></span>
                    <span className="text-gray-900 dark:text-gray-100">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => startEditing(category)}
                      className="p-1 text-gray-500 hover:text-indigo-500 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {isAdding ? (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <select
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAddCategory}
                className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition-colors duration-200"
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 flex items-center text-sm text-indigo-500 hover:text-indigo-600 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;