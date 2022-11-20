import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { PredictDatasetComponent } from './components/predict-dataset/predict-dataset.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';
import { SavedPredictionsComponent } from './components/saved-predictions/saved-predictions.component';
import { AuthGuard } from './authguard.service';
import { LoggedInAuthGuard } from './loggedInAuthGuard.service';
import { PredictionResultAuthGuard } from './predictionResultAuthGuard.service';
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'predict-dataset',
    component: PredictDatasetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'saved-predictions',
    component: SavedPredictionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prediction-result',
    component: PredictionResultComponent,
    canActivate: [PredictionResultAuthGuard],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [LoggedInAuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
