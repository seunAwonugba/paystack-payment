import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Donate from "./Donate";
import Transactions from "./Transactions";

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="p-4 bg-gray-200">
                    <ul className="flex space-x-4">
                        <li>
                            <Link
                                to="/"
                                className="text-blue-500 hover:underline"
                            >
                                Donate
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/transactions"
                                className="text-blue-500 hover:underline"
                            >
                                Transactions
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Donate />} />
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
