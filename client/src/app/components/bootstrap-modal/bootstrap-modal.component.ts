import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bootstrap-modal',
  templateUrl: './bootstrap-modal.component.html',
  styleUrls: ['./bootstrap-modal.component.css'],
})
export class BootstrapModalComponent implements OnInit {
  @Input() fromParent: any;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }
}
