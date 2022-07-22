/*
(C) Copyright 2015–2022 Potsdam Institute for Climate Impact Research (PIK), authors, and contributors, see AUTHORS file.

This file is part of vodle.

vodle is free software: you can redistribute it and/or modify it under the 
terms of the GNU Affero General Public License as published by the Free 
Software Foundation, either version 3 of the License, or (at your option) 
any later version.

vodle is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
A PARTICULAR PURPOSE. See the GNU Affero General Public License for more 
details.

You should have received a copy of the GNU Affero General Public License 
along with vodle. If not, see <https://www.gnu.org/licenses/>. 
*/

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import * as venn from 'venn.js'
import * as d3 from 'd3'

import { environment } from '../../environments/environment';
import { GlobalService } from "../global.service";
import { PollPage } from '../poll/poll.module';  

const svgcolors = {
  "vodlered": "#d33939",
  "vodleblue": "#3465a4",
  "vodlegreen": "#62a73b",
  "vodledarkgreen": "#4c822e"
};

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements OnInit {

  @Input() P: PollPage;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  Array = Array;
  Math = Math;
  Object = Object;
  window = window;
  document = document;
  environment = environment;
  JSON = JSON;

  page = "analysis";

  // LIFECYCLE:

  constructor(
      public translate: TranslateService,
      private modalController: ModalController,
      public G: GlobalService) {
    this.G.L.entry("AnalysisPage.constructor");
  }

  ngOnInit() {
    this.G.L.entry("AnalysisPage.ngOnInit");
  }

  ionViewWillEnter() {
    this.G.L.entry("AnalysisPage.ionViewWillEnter");
    this.G.D.page = this;
  }

  ionViewDidEnter() {
    this.G.L.entry("AnalysisPage.ionViewDidEnter");
    this.show_venn();
  }

  onDataReady() {
    this.G.L.entry("AnalysisPage.onDataReady");
  }

  onDataChange() {
    this.G.L.entry("AnalysisPage.onDataChange");
  }

  ionViewWillLeave() {
    this.G.L.entry("AnalysisPage.ionViewWillLeave");
  }

  ionViewDidLeave() {
    this.G.L.entry("AnalysisPage.ionViewDidLeave");
  }

  // UI:

  close() {
    this.modalController.dismiss();
  }

  // logics:

  show_venn() {
    // 1. filter oids with positive share in descending score order (at most 10 many):
    const T = this.P.p.T,
          shares_map = T.shares_map,
          our_oids = [],
          colors = [];
    for (const [i, oid] of T.oids_descending.entries()) {
      if (i == 10) {
        break;
      }
      if (shares_map.has(oid) && shares_map.get(oid) > 0) {
        our_oids.push(oid);
        // set to same color as slider:
        colors.push(this.P.slidercolor[oid]);
      }
    }
    this.G.L.info("colors", colors, svgcolors[colors[0]]);
    // 2. count how many approve each possible exact combination:
    const exact_combi_counts= {},
          approvals_map = T.approvals_map,
          chars = "abcdefghij";
    for (const vid of this.P.p.T.all_vids_set) {
      let combi = "";
      for (const [i, oid] of our_oids.entries()) {
        const amo = approvals_map.get(oid);
        if (amo.has(vid) && amo.get(vid)) {
          combi += chars[i];
        }
      }
      if (combi in exact_combi_counts) {
        exact_combi_counts[combi] += 1;
      } else {
        exact_combi_counts[combi] = 1;
      }
    }
    this.G.L.info("exact_combi_counts", exact_combi_counts);
    // 3. count how many approve at least each possible combination:
    const subset_counts = {};
    for (const [combi, size] of Object.entries(exact_combi_counts)) {
      const l = combi.length, n_subsets = 1 << l;
      for (let mask = 1; mask < n_subsets; mask++) {
        let subset = "";
        for (let i = 0; i < l; i++) {
          if( (mask & (1 << i)) !== 0){
            subset += combi[i];
          }
        }
        if (subset in subset_counts) {
          subset_counts[subset] += size;
        } else {
          subset_counts[subset] = size;
        }  
      }      
    }
    this.G.L.info("subset_counts", subset_counts);
    // 4. convert to array of objects of arrays as needed by venn.js:
    const sets_array = []; 
    for (const [i, oid] of Object.entries(our_oids)) {
      sets_array.push({ sets: [chars[i]], size: subset_counts[chars[i]], label: this.P.p.options[oid].name });
    }
    for (const [subset, size] of Object.entries(subset_counts)) {
      if (subset.length > 1) {
        sets_array.push({ sets: [...subset], size: size });
      }
    }
    sets_array.reverse(); // so that topmost option is painted last
    var chart = venn.VennDiagram();
    d3.select("#venn").datum(sets_array).call(chart);
    d3.selectAll("#venn .venn-circle path")
    // lower options appear successively paler:
    .style("fill-opacity", function(d, i) { return .9 - .09 * (our_oids.length - 1 - i); })
    .style("fill", function(d, i) { return svgcolors[colors[our_oids.length - 1 - i]]; })
    .style("stroke-width", 1)
    .style("stroke-opacity", 1)
    .style("stroke", "white");
    d3.selectAll("#venn .venn-circle text")
    .style("fill", "white")
    .style("font-size", "16px");
}
}
