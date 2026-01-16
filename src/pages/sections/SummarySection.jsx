import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import API from "../services/api";
import Swal from "sweetalert2";

export default function SummarySection() {

  const [summary, setSummary] = useState({
    summary_text: ""
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "/api/me/resume/summary/";

  // ----------- GET SUMMARY -----------
  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await API.get(API_URL);

      setSummary(res.data);

    } catch (error) {
      console.log("Error fetching summary:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to load summary",
        icon: "error",
        confirmButtonText: "OK"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setSummary({
      ...summary,
      summary_text: e.target.value
    });
  };

  // ----------- PATCH UPDATE -----------
  const handlePatch = async () => {
    try {
      await API.patch(API_URL, summary);

      Swal.fire({
        title: "Success!",
        text: "Summary Updated Successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

    } catch (error) {
      console.log("Patch Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update summary",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePatch();
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

        <div className="flex gap-4">

          <button type="submit" className="editor-btn">
            Save Summary
          </button>

        </div>

      </form>

      )}

    </Accordion>
  );
}
