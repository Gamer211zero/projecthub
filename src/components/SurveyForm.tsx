"use client";
import { useActionState } from "react";
import { submitSurveyAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
export function SurveyForm() {
  const [state, action] = useActionState(submitSurveyAction, {} as FormState);
  if (state.success)
    return (
      <div className="empty-state">
        <h2>Response recorded</h2>
        <p>{state.success}</p>
        <a href="/survey/results">View live results</a>
      </div>
    );
  return (
    <form action={action} className="form-stack project-form">
      {state.error && <p className="alert error">{state.error}</p>}
      <div className="form-row">
        <label>
          Year
          <select name="year" required>
            <option>First year</option>
            <option>Second year</option>
            <option>Third year</option>
            <option>Final year</option>
            <option>Postgraduate</option>
          </select>
        </label>
        <label>
          Branch
          <input name="branch" required maxLength={80} />
        </label>
      </div>
      <label>
        College
        <input name="college" required maxLength={120} />
      </label>
      <label>
        How well do you know what students in other colleges are building?{" "}
        <select name="awareness">
          <option value="1">1 — Not at all</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 — Very well</option>
        </select>
      </label>
      <label>
        How do you currently find project ideas or teammates?
        <input name="discoveryMethod" required maxLength={200} />
      </label>
      <label>
        Have you wanted to collaborate with another college?
        <select name="wantedCollaboration">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>
      <label>
        How likely are you to use ProjectHub?
        <select name="likelihood">
          <option value="1">1 — Very unlikely</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 — Very likely</option>
        </select>
      </label>
      <label>
        Most important feature
        <select name="mostImportantFeature">
          <option>Post projects</option>
          <option>Search projects</option>
          <option>Collaborate</option>
        </select>
      </label>
      <label>
        What might stop you from using it?{" "}
        <span className="optional">Optional</span>
        <textarea name="barrier" maxLength={500} rows={4} />
      </label>
      <SubmitButton pending="Submitting…">Submit response</SubmitButton>
    </form>
  );
}
