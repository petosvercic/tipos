export type Draw = {
  id: string;
  draw_no: number | null;
  draw_at: string;
  source_url: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
};

export type DrawNumber = {
  id: string;
  draw_id: string;
  number: number;
  position: number | null;
  created_at: string;
};

export type DrawWithNumbers = Draw & {
  numbers: number[];
};

export type AnalysisSummary = {
  totalDraws: number;
  latestDraw: DrawWithNumbers | null;
  hotNumbers: number[];
  coldNumbers: number[];
  overdueNumbers: number[];
  frequencies: Array<{ number: number; count: number }>;
};