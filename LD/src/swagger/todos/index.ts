import getTodos from './get-todos';
import getTodo from './get-todo';
import createTodo from './create-todo';
import updateTodo from './update-todo';
import deleteTodo from './delete-todo';

export default {
  paths: {
    '/api/todos': {
      ...getTodos,
      ...createTodo,
    },
    '/todos/{id}': {
      ...getTodo,
      ...updateTodo,
      ...deleteTodo,
    },
  },
};
