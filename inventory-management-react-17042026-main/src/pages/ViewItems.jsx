import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";

export default function ViewItems() {
  const [items, setItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [relocateMode, setRelocateMode] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);

  const [form, setForm] = useState({});
  const [relocateForm, setRelocateForm] = useState({
    from: "",
    to: "",
    assignedTo: "",
    reason: "",
    by: "",
  });

  // Search & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc"); // default: Item Name A-Z

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/assets`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Data:", data);

        // Convert array → your existing grouped format
        const grouped = {};

        data.forEach((item) => {
          const category = item.itemName || "Others"; // 👈 matches your backend

          if (!grouped[category]) {
            grouped[category] = [];
          }

          grouped[category].push({
            id: item.id,
            name: item.itemName,
            model: item.model,
            serialNumber: item.serialNumber,
            user: item.username,
            vendor: item.vendor,
            price: item.price,
            invoice: item.invoice_no,
            buyDate: item.buyDate,
            registeredDate: item.registered_on,
            extraDetails: item.extraDetails,
            file: item.file,
            location: item.location,
            updatedDate: item.updatedAt,
            relocateHistory: item.relocateHistory || [],
          });
        });

        setItems(grouped);
      })
      .catch((err) => console.log("API Error:", err));
  }, []);

  const saveData = (data) => {
    localStorage.setItem("items", JSON.stringify(data));
    setItems(data);
  };

  const allItems = [];
  Object.keys(items).forEach((cat) => {
    items[cat].forEach((item, idx) => {
      allItems.push({ ...item, category: cat, index: idx });
    });
  });

  // Filter by search
  let filteredItems = allItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(term) ||
      (item.model || "").toLowerCase().includes(term) ||
      (item.serialNumber || "").toLowerCase().includes(term) ||
      (item.user || "").toLowerCase().includes(term) ||
      (item.vendor || "").toLowerCase().includes(term)
    );
  });

  // Sort based on dropdown selection
  filteredItems.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "price-high":
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case "price-low":
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case "purchase-new":
        return new Date(b.buyDate) - new Date(a.buyDate);
      case "purchase-old":
        return new Date(a.buyDate) - new Date(b.buyDate);
      case "updated-new":
        return new Date(b.updatedDate) - new Date(a.updatedDate);
      case "updated-old":
        return new Date(a.updatedDate) - new Date(b.updatedDate);
      default:
        return 0;
    }
  });

  // DELETE
  const handleDelete = (cat, index) => {
    if (!window.confirm("Delete item?")) return;
    const updated = { ...items };
    updated[cat].splice(index, 1);
    saveData(updated);
  };

  // EDIT
  const openEdit = (item) => {
    setSelectedItem(item);
    setForm(item);
    setEditMode(true);
  };

  const handleEditSave = () => {
    const updated = { ...items };
    updated[selectedItem.category][selectedItem.index] = {
      ...form,
      updatedDate: new Date().toISOString(),
    };
    saveData(updated);
    setEditMode(false);
  };

  // RELOCATE
  const openRelocate = (item) => {
    setSelectedItem(item);
    setRelocateForm({
      from: item.location || "",
      to: "",
      assignedTo: "",
      reason: "",
      by: "",
    });
    setRelocateMode(true);
  };

  const handleRelocate = () => {
    const updated = { ...items };
    const record = {
      from: relocateForm.from,
      to: relocateForm.to,
      assignedTo: relocateForm.assignedTo,
      reason: relocateForm.reason,
      by: relocateForm.by,
      date: new Date().toISOString(),
    };

    const item = updated[selectedItem.category][selectedItem.index];
    item.location = relocateForm.to;
    item.relocateHistory = [...(item.relocateHistory || []), record];
    item.updatedDate = new Date().toISOString();

    saveData(updated);
    setRelocateMode(false);
  };

  return (
    <div className="container py-5">
      <PageHeader
        title="View Inventory Items"
        subtitle="Manage all registered items"
        icon="bi-list-check"
      />

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          {/* Search and Sort Controls */}
          <div className="row g-3 mb-4">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Item Name, Model, Serial Number, User or Vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Item Name (A-Z)</option>
                <option value="name-desc">Item Name (Z-A)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="purchase-new">Purchase Date (Newest)</option>
                <option value="purchase-old">Purchase Date (Oldest)</option>
                <option value="updated-new">Updated Date (Newest)</option>
                <option value="updated-old">Updated Date (Oldest)</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflow: "auto", maxHeight: "500px" }}>
            <table className="table table-bordered table-hover text-nowrap">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Index</th>
                  <th>Item</th>
                  <th>Model</th>
                  <th>Serial</th>
                  <th>User</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Invoice</th>
                  <th>Purchase</th>
                  <th>Registered</th>
                  <th>Notes</th>
                  <th>File</th>
                  <th>Location</th>
                  <th>Updated</th>
                  <th>Relocate Count</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="16" className="text-center text-muted py-4">
                      No data available
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, i) => (
                    <tr key={item.id || i}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.model}</td>
                      <td>{item.serialNumber}</td>
                      <td>{item.user}</td>
                      <td>{item.vendor || "-"}</td>
                      <td>{item.price || "-"}</td>
                      <td>{item.invoice || "-"}</td>
                      <td>{item.buyDate || "-"}</td>
                      <td>{item.registeredDate || "-"}</td>
                      <td>{item.extraDetails || "-"}</td>

                      {/* File */}
                      <td>
                        {item.file ? (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => window.open(item.file, "_blank")}
                          >
                            <i className="bi bi-file-earmark"></i> View
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{item.location || "-"}</td>
                      <td>{item.updatedDate?.split("T")[0]}</td>
                      <td>{item.relocateHistory?.length || 0}</td>

                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDelete(item.category, item.index)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => openRelocate(item)}
                          >
                            <i className="bi bi-arrow-left-right"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              setSelectedItem(item);
                              setHistoryMode(true);
                            }}
                          >
                            <i className="bi bi-clock-history"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editMode && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <h5 className="mb-3">Edit Inventory Item</h5>
              <div className="row g-3">
                {[
                  "name",
                  "model",
                  "serialNumber",
                  "user",
                  "vendor",
                  "price",
                  "buyDate",
                  "invoice",
                  "registeredDate",
                  "extraDetails",
                ].map((key, i) => (
                  <div className="col-md-6" key={i}>
                    <label className="form-label text-capitalize">{key}</label>
                    <input
                      className="form-control"
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleEditSave}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= RELOCATE MODAL ================= */}
      {relocateMode && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Relocate Item</h5>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="From Location"
                    value={relocateForm.from}
                    onChange={(e) =>
                      setRelocateForm({ ...relocateForm, from: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="To Location"
                    onChange={(e) =>
                      setRelocateForm({ ...relocateForm, to: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Assigned To"
                    onChange={(e) =>
                      setRelocateForm({
                        ...relocateForm,
                        assignedTo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Relocated By"
                    onChange={(e) =>
                      setRelocateForm({ ...relocateForm, by: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Reason"
                    onChange={(e) =>
                      setRelocateForm({
                        ...relocateForm,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setRelocateMode(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={handleRelocate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= HISTORY MODAL ================= */}
      {historyMode && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <h5 className="mb-3">Relocation History</h5>
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Relocated By</th>
                      <th>Assigned To</th>
                      <th>Reason</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem?.relocateHistory?.length > 0 ? (
                      selectedItem.relocateHistory.map((h, i) => (
                        <tr key={i}>
                          <td>{h.from}</td>
                          <td>{h.to}</td>
                          <td>{h.by}</td>
                          <td>{h.assignedTo}</td>
                          <td>{h.reason}</td>
                          <td>{h.date?.replace("T", " ").slice(0, 16)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No relocation history available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setHistoryMode(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
