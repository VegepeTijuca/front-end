export default function Overlay({ aberto, onFechar, children }) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onFechar}
    >
      <div onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}