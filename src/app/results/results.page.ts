import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';
import { AddResultResponse } from '../services/results/generic-results.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  private defaultName = 'player';
  currentPlayer$: Observable<string>;

  constructor(private playersService: PlayersService
    , public alertController: AlertController
    , private utils: UtilsService
    , private router: Router
    , private platform: Platform) { }

  ngOnInit() {
    this.currentPlayer$ = this.playersService.currentPlayer$;
  }

  redirectToPlayers() {
    this.router.navigateByUrl('/players');
  }

  async showAlertResults(pos: number, mode: number) {

    let header = '';
    if (mode == 0) { header = 'Agregar resultado'; }
    else if (mode == 1) { header = 'Agregue el valor a sumar o restar'; }

    const alert = await this.alertController.create({
      header: header,
      inputs: this.createInputs(pos),
      cssClass: 'alert-giraffe',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-giraffe'
      }, {
        text: 'Aceptar',
        cssClass: 'alert-button-giraffe',
        handler: (data) => {
          return this.changeResult(pos, data, mode);
        }
      }]
    });

    await alert.present();
  }

  changeResult(pos: number, data: any, mode: number) {
    if (this.validateData(data)) {

      let response: AddResultResponse;
      if (mode == 0) {
        response = this.playersService.addResult(pos, parseInt(data[this.defaultName]));

        if (!response.status) {
          this.utils.showAlert("Error", response.message);
          return false;
        } else { return true; }
      }
      else if (mode == 1) {
        this.playersService.editResult(pos, parseInt(data[this.defaultName]));
        return true;
      }
    }

    return false;
  }

  validateData(data: any): boolean {

    if (!this.utils.isIntValue(data[this.defaultName])) {
      this.utils.showAlert("Error", "Debe digitar el resultado y debe ser un número entero");
      return false;
    }

    return true;
  }

  createInputs(pos: number) {
    let type = 'tel';
    if (this.platform.is('ios')) {
      type = 'number';
    }

    let input: any[] = new Array();
    input.push(
      {
        name: this.defaultName,
        type: type,
        placeholder: this.playersService.getPlayers()[pos]
      }
    );

    return input;
  }

  removeResults() {
    this.utils.showAlertDecision("Giraffe", "¿Esta seguro de borrar los resultados?", () => {
      this.playersService.removePersistence();
    });
  }

  goBack(){
    this.router.navigateByUrl('/players');
  }
}
