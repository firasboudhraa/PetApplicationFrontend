
export interface Match {
  id: string;
  pet_name: string;
  species: string;
  match_score: number;
  reasons: string[];
  consideration: string;
}

export interface MatchResponse {
  matches: Match[];
}

export interface DisplayMatch {
  id: string;
  name: string;      // For display purposes
  species: string;
  score: number;     // For display purposes
  reasons: string[];
  consideration: string;
}

