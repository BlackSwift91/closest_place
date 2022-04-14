export interface IPredictionType {
  description: string;
  distance_meters: number;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  structured_formatting: Object;
  terms: Object[];
  types: string[];
}

export interface PredictionFetchReslt {
  predictions: IPredictionType[];
  status: string;
}
