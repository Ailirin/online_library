// Пример теста для Jasmine
describe("Online Library Tests", function() {
  
  describe("Basic functionality", function() {
    
    it("should be able to add two numbers", function() {
      expect(2 + 2).toBe(4);
    });
    
    it("should be able to check string length", function() {
      const title = "Test Book Title";
      expect(title.length).toBeGreaterThan(0);
    });
    
    it("should be able to check array operations", function() {
      const books = ["Book 1", "Book 2", "Book 3"];
      expect(books).toContain("Book 2");
      expect(books.length).toBe(3);
    });
    
  });
  
  describe("Library functionality", function() {
    
    it("should create a book object", function() {
      const book = {
        title: "Test Book",
        author: "Test Author",
        year: 2023
      };
      
      expect(book.title).toBe("Test Book");
      expect(book.author).toBe("Test Author");
      expect(book.year).toBe(2023);
    });
    
    it("should validate book data", function() {
      const book = {
        title: "Test Book",
        author: "Test Author",
        year: 2023
      };
      
      expect(book.title).toBeDefined();
      expect(book.author).toBeDefined();
      expect(book.year).toBeGreaterThan(1900);
    });
    
  });
  
});
