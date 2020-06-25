import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() players: string[];
  count: number[];

  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this.count = new Array<number>(this.players.length);
  }

  playerChange($event: any, pos: number) {
    this.players[pos] = $event.target.value;
  }

  validateNames(): boolean {
    for (let x = 0; x < this.players.length; x++) {
      if (this.utils.isNullOrEmpty(this.players[x])) {
        this.utils.showAlert("Error", "Debe digitar todos los nombres de los jugadores");
        return false;
      }
    }
  }

}
