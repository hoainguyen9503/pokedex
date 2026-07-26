type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number) => void;
  position?: "top" | "bottom";
};

function visiblePages(page: number, totalPages: number) {
  const pages = new Set([1, totalPages]);
  for (let value = page - 2; value <= page + 2; value += 1) {
    if (value >= 1 && value <= totalPages) pages.add(value);
  }
  return [...pages].sort((a, b) => a - b);
}

export default function Pagination({ page, pageSize, totalItems, onChange, position = "bottom" }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const pages = visiblePages(page, totalPages);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav className={`pagination pagination-${position}`} aria-label={`Phân trang ${position === "top" ? "đầu danh sách" : "cuối danh sách"}`}>
      <p>Hiển thị <strong>{from.toLocaleString("vi-VN")}–{to.toLocaleString("vi-VN")}</strong> / {totalItems.toLocaleString("vi-VN")}</p>
      <div>
        <button onClick={() => onChange(1)} disabled={page === 1} aria-label="Trang đầu">«</button>
        <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Trang trước">‹</button>
        {pages.map((value, index) => (
          <span key={value}>
            {index > 0 && value - pages[index - 1] > 1 && <i>…</i>}
            <button
              className={value === page ? "active" : ""}
              onClick={() => onChange(value)}
              aria-current={value === page ? "page" : undefined}
            >
              {value}
            </button>
          </span>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Trang sau">›</button>
        <button onClick={() => onChange(totalPages)} disabled={page === totalPages} aria-label="Trang cuối">»</button>
      </div>
    </nav>
  );
}
