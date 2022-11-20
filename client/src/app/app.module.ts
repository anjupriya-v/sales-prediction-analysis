import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PredictDatasetComponent } from './components/predict-dataset/predict-dataset.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';
import { SavedPredictionsComponent } from './components/saved-predictions/saved-predictions.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { SamplesComponent } from './components/samples/samples.component';
import { AccountComponent } from './components/account/account.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalComponent } from './components/bootstrap-modal/bootstrap-modal.component';
import { FeaturesComponent } from './components/features/features.component';
import { AuthGuard } from './authguard.service';
import { LoggedInAuthGuard } from './loggedInAuthGuard.service';
import { PredictionResultAuthGuard } from './predictionResultAuthGuard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    PredictDatasetComponent,
    ContactUsComponent,
    FooterComponent,
    SavedPredictionsComponent,
    PredictionResultComponent,
    NavbarComponent,
    HomeComponent,
    SamplesComponent,
    AccountComponent,
    VisualizationComponent,
    BootstrapModalComponent,
    FeaturesComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
  ],
  providers: [AuthGuard, LoggedInAuthGuard, PredictionResultAuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [BootstrapModalComponent],
})
export class AppModule {}
