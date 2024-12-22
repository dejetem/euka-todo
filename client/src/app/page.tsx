"use client"
import { TodoList } from '@/components/todos/TodoList';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <TodoList />
    </ProtectedRoute>
  );
}