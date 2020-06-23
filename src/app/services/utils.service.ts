import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public alertController: AlertController) { }

  isNullOrUndefined(obj: any): boolean {
    if (obj === undefined) { return true; }
    if (obj === null) { return true; }
    return false;
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }
}
