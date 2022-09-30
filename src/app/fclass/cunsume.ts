export class Cunsume {
    _id:string | undefined;
    familycode:string | undefined;
    useremail:string | undefined;
    itemName: string | undefined;
    price: string | undefined;
    memo: string | undefined;
    cyear:string | undefined;
	cmonth:string | undefined;
	cday:string | undefined;
	itemtype:string | undefined;
	locate:string | undefined;
	shop:string | undefined;
    constructor(fCode:string,uMail:string){
        const nowDate: String = new String(new Date().toLocaleString());
        const dateAry = nowDate.substring(0, nowDate.indexOf(' ')).split('/');
        this._id= '',
        this.familycode= fCode,
        this.useremail= uMail,
        this.itemName= '',
        this.price= '',
        this.memo= '',
        this.cyear= dateAry[0],
        this.cmonth= dateAry[1],
        this.cday= dateAry[2],
        this.itemtype= '',
        this.locate= '',
        this.shop= ''    
    }
    reset(){
        const nowDate: String = new String(new Date().toLocaleString());
        const dateAry = nowDate.substring(0, nowDate.indexOf(' ')).split('/');
        this._id= '',
        // this.familycode= '',
        // this.useremail= '',
        this.itemName= '',
        this.price= '',
        this.memo= '',
        this.cyear= dateAry[0],
        this.cmonth= dateAry[1],
        this.cday= dateAry[2],
        this.itemtype= '',
        this.locate= '',
        this.shop= ''      
    }
}

