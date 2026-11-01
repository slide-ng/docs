import {Component, input} from '@angular/core';
import siteConfig from '../../ngmd.config';

@Component({
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.html',
})
export class SponsorList {
  readonly size = input(60);
  readonly showNames = input(false);
  protected readonly sponsors = siteConfig.sponsors ?? [];
}
