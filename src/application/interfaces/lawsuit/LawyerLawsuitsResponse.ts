export interface LawyerLawsuitsResponse {
  lawyer: {
    id: string;
    name: string;
  };
  lawsuits: {
    id: string;
    caseNumber: string;
    status: string;
  }[];
}