import { Component, OnInit } from '@angular/core';
import { ModalManager } from 'ngb-modal';

@Component({
  selector: 'app-starquiz-popup',
  templateUrl: './starquiz-popup.component.html',
  styleUrls: ['./starquiz-popup.component.scss']
})
export class StarquizPopupComponent implements OnInit {

  constructor(private modalService: ModalManager) { }

  ngOnInit(): void {
  }


}
