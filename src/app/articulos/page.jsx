'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticulosPage() {
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, [currentPage, keyword]);

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articulos?page=${currentPage}&keyword=${keyword}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEntries(data.entries || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error obteniendo los articulos:', error);
      setError(error.message);
      setEntries([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEntries();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCardClick = (id) => {
    router.push(`/articulos/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Artículos</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Buscar artículos..."
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </form>

      {error && (
        <p className="text-red-500 mb-4">Error: {error}</p>
      )}

      {/* Mostrar artículos */}
      {isLoading ? (
        <p>Cargando artículos...</p>
      ) : entries && entries.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleCardClick(entry.id)}
              >
                <h2 className="text-xl font-semibold">{entry.titulo}</h2>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No se encontraron artículos.</p>
      )}
    </div>
  );
}
