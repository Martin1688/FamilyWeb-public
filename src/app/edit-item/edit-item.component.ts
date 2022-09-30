import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cunsume } from '../fclass/cunsume';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountDataService } from '../fservice/faccount-data.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  @Input() newConsume: Cunsume | undefined;
  @Output() editResult = new EventEmitter<boolean>();
  formError='';
  hgt: string = "62";
  constructor(private authenticationService: AuthenticationService,
    private dataService: FaccountDataService) 
    { 

    }

  ngOnInit() {
    setTimeout(() => {
      this.adjustMemoHeight();
    }, 1000);
    //console.log('additem dedbug');
  }
  adjustMemoHeight() {
    const elMemo = document.getElementById('memo');
    const meDim = elMemo!.getBoundingClientRect();
    this.hgt = meDim.height.toString();

  }

  onEditSubmit() {
    let errMsg = '';
    if (this.newConsume!.itemName === '') {
      errMsg += "名稱未填;"
    }
    if (this.newConsume!.price === '') {
      errMsg += "價錢未填;"
    }
    if (this.newConsume!.cyear === '') {
      errMsg += "買年未填;"
    }
    if (this.newConsume!.cmonth === '') {
      errMsg += "買月未填;"
    }
    if (this.newConsume!.cday === '') {
      errMsg += "買日未填;"
    }
    if (errMsg !== '') {
      this.formError = errMsg;
      return;
    }
    this.dataService.editAccount(this.newConsume!)
      .subscribe((response) => {
        // console.log(response);
        const ressult = response as {message:string};
        if (ressult.message == 'Updated') {
          this.editResult.emit(true);
        } else {
          this.formError = ressult.message;
        }
      })

    
  }
  public isLoggedIn(): boolean {

    return this.authenticationService.isLoggedIn();
  }
  editCancel(){
    this.editResult.emit(false);
  }

  hidedError(){
   this.formError='';
  }
}
