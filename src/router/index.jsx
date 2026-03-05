import { Route, Routes, Navigate } from "react-router-dom";

import Issues from "../pages/Issues";
import Books from "../pages/Books";
import Interviews from "../pages/Interviews";
import Personal from "../pages/Personal";
import AddIssue from "../pages/AddIssue";
import IssueDetail from "../pages/IssueDetail";
import SearchPage from "../pages/SearchPage";
import ProtectedRoute from "./ProtectedRoute";
import BookDetail from "../pages/BookDetail";

function AppRouter() {
    return (
        <Routes>
            <Route path="/issues" element={<Issues />} />
            <Route path="/books" element={<Books />} />
            <Route path="/interview" element={<Interviews />} />
            <Route path="/issues/:issueId" element={<IssueDetail />} />
            <Route path="/books/:bookId" element={<BookDetail />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="*" element={<Navigate to="/issues" />} />

            {/* 需要登录 */}
            <Route
                path="/addIssue"
                element={
                    <ProtectedRoute>
                        <AddIssue />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/Personal"
                element={
                    <ProtectedRoute>
                        <Personal />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRouter;