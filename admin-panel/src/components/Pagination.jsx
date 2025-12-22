export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <button
                className="px-3 py-2 min-w-[40px] rounded bg-gray-200 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    className={`px-3 py-1 rounded ${page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                        }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
}