// Temporarily disabled Firebase for build compatibility
// TODO: Re-enable Firebase functionality after fixing dependency issues

// Mock Firebase functions for build compatibility
export async function getAll() {
  // Return empty array as mock data
  return [];
}

export function save({ url, description, title, tags }) {
  // Mock save function - returns a resolved promise with the input data
  return Promise.resolve({ id: 'mock-id', url, description, title, tags });
}

export function like(item) {
  // Mock like function - returns a resolved promise
  return Promise.resolve(item);
}
