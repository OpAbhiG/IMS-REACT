export default function PageHeader({ title, subtitle, icon }) {
  return (
    <div className="text-center mb-5">

      {/* ICON CIRCLE */}
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm mb-3"
        style={{
          width: "100px",
          height: "100px",
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          color: "white",
          fontSize: "50px"
        }}
      >
        <i className={`bi ${icon}`}></i>
      </div>

      {/* TITLE */}
      <h2 className="fw-bold mb-1">{title}</h2>

      {/* SUBTITLE */}
      <p className="text-muted">{subtitle}</p>
    </div>
  );
}