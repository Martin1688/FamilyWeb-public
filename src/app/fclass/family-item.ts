export class FamilyItem {
    familycode: string | undefined;
    familyname: string | undefined;
    name: string | undefined;// user name
    email: string | undefined; //user email
    role: string | undefined;
    paid: string | undefined;//Y/N
    paytype: string | undefined;//Year/Season/Month
    duedate: string | undefined;
}
export class FamilyOne {
    familycode:string='';
    email:string='';
    aName:string='';
    familyName:string='';
}
// { "token": token, 
// "familyname": row.familyname, 
// "familycode": user.familycode, 
// "name": user.name, 
// "email": user.email, 
// "role": row.email === user.email ? "admin" : "user", 
// "paid": "N" }
