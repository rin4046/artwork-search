import { Component, h, Prop } from '@stencil/core';
import { loadingController } from '@ionic/core';
import { nanoid } from 'nanoid';

@Component({
  tag: 'app-artworks',
  styleUrl: 'app-artworks.css',
  shadow: true,
})
export class AppArtworks {
  @Prop() keyword: string;
  #data = [];
  #baseUrl: URL;
  #params = {
    country: 'JP',
    entity: 'album',
    limit: '48',
  };

  constructor() {
    this.#baseUrl = new URL('https://itunes.apple.com/search');
    for (const key in this.#params) {
      this.#baseUrl.searchParams.append(key, this.#params[key]);
    }
  }

  async getFromApi(url) {
    const loading = await loadingController.create({ message: '読み込み中…' });
    loading.present();

    const res = await fetch(url);
    const json = await res.json();

    loading.dismiss();
    return json.results;
  }

  componentWillUpdate() {
    const url = new URL(this.#baseUrl.href);
    url.searchParams.append('term', this.keyword);
    url.searchParams.append('_', nanoid(8));
    return this.getFromApi(url.href).then(data => {
      this.#data = data;
    });
  }

  render() {
    return this.#data.map(item => {
      return <app-artworks-item url={item.artworkUrl100} name={item.collectionName}></app-artworks-item>;
    });
  }
}
