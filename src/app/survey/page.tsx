import Link from "next/link";
import { SurveyForm } from "@/components/SurveyForm";
export default function SurveyPage() {
  return (
    <div className="container narrow page">
      <nav className="survey-tabs" aria-label="Survey navigation">
        <Link className="active" href="/survey">
          Take survey
        </Link>
        <Link href="/survey/results">Live results</Link>
      </nav>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Student study</p>
          <h1>How do you discover projects?</h1>
          <p>
            This anonymous 2-minute survey helps evaluate ProjectHub. Do not
            enter personal or sensitive information.
          </p>
        </div>
      </div>
      <SurveyForm />
    </div>
  );
}
