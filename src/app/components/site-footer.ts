import {Component} from '@angular/core';
import {GithubIcon} from '../ui/github-icon';
import {DiscordIcon} from '../ui/discord-icon';
import siteConfig from '../../ngmd.config';

@Component({
  selector: 'app-site-footer',
  imports: [GithubIcon, DiscordIcon],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  readonly year = new Date().getFullYear();
  readonly sponsorUrl = siteConfig.site.links?.sponsor;
  readonly discordUrl = siteConfig.site.links?.discord;
  readonly githubUrl = siteConfig.site.githubUrl;
  readonly repoLabel = this.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '');
}
