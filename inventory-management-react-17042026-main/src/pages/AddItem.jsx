// import { useState } from 'react';
import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';



export default function AddItem() {

const today = new Date().toISOString().split('T')[0];

  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
const [newCategoryName, setNewCategoryName] = useState('');

const [categories, setCategories] = useState([
  "Monitor","CPU","Keyboard Wire","Keyboard Wireless",
  "Mouse Wire","Mouse Wireless","UPS","Headphone",
  "Printer","Scanner","Access Points" , "Network Switch", "SSD", "USB Storage", "Consumables", "Others"
]);

  const [form, setForm] = useState({
    name: '',
    model: '',
    serialNumber: '',
    user: '',
    vendor: '',
    price: '',
    buyDate: today,
    invoice: '',
    registeredDate: today,
    extraDetails: '',
    file: '',
  });

  // const categories = [
  //   "Monitor","CPU","Keyboard Wire","Keyboard Wireless",
  //   "Mouse Wire","Mouse Wireless","UPS","Headphone",
  //   "Printer","Scanner"
  // ];
  useEffect(() => {
  const saved = localStorage.getItem('itemCategories');
  if (saved) {
    setCategories(JSON.parse(saved));
  }
}, []);

  const handleCategorySelect = (cat) => {
    setForm({ ...form, name: cat });
    setStep(2);
  };

  const handleAddNewCategory = () => {
  if (!newCategoryName.trim()) {
    alert('Enter category name');
    return;
  }
 
  if (categories.includes(newCategoryName)) {
    alert('Category already exists');
    return;
  }
 
  const updated = [...categories, newCategoryName.trim()];
  setCategories(updated);
  localStorage.setItem('itemCategories', JSON.stringify(updated));
  
  setForm({ ...form, name: newCategoryName.trim() });
  setNewCategoryName('');
  setShowNewCategoryForm(false);
  setStep(2);
};

  // ✅ FIXED FILE HANDLING
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] }); // ✅ store actual file
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ FIXED SUBMIT (FormData instead of JSON)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.model || !form.serialNumber || !form.user) {
      alert("Fill required fields");
      return;
    }

    const formData = new FormData();

    formData.append("itemName", form.name);
    formData.append("model", form.model);
    formData.append("serialNumber", form.serialNumber);
    formData.append("username", form.user);
    formData.append("price", form.price || "");
    formData.append("vendor", form.vendor || "");
    formData.append("invoice_no", form.invoice || "");
    formData.append("registered_on", form.registeredDate || "");
    formData.append("buyDate", form.buyDate || "");
    formData.append("extraDetails", form.extraDetails || "");

    // ✅ FILE APPEND
    if (form.file) {
      formData.append("file", form.file);
    }

    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await fetch(`${API_URL}/api/assets`, {
        method: "POST",
        body: formData, // ❗ no headers
      });

      const data = await res.json();
      console.log("Saved:", data);

      navigate('/dashboard');

    } catch (err) {
      console.error("Error:", err);
      alert("Error saving item");
    }
  };

  return (
    <div className="container py-5">

      <PageHeader
        title="Register New Inventory Item"
        subtitle="Add detailed information to update your inventory"
        icon="bi-box-seam"
      />

      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-7">

          <div className="card shadow-lg">
            <div className="card-body p-4">

              {/* STEP 1 */}
{step === 1 && (
  <>
    <h4 className="text-center mb-4">Select Item Category</h4>
    <div className="row g-3">
      {categories.map((cat, i) => (
        <div key={i} className="col-6 col-md-4">
          <button
            type="button"
            className="btn btn-outline-primary w-100 py-3"
            onClick={() => handleCategorySelect(cat)}
          >
            {cat}
          </button>
        </div>
      ))}
    </div>
 
    <div className="row g-3 mt-2">
      <div className="col-6 col-md-4">
        <button
          type="button"
          className="btn btn-success w-100 py-3"
          onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
        >
          <i className="bi bi-plus-lg"></i> New Category
        </button>
      </div>
    </div>
 
    {showNewCategoryForm && (
      <div className="card mt-4 border-success">
        <div className="card-body">
          <h6 className="mb-3">Create New Category</h6>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddNewCategory();
              }}
              maxLength={50}
            />
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddNewCategory}
            >
              Add
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowNewCategoryForm(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </button>
          </div>
          <small className="text-muted d-block mt-2">
            {newCategoryName.length}/50 characters
          </small>
        </div>
      </div>
    )}
  </>
)}
              {/* STEP 2 */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>

                  {/* BASIC */}
                  <h5 className="mb-3">Basic Information</h5>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label>Item Name</label>
                      <input className="form-control" value={form.name} readOnly />
                    </div>

                    <div className="col-md-6">
                      <label>Model *</label>
                      <input name="model" className="form-control" value={form.model} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label>Serial Number *</label>
                      <input name="serialNumber" className="form-control" value={form.serialNumber} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <label>Assigned User *</label>
                      <input name="user" className="form-control" value={form.user} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* PURCHASE */}
                  <h5 className="mt-4">Purchase Details</h5>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label>Vendor / Supplier</label>
                      <input name="vendor" className="form-control" value={form.vendor} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label>Purchase Price</label>
                      <input name="price" className="form-control" value={form.price} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label>Purchase Date</label>
                      <input type="date" name="buyDate" className="form-control" value={form.buyDate} max={today} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label>Invoice Number</label>
                      <input name="invoice" className="form-control" value={form.invoice} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label>Registered On</label>
                      <input type="date" name="registeredDate" className="form-control" value={form.registeredDate} max={today} onChange={handleChange} />
                    </div>
                  </div>

                  {/* DOCUMENT */}
                  <h5 className="mt-4">Supporting Documents & Additional Notes</h5>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label>Upload Supporting Document</label>
                      <input type="file" name="file" className="form-control" onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                      <label>Additional Details / Remarks</label>
                      <textarea name="extraDetails" className="form-control" value={form.extraDetails} onChange={handleChange}></textarea>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button type="button" className="btn btn-secondary w-50" onClick={() => setStep(1)}>Back</button>
                    <button className="btn btn-primary w-50">Save Item</button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}