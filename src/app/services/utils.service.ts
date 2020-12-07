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

  isNullOrEmpty(obj: string): boolean {
    if (this.isNullOrUndefined(obj)) { return true; }
    if (obj.trim() == "") { return true; }
    return false;
  }

  isIntValue(value: any): boolean {
    if (!this.isNullOrEmpty(value + '')) {
      if (!Number.isNaN(Number(value))) {
        if ((value + '').indexOf('.') == -1) { return true; }
      }
    }
    return false;
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Aceptar',
        cssClass: 'alert-button-giraffe'
      }],
      cssClass: 'alert-giraffe'
    });

    await alert.present();
  }

  async showAlertDecision(title: string, message: string, callbackOk) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      cssClass: 'alert-giraffe',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-giraffe'
      }, {
        text: 'Aceptar',
        cssClass: 'alert-button-giraffe',
        handler: (data) => {
          return callbackOk(data);
        }
      }]
    });

    await alert.present();
  }
}
