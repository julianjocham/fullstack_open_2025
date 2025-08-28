    sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server


    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [
        {
            "content": "a",
            "date": "2025-08-28T06:14:43.695Z"
        },
    ...]
    deactivate server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    browser-->>server: {
        "content": "wurm",
        "date": "2025-08-28T13:14:55.914Z"
    }
    activate server
    server-->>browser: {"message":"note created"}
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    Note right of browser: The browser executes the callback function that renders the notes