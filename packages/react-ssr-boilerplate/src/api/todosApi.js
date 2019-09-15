export function todosApi(http) {
  return {
    all: () => {
      return http.get('/api/todos');
    },

    create: newTodo => {
      return http.post('/api/todos', newTodo);
    }
  };
}
