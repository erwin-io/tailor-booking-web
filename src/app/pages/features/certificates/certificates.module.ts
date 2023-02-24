import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { BaptismalComponent } from './baptismal/baptismal.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MarriageContractComponent } from './marriage-contract/marriage-contract.component';


export const routes: Routes = [
  {
    path: 'baptismal',
    component: BaptismalComponent
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent
  },
  {
    path: 'marriage-contract',
    component: MarriageContractComponent
  },

];


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
})

export class CertificatesModule { }
