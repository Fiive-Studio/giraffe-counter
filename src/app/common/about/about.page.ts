import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  goBack(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  openWindow(url: string) {
    window.open(url, '_system');
  }
}
