import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("https://localhost:7193/weatherforecast")
            .then(response => setMessage(JSON.stringify(response.data)))
            .catch(error => console.error("Error:", error));
    }, []);

    return (
        <div>
            <h1>Data from .NET:</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
