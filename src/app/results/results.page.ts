import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

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

  async showAlertResults(pos: number) {

    const alert = await this.alertController.create({
      header: 'Agregar resultado',
      inputs: this.createInputs(pos),
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      }, {
        text: 'Aceptar',
        handler: (data) => {
          return this.addResult(pos, data);
        }
      }],
      cssClass: 'alert-style'
    });

    await alert.present();
  }

  addResult(pos: number, data: any) {
    if (this.validateData(data)) {
      let response = this.playersService.addResult(pos, parseInt(data[this.defaultName]));
      if (!response.status) {
        this.utils.showAlert("Error", response.message);
        return false;
      } else { return true; }
    }

    return false;
  }

  validateData(data: any): boolean {

    if (this.utils.isNullOrEmpty(data[this.defaultName])) {
      this.utils.showAlert("Error", "Debe digitar el resultado y debe ser numérico");
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
}
