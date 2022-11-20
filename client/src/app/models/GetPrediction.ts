export interface GetPrediction {
  [x: string]: any;
  id: string;
  currentDocument: boolean;
  mae: number;
  mape: number;
  mse: number;
  predictedColumn: [];
  predictedDate: [];
  rmse: number;
  title: string;
  lastModified: Date;
  periodicity: any;
  numericalValue: any;
}
