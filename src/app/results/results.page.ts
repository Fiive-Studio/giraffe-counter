import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  constructor(private playersService: PlayersService
    , private router: Router) { }

  ngOnInit() {
    console.log(this.playersService.getCount().length);
    if (this.playersService.getCount().length > 0) {
      this.playersService.setResult([0, 1]);
      this.playersService.setResult([0, 2]);
      this.playersService.setResult([3, 5]);
    }
  }

  redirectToPlayers() {
    this.router.navigateByUrl('/players');
  }

}
