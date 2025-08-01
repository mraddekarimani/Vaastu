import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { Task, Category } from '../types';

// Default categories for new users
const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'DSA', color: 'bg-blue-500' },
  { name: 'Aptitude', color: 'bg-green-500' },
  { name: 'CS Fundamentals', color: 'bg-purple-500' },
  { name: 'Resume', color: 'bg-yellow-500' },
  { name: 'Projects', color: 'bg-pink-500' },
  { name: 'Mock Interviews', color: 'bg-red-500' },
];

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  currentDay: number;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  getTasksByDay: (day: number) => Task[];
  resetProgress: () => Promise<void>;
  incrementDay: () => Promise<void>;
  decrementDay: () => Promise<void>;
  setCurrentDay: (day: number) => Promise<void>;
  streak: number;
  completionRate: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentDay, setCurrentDayState] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);

  // Fetch user's data when authenticated
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      // Reset state when user logs out
      setTasks([]);
      setCategories([]);
      setCurrentDayState(1);
      setStreak(0);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (categoriesData) {
      setCategories(categoriesData);
    }

    // If no categories exist, create default ones
    if (!categoriesData?.length) {
      for (const category of defaultCategories) {
        await supabase
          .from('categories')
          .insert({ ...category, user_id: user.id });
      }
      
      // Fetch categories again after creating defaults
      const { data: newCategories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (newCategories) {
        setCategories(newCategories);
      }
    }

    // Fetch tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (tasksData) {
      setTasks(tasksData);
    }

    // Fetch progress
    const { data: progressData } = await supabase
      .from('progress')
      .select('*')
      .single();

    if (progressData) {
      setCurrentDayState(progressData.current_day);
      setStreak(progressData.streak);
    } else {
      // Create initial progress record if it doesn't exist
      await supabase
        .from('progress')
        .insert({ user_id: user.id });
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setTasks([...tasks, data]);
      if (task.completed) {
        await updateStreak(true);
      }
    }
  };

  const updateTask = async (updatedTask: Task) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', updatedTask.id);

    if (error) throw error;
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = async (id: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(updatedTask);

    if (task.day === currentDay) {
      const dayTasks = tasks.filter(t => t.day === currentDay);
      const allCompleted = dayTasks.every(t => 
        t.id === id ? !task.completed : t.completed
      );
      
      if (allCompleted && dayTasks.length > 0) {
        await updateStreak(true);
      }
    }
  };

  const updateStreak = async (completed: boolean) => {
    if (!user) return;

    const newStreak = completed ? streak + 1 : 0;
    const { error } = await supabase
      .from('progress')
      .update({ 
        streak: newStreak,
        last_completed: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;
    setStreak(newStreak);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCategories([...categories, data]);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setCategories(categories.filter(category => category.id !== id));
  };

  const updateCategory = async (updatedCategory: Category) => {
    if (!user) return;

    const { error } = await supabase
      .from('categories')
      .update(updatedCategory)
      .eq('id', updatedCategory.id);

    if (error) throw error;
    setCategories(categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const getTasksByDay = (day: number) => {
    return tasks.filter(task => task.day === day);
  };

  const resetProgress = async () => {
    if (!user || !window.confirm('Are you sure you want to reset your progress? This will delete all tasks and reset your day count.')) {
      return;
    }

    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', user.id);

    if (tasksError) throw tasksError;

    const { error: progressError } = await supabase
      .from('progress')
      .update({ 
        current_day: 1,
        streak: 0,
        last_completed: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (progressError) throw progressError;

    setTasks([]);
    setCurrentDayState(1);
    setStreak(0);
  };

  const setCurrentDay = async (day: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('progress')
      .update({ current_day: day })
      .eq('user_id', user.id);

    if (error) throw error;
    setCurrentDayState(day);
  };

  const incrementDay = async () => {
    if (!user) return;

    const todayTasks = getTasksByDay(currentDay);
    const allCompleted = todayTasks.length > 0 && todayTasks.every(task => task.completed);

    if (!allCompleted && todayTasks.length > 0) {
      if (!window.confirm('Not all tasks for today are completed. Are you sure you want to move to the next day?')) {
        return;
      }
      await updateStreak(false);
    } else if (todayTasks.length > 0) {
      await updateStreak(true);
    }

    await setCurrentDay(currentDay + 1);
  };

  const decrementDay = async () => {
    if (currentDay > 1) {
      await setCurrentDay(currentDay - 1);
    }
  };

  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) 
    : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        currentDay,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        addCategory,
        deleteCategory,
        updateCategory,
        getTasksByDay,
        resetProgress,
        incrementDay,
        decrementDay,
        setCurrentDay,
        streak,
        completionRate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};