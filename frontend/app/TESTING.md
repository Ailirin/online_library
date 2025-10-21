# 🧪 Тестирование с Jasmine

## Установка и настройка

Jasmine уже установлен и настроен в проекте.

## Структура тестов

```
frontend/app/
├── spec/
│   ├── support/
│   │   └── jasmine.json          # Конфигурация Jasmine
│   ├── helpers/
│   │   └── test-helper.js         # Helper функции
│   └── example.spec.js            # Пример тестов
```

## Запуск тестов

```bash
# Запустить все тесты
npm test

# Запустить тесты в режиме наблюдения
npm run test:watch
```

## Написание тестов

### Базовый синтаксис

```javascript
describe("Название группы тестов", function() {
  
  it("должен выполнять конкретное действие", function() {
    // Arrange (подготовка)
    const input = "test";
    
    // Act (действие)
    const result = someFunction(input);
    
    // Assert (проверка)
    expect(result).toBe("expected");
  });
  
});
```

### Доступные матчеры

```javascript
// Равенство
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Числа
expect(value).toBeGreaterThan(expected);
expect(value).toBeLessThan(expected);
expect(value).toBeCloseTo(expected, precision);

// Строки
expect(string).toContain(substring);
expect(string).toMatch(pattern);

// Массивы
expect(array).toContain(item);
expect(array).toHaveSize(length);

// Объекты
expect(object).toBeDefined();
expect(object).toBeNull();
expect(object).toBeTruthy();
expect(object).toBeFalsy();

// Исключения
expect(function).toThrow();
expect(function).toThrowError(error);
```

### Асинхронные тесты

```javascript
it("должен обрабатывать асинхронные операции", function(done) {
  asyncFunction().then(result => {
    expect(result).toBeDefined();
    done();
  });
});

// Или с async/await
it("должен обрабатывать асинхронные операции", async function() {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

## Helper функции

### Генераторы тестовых данных

```javascript
// Создать тестовую книгу
const book = generateTestBook({
  title: "Custom Title",
  author: "Custom Author"
});

// Создать тестового автора
const author = generateTestAuthor({
  name: "Custom Author Name"
});
```

### Моки API

```javascript
// Мок API ответа
const mockResponse = mockApiResponse({
  books: [book1, book2],
  total: 2
}, 200);
```

### Утилиты

```javascript
// Ожидание условия
await waitFor(() => element.isVisible(), 5000);
```

## Примеры тестов для библиотеки

### Тест компонента книги

```javascript
describe("Book Component", function() {
  
  it("должен отображать информацию о книге", function() {
    const book = generateTestBook({
      title: "Test Book",
      author: "Test Author",
      year: 2023
    });
    
    expect(book.title).toBe("Test Book");
    expect(book.author).toBe("Test Author");
    expect(book.year).toBe(2023);
  });
  
  it("должен валидировать данные книги", function() {
    const book = generateTestBook();
    
    expect(book.title).toBeDefined();
    expect(book.author).toBeDefined();
    expect(book.year).toBeGreaterThan(1900);
    expect(book.year).toBeLessThan(new Date().getFullYear() + 1);
  });
  
});
```

### Тест API функций

```javascript
describe("API Functions", function() {
  
  it("должен загружать список книг", async function() {
    const mockBooks = [
      generateTestBook({ id: 1 }),
      generateTestBook({ id: 2 })
    ];
    
    const response = mockApiResponse({ books: mockBooks });
    
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual({ books: mockBooks });
  });
  
});
```

## Конфигурация

### jasmine.json

```json
{
  "spec_dir": "spec",
  "spec_files": [
    "**/*[sS]pec.js"
  ],
  "helpers": [
    "helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": true
}
```

## Интеграция с CI/CD

Добавьте в GitHub Actions:

```yaml
- name: Run frontend tests
  run: |
    cd frontend/app
    npm test
```

## Полезные команды

```bash
# Запустить тесты с подробным выводом
npm test -- --verbose

# Запустить конкретный тест
npm test -- --grep "Book Component"

# Запустить тесты с покрытием кода
npm install --save-dev karma karma-jasmine karma-chrome-launcher
```

## Лучшие практики

1. **Именование тестов** - используйте описательные названия
2. **Один тест - одна проверка** - не смешивайте несколько проверок
3. **AAA паттерн** - Arrange, Act, Assert
4. **Моки** - используйте моки для внешних зависимостей
5. **Изоляция** - каждый тест должен быть независимым
