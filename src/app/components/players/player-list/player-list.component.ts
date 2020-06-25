import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() playersCount: number;

  constructor(private playersService: PlayersService
    , private router: Router) { }

  ngOnInit() {
    this.playersService.setPlayersCount(this.playersCount);
  }

  playerChange($event: any, pos: number) {
    this.playersService.setPlayer($event.target.value, pos)
  }

  goToResults() {
    if (this.playersService.validateNames()) {
      this.router.navigateByUrl('/results');
    }
  }
}
