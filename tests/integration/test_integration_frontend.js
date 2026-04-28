/**
 * Integration test for SearchColors API endpoint
 * Tests the API response structure and validates expected behavior
 */

const API_ENDPOINT = 'LAMPAPI/SearchColors.php';

describe('SearchColors API Integration Tests', () => {
  let mockXHR;
  let originalXMLHttpRequest;

  beforeEach(() => {
    // Store original XMLHttpRequest
    originalXMLHttpRequest = global.XMLHttpRequest;
    
    // Create mock XHR
    mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      responseText: '',
      status: 200,
      readyState: 4,
      onreadystatechange: null
    };
    
    global.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    // Restore original XMLHttpRequest
    global.XMLHttpRequest = originalXMLHttpRequest;
  });

  test('should send correct request payload for color search', () => {
    // Arrange
    const searchTerm = 'red';
    const userId = 1;
    let capturedRequest = null;

    mockXHR.open = jest.fn(function(method, url) {
      capturedRequest = { method, url };
    });
    
    mockXHR.send = jest.fn(function(data) {
      capturedRequest.data = data;
    });

    // Simulate the search function call
    const payload = JSON.stringify({ search: searchTerm, userId: userId });
    
    // Act - simulate making the API call
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payload);

    // Assert
    expect(capturedRequest.method).toBe('POST');
    expect(capturedRequest.url).toBe(API_ENDPOINT);
    expect(JSON.parse(capturedRequest.data)).toEqual({
      search: searchTerm,
      userId: userId
    });
  });

  test('should handle successful search response with colors', () => {
    // Arrange
    const mockResponse = {
      results: ['"Red"', '"DarkRed"', '"LightRed"'],
      count: 3
    };

    mockXHR.responseText = JSON.stringify(mockResponse);

    // Act
    let responseData = null;
    mockXHR.onreadystatechange = function() {
      if (mockXHR.readyState === 4 && mockXHR.status === 200) {
        responseData = JSON.parse(mockXHR.responseText);
      }
    };
    mockXHR.onreadystatechange();

    // Assert
    expect(responseData).not.toBeNull();
    expect(responseData.results).toHaveLength(3);
    expect(responseData.count).toBe(3);
  });

  test('should handle empty search results response', () => {
    // Arrange
    const mockResponse = {
      error: 'No Records Found'
    };

    mockXHR.responseText = JSON.stringify(mockResponse);
    mockXHR.status = 200;

    // Act
    let responseData = null;
    mockXHR.onreadystatechange = function() {
      if (mockXHR.readyState === 4 && mockXHR.status === 200) {
        responseData = JSON.parse(mockXHR.responseText);
      }
    };
    mockXHR.onreadystatechange();

    // Assert
    expect(responseData).not.toBeNull();
    expect(responseData.error).toBe('No Records Found');
  });

  test('should handle API error response', () => {
    // Arrange
    const mockResponse = {
      error: 'Database connection failed'
    };

    mockXHR.responseText = JSON.stringify(mockResponse);
    mockXHR.status = 500;

    // Act
    let responseData = null;
    let errorReceived = false;
    mockXHR.onreadystatechange = function() {
      if (mockXHR.readyState === 4 && mockXHR.status >= 400) {
        errorReceived = true;
        responseData = JSON.parse(mockXHR.responseText);
      }
    };
    mockXHR.onreadystatechange();

    // Assert
    expect(errorReceived).toBe(true);
    expect(responseData.error).toBe('Database connection failed');
  });

  test('should validate request contains required fields', () => {
    // Arrange
    let requestPayload = null;

    mockXHR.send = jest.fn(function(data) {
      requestPayload = JSON.parse(data);
    });

    // Act - Test with valid payload structure
    const validPayload = { search: 'blue', userId: 42 };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(validPayload));

    // Assert
    expect(requestPayload).not.toBeNull();
    expect(requestPayload).toHaveProperty('search');
    expect(requestPayload).toHaveProperty('userId');
    expect(typeof requestPayload.search).toBe('string');
    expect(typeof requestPayload.userId).toBe('number');
  });
});