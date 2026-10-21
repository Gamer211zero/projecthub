import { INDIAN_STATES, TECH_OPTIONS } from "@/lib/constants";
import Link from "next/link";
type Params = Record<string, string | string[] | undefined>;
export function FilterBar({
  params,
  colleges,
}: {
  params: Params;
  colleges: string[];
}) {
  const v = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  return (
    <form className="filters" action="/projects">
      <h2>Filter projects</h2>
      <label>
        Search
        <input name="q" defaultValue={v("q")} placeholder="Title or keyword" />
      </label>
      <label>
        State
        <select name="state" defaultValue={v("state")}>
          <option value="">All states</option>
          {INDIAN_STATES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        College
        <select name="college" defaultValue={v("college")}>
          <option value="">All colleges</option>
          {colleges.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Technology
        <select name="tech" defaultValue={v("tech")}>
          <option value="">All technologies</option>
          {TECH_OPTIONS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select name="status" defaultValue={v("status")}>
          <option value="">Any status</option>
          <option value="IDEA">Idea</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>
      <button className="button">Apply filters</button>
      <Link className="clear" href="/projects">
        Clear all
      </Link>
    </form>
  );
}
