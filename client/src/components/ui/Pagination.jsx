import Button from "./Button";

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <Button
        variant="outline"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-[var(--muted)]">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
