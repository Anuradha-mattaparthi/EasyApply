import React, { useState, useEffect } from "react";
import Accordion from "../components/Accordion";
import axios from "axios";

export default function SummarySection() {

  const [summary, setSummary] = useState({
    summary_text: ""
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  const API_URL = "https://smartapply-7msy.onrender.com/api/me/resume/summary/";

  // ----------- GET SUMMARY -----------
  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSummary(res.data);

    } catch (error) {
      console.log("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [token]);

  // ----------- HANDLE CHANGE -----------
  const handleChange = (e) => {
    setSummary({
      ...summary,
      summary_text: e.target.value
    });
  };

  // ----------- PATCH UPDATE -----------
  const handlePatch = async () => {

    console.log("PATCH DATA:", summary);

    try {
      await axios.patch(API_URL, summary, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Summary Updated Successfully (PATCH)");

    } catch (error) {
      console.log("Patch Error:", error.response);
      alert("Failed to update summary");
    }
  };

  // ----------- PUT UPDATE -----------
  const handlePut = async () => {

    console.log("PUT DATA:", summary);

    try {
      await axios.put(API_URL, summary, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Summary Updated Successfully (PUT)");

    } catch (error) {
      console.log("Put Error:", error.response);
      alert("Failed to update summary");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePatch();   // default to PATCH
  };

  if (!token) {
    return <p>Please login to edit summary</p>;
  }

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
            Save (PATCH)
          </button>

          <button
            type="button"
            onClick={handlePut}
            className="editor-btn"
          >
            Full Update (PUT)
          </button>

        </div>

      </form>

      )}

    </Accordion>
  );
}
