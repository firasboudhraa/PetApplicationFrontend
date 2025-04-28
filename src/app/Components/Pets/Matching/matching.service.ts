import { HttpClient } from "@angular/common/http";
import { DisplayMatch, Match, MatchResponse } from "./matchModel";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UserService } from "src/app/Components/FrontOffice/user/service_user/user.service";

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private baseUrl = 'http://localhost:8084/api/matching';

  constructor(private http: HttpClient) {}

  // Get all matches for user
  getMatchesForUser(userId: number, topN?: number): Observable<MatchResponse> {
    let url = `${this.baseUrl}/user/${userId}`;
    if (topN) {
      url += `?topN=${topN}`;
    }
    return this.http.get<MatchResponse>(url);
  }

  // Get specific match by pet ID
  getMatchForPet(userId: number, petId: string): Observable<DisplayMatch | undefined> {
    return this.getMatchesForUser(userId).pipe(
      map(response => {
        const match = response.matches.find(m => m.id === petId);
        return match ? this.mapToDisplayMatch(match) : undefined;
      })
    );
  }

  private mapToDisplayMatch(match: Match): DisplayMatch {
    return {
      id: match.id,
      name: match.pet_name,
      species: match.species,
      score: match.match_score,
      reasons: match.reasons,
      consideration: match.consideration
    };
  }
}