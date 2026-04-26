import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function SummarySection() {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });

  const [summary, setSummary] = useState({ summary_text: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const API_URL = "/api/me/resume/summary/";

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_URL);
      setSummary(res.data);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.detail || "Failed to load summary"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleChange = (e) => {
    setSummary({ ...summary, summary_text: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!summary.summary_text.trim()) {
      return Toast.fire({ icon: "warning", title: "Summary cannot be empty" });
    }

    try {
      setSaving(true);
      await API.patch(API_URL, summary);
      Toast.fire({ icon: "success", title: "Summary updated successfully" });
    } catch (error) {
      const data = error.response?.data;
      const msg =
        data?.detail ||
        data?.error ||
        Object.values(data || {})?.[0]?.[0] ||
        "Failed to update summary";
      Toast.fire({ icon: "error", title: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Accordion title="Professional Summary">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="5"
            name="summary_text"
            value={summary.summary_text}
            onChange={handleChange}
            placeholder="Write your professional summary..."
            className="editor-textarea"
          />
          <button type="submit" disabled={saving} className="editor-btn">
            {saving ? "Saving..." : "Save Summary"}
          </button>
        </form>
      )}
    </Accordion>
  );
}