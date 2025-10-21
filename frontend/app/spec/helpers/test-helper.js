// Helper functions for Jasmine tests

// Mock API responses
global.mockApiResponse = function(data, status = 200) {
  return {
    status: status,
    json: () => Promise.resolve(data)
  };
};

// Test data generators
global.generateTestBook = function(overrides = {}) {
  return {
    id: Math.floor(Math.random() * 1000),
    title: "Test Book Title",
    author: "Test Author",
    year: 2023,
    genre: "Fiction",
    ...overrides
  };
};

global.generateTestAuthor = function(overrides = {}) {
  return {
    id: Math.floor(Math.random() * 1000),
    name: "Test Author",
    birthYear: 1980,
    nationality: "Test Country",
    ...overrides
  };
};

// Utility functions for tests
global.waitFor = function(condition, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    
    check();
  });
};
