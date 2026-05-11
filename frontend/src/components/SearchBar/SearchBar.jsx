import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?cat=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search services..."
        className="border p-2 rounded w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 rounded"
        type="button"
      >
        Search
      </button>
    </div>
  );
}