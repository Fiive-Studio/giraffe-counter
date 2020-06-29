import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  private inputs: any[];
  private defaultName = 'player';

  constructor(private playersService: PlayersService
    , public alertController: AlertController
    , private utils: UtilsService
    , private router: Router) { }

  ngOnInit() {
  }

  redirectToPlayers() {
    this.router.navigateByUrl('/players');
  }

  async showAlertResults() {

    this.createInputs();
    const alert = await this.alertController.create({
      header: 'Giraffe',
      message: 'Agregar resultados',
      inputs: this.inputs,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: 'Aceptar',
        handler: (data) => {
          return this.addResults(data);
        }
      }],
      cssClass: 'alert-style'
    });

    await alert.present();
  }

  addResults(data: any) {
    if (this.validateData(data)) {

      let newResults = new Array<number>();
      for (let x = 0; x < this.playersService.getCount().length; x++) {
        newResults.push(data[this.defaultName + x.toString()]);
      }

      this.playersService.addResults(newResults);
      return true;
    }

    return false;
  }

  validateData(data: any): boolean {
    for (let x = 0; x < this.playersService.getCount().length; x++) {

      if (this.utils.isNullOrEmpty(data[this.defaultName + x.toString()])) {
        this.utils.showAlert("Error", "Debe digitar los resultados de todos los jugadores y deben ser numéricos");
        return false;
      }
    }

    return true;
  }

  createInputs() {
    if (this.inputs === undefined) {

      this.inputs = new Array(this.playersService.getCount().length);
      let players = this.playersService.getPlayers();

      for (let x = 0; x < players.length; x++) {
        this.inputs.push(
          {
            name: this.defaultName + x.toString(),
            type: 'number',
            placeholder: players[x]
          }
        );
      }
    }
  }
}
