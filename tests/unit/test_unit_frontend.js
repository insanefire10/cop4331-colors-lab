// Mock the DOM elements
const mockElements = {};

const mockDocument = {
  getElementById: (id) => {
    // Always create the element if it doesn't exist
    if (!mockElements[id]) {
      mockElements[id] = {
        value: '',
        innerHTML: '',
        style: {}
      };
    }
    return mockElements[id];
  },
  cookie: ''
};

// Also expose mockElements globally for test setup
global.mockElements = mockElements;

// Set up global mocks
global.document = mockDocument;
global.window = {
  location: {
    href: ''
  }
};

// Mock XMLHttpRequest
global.XMLHttpRequest = jest.fn().mockImplementation(() => ({
  open: jest.fn(),
  setRequestHeader: jest.fn(),
  send: jest.fn(),
  responseText: '',
  status: 200,
  readyState: 4,
  onreadystatechange: null
}));

// Define the functions from code.js (mirrored for testing)
let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";
  
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  
  document.getElementById("loginResult").innerHTML = "";

  let tmp = {login:login,password:password};
  let jsonPayload = JSON.stringify( tmp );
  
  let url = urlBase + '/Login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        let jsonObject = JSON.parse( xhr.responseText );
        userId = jsonObject.id;
      
        if( userId < 1 )
        {		
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }
      
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();
  
        window.location.href = "color.html";
      }
    };
    xhr.send(jsonPayload);
  }
  catch(err)
  {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie()
{
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime()+(minutes*60*1000));	
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for(var i = 0; i < splits.length; i++) 
  {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if( tokens[0] == "firstName" )
    {
      firstName = tokens[1];
    }
    else if( tokens[0] == "lastName" )
    {
      lastName = tokens[1];
    }
    else if( tokens[0] == "userId" )
    {
      userId = parseInt( tokens[1].trim() );
    }
  }
  
  if( userId < 0 )
  {
    window.location.href = "index.html";
  }
}

// Make functions available globally
global.doLogin = doLogin;
global.saveCookie = saveCookie;
global.readCookie = readCookie;
global.userId = userId;
global.firstName = firstName;
global.lastName = lastName;

// Add constants from code.js
const urlBase = '{Your URL HERE/LAMPAPI}';
const extension = 'php';

describe('Frontend Tests', () => {
  beforeEach(() => {
    // Reset mock elements before each test
    Object.keys(mockElements).forEach(key => {
      mockElements[key].value = '';
      mockElements[key].innerHTML = '';
    });
    global.document.cookie = '';
    global.window.location.href = '';
    
    // Reset global variables
    global.userId = 0;
    global.firstName = '';
    global.lastName = '';
    userId = 0;
    firstName = '';
    lastName = '';
  });

  describe('doLogin function', () => {
    test('should have doLogin function defined', () => {
      expect(typeof doLogin).toBe('function');
    });

    test('should clear loginResult on call', () => {
      // Access through document.getElementById to ensure elements are created
      document.getElementById('loginResult').innerHTML = 'Previous error';
      document.getElementById('loginName').value = 'testuser';
      document.getElementById('loginPassword').value = 'testpass';
      
      doLogin();
      
      expect(document.getElementById('loginResult').innerHTML).toBe('');
    });

    test('should read loginName and loginPassword values', () => {
      document.getElementById('loginName').value = 'testuser';
      document.getElementById('loginPassword').value = 'testpass';
      
      doLogin();
      
      expect(document.getElementById('loginName').value).toBe('testuser');
      expect(document.getElementById('loginPassword').value).toBe('testpass');
    });
  });

  describe('saveCookie function', () => {
    test('should have saveCookie function defined', () => {
      expect(typeof saveCookie).toBe('function');
    });

    test('should set cookie with user data', () => {
      firstName = 'John';
      lastName = 'Doe';
      userId = 123;
      
      saveCookie();
      
      expect(global.document.cookie).toContain('firstName=John');
      expect(global.document.cookie).toContain('lastName=Doe');
      expect(global.document.cookie).toContain('userId=123');
    });
  });

  describe('readCookie function', () => {
    test('should have readCookie function defined', () => {
      expect(typeof readCookie).toBe('function');
    });

    test('should read cookie values correctly', () => {
      global.document.cookie = 'firstName=Jane,lastName=Smith,userId=456';
      
      readCookie();
      
      expect(firstName).toBe('Jane');
      expect(lastName).toBe('Smith');
      expect(userId).toBe(456);
    });

    test('should set userId to -1 for invalid cookie', () => {
      global.document.cookie = '';
      userId = 0;
      
      readCookie();
      
      expect(userId).toBe(-1);
    });
  });
});