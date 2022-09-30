import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operate-doc',
  templateUrl: './operate-doc.component.html',
  styleUrls: ['./operate-doc.component.css']
})
export class OperateDocComponent implements OnInit {
  pdfSrc="../../assets/Doc/家庭記帳操作說明.pdf";
  constructor() { }

  ngOnInit(): void {
  }

}
