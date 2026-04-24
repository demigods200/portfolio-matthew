export interface Project {
  id: string;
  title: string;
  company: string;
  description: string;
  stack: string[];
  status: "production" | "archived" | "experiment";
  impact?: string;
}
