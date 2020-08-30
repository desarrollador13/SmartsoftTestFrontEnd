import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ServiciosEndpointService } from './servicios/servicios-endpoint.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend'
  formGroup: FormGroup;
  formOrden:FormGroup
  valueTable:string|any
  idPrincipal:number|any
  listDataId:Array<any>|any = []
  listData:Array<any>|any = []
  listTable:Array<any>|any = []
  listDataTable:Array<any>|any = []
  resDataTable:Array<any>|any = []
  valorActual:string|any
  private dataItemTable:object|any={}
  private editForm:boolean=false
  private res:[]|any
  private editedRowIndex: number
  private valTable:string|any
  public gridState:State={
    sort: [],
    skip: 0,
    take: 10
  };

  submitted:boolean = false
  grupo:object|any = []
  cargo:[]|any =[]
  errorFormulario:boolean = false
  msg:string|any = ""
  private ejecutar:boolean = false
  private parametros:Array<any> = []


  constructor(private formBuilder: FormBuilder,
  	private serviciosEndpointService: ServiciosEndpointService){
  	//[Validators.required, Validators.minLength(10)]
  	this.formOrden = this.formBuilder.group({
      grupo: ['', Validators.required],
      cargo : ['', Validators.required],
      nombre : ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  async ngOnInit() {
    //obtenergrupos
    await this.obtenerListado()
  }

  /**OBTENER VALORES DROPDOWNLIST**/
  public obtenerListado() {
    this.limpiarVariables()
    console.log('func obtenerListado')
  	this.serviciosEndpointService.getData('getTables/')
  	.toPromise().then(data => {
        this.res = data
        //this.listTable = this.res.rows//Object.keys(this.res)
        for(let [key, value] of Object.entries(this.res.rows)){
          let v:any = value
          this.listTable.push(v.Name)
          this.listDataId.push(v.Id)
        }
        this.valueTable = this.listTable[0]
        this.idPrincipal = this.listDataId[0]
        this.valorActual = this.valueTable
        this.obtenerTable()
      })
  }

  public obtenerTable(){
    console.log('func obtenerTable')
    this.serviciosEndpointService.getData('getTableDetail/')
    .toPromise().then(data => {
        this.res = data
         console.log('%**%*%',this.res,'%**%*%')
        let rowData = this.res.rows.find((e)=>{
          if(e.Id == this.idPrincipal){
            return e
          }
        })
        this.listData = rowData.columns//Object.keys(this.res)
      })
    this.obtenerData()
  }

  /**OBTENER VALORES TABLA MOSTRAR**/
  public obtenerData(){
    console.log('func obtenerData')
    this.serviciosEndpointService.getData('Data/')
    .toPromise().then(data => {
      this.resDataTable = data
      console.log('***%',this.res,'***%')
      let rowData = this.resDataTable.rows.find((e)=>{
        console.log(e,'eeeeeeeee')
        if(e.id_t == this.idPrincipal){
        return e
      }
       })
      console.log(rowData,'rowData')
      this.listDataTable = rowData.data//Object.keys(this.res)
    })
  }

  public limpiarVariables(){
    this.listDataTable = []
    this.listData = []
    this.listTable = []
    this.listDataId = []
    this.valueTable = ''
    this.idPrincipal = null
    this.res = []
    this.resDataTable = []
  }

  get f() {
    return this.formOrden.controls;
  }

  /***METODO EDITAR FORMULARIO ******/
  public async editHandler({sender, rowIndex, dataItem}) {
    console.log('func editHandler')
    console.log('****',sender, '****', rowIndex, '****', dataItem,'****')
    this.closeEditor(sender)
    this.editForm = true
    let data:object|any={}
    if(this.listData[0].header.indexOf("T1") > -1){
      this.valTable='TableData1'
      data=await this.formTable1Edit(dataItem)
    }
    if(this.listData[0].header.indexOf("T2") > -1){
      this.valTable='TableData2'
      data=await this.formTable2Edit(dataItem)
    }
    if(this.listData[0].header.indexOf("T3") > -1){
      this.valTable='TableData3'
      data=await this.formTable3Edit(dataItem)
    }
    this.editedRowIndex = rowIndex
    sender.editRow(rowIndex, this.formGroup)
  }

  /**METODO GUARDAR**/
  public async saveHandler({sender, rowIndex, formGroup, isNew}) {
    console.log('func saveHandler')
    let form:object|any={}
    form=formGroup.value
    form['table']=this.valTable
    if(this.editForm){
      form['dato1']=this.dataItemTable.dato1
      form['dato2']=this.dataItemTable.dato2
      form['dato3']=this.dataItemTable.dato3
      this.serviciosEndpointService.updateData('updateTables/',form).toPromise().then(data => {
        let res:object|any = data
        if(res.code == 200){
          this.dataItemTable={}
          //this.obtenerListado()
        }else {
          this.errorFormulario = true
          this.msg = res.msg
        }
      })

    }else{
      this.serviciosEndpointService.saveData('saveTables/',form).toPromise().then(data => {
        let res:object|any = data
        if(res.code == 200){
          //this.obtenerListado()
        }else {
          this.errorFormulario = true
          this.msg = res.msg
        }
      })
    }
    setTimeout(()=>{
      this.recargarDatos()
      sender.closeRow(rowIndex)
    },300)
    
  }

  /***Recargar Datos ***/
  public async recargarDatos(){
    console.log('func recargarDatos')
    this.serviciosEndpointService.getData('Data/')
    .toPromise().then(data => {
      this.resDataTable = []
      this.listDataTable = []
      this.resDataTable = data
      let dataNew = this.resDataTable.rows.find((e)=>{
        if(e.name == this.valorActual){
            return e
        }
      })
      this.listDataTable = dataNew.data
      console.log('kkk',this.listData,this.listDataTable,'kkkkk')
      })
  }
  //customer$.subscribe(val => console.log('subscriber 1: ' + val));

  /***NUEVO CREAR FORMULARIO GUARDAR***/
  public addHandler({sender}) {
    console.log('func addHandler')
    this.closeEditor(sender)
    this.editForm=false
    let data:object|any={}
    console.log('indexof',this.listData[0].header.indexOf("T1"))
    if(this.listData[0].header.indexOf("T1") > -1){
      this.valTable='TableData1'
      data=this.formTable1()
    }
    if(this.listData[0].header.indexOf("T2") > -1){
      this.valTable='TableData2'
      data=this.formTable2()
    }
    if(this.listData[0].header.indexOf("T3") > -1){
      this.valTable='TableData3'
      data=this.formTable3()
    }
    sender.addRow(this.formGroup);
  }

  /***CANCELA LAS ACCIONES***/
  public cancelHandler({sender, rowIndex}) {
    console.log('func cancelHandler')
    this.editForm = false
    this.dataItemTable = {}
    this.closeEditor(sender, rowIndex);
  }

  /****ELIMINAR DATOS***/
  public removeHandler({dataItem}) {
    let table:string=''
    let params1:number|any
    let params2:string=''
    let params3:number|any
    if(dataItem.Table.indexOf("1") > -1){
      params1=dataItem.T1C1
      params2=dataItem.T1C2
      params3=dataItem.T1C3
      table='TableData1'
    }
    if(dataItem.Table.indexOf("2") > -1){
      params1=dataItem.T2C1
      params2=dataItem.T2C2
      params3=dataItem.T2C3
      table='TableData2'
    }
     if(dataItem.Table.indexOf("3") > -1){
      params1=dataItem.T3C1
      params2=dataItem.T3C2
      params3=dataItem.T3C3
      table='TableData3'
    }
    this.serviciosEndpointService.removeData(`deleteTables/${params1}/${params2}/${table}/`).toPromise().then(data => {
      let res:object|any = data
      if(res.code == 200){
        //this.obtenerListado()
      }else {
        this.errorFormulario = true
        this.msg = res.msg
      }
      setTimeout(()=>{
        this.recargarDatos()
      },300)
    })
  }

  /***CANCELA LA ACCION A REALIZAR***/
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    console.log('closeEditor')
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  /***EVENTO CAMBIA LOS VALORES CON DROPDOWNLIST***/
  public selectionChange(value: any): void {
    console.log('func selectionChange')
    this.editForm = false
    this.listDataTable = []
    this.listData = []
    this.valorActual = value
    let dataNew = this.resDataTable.rows.find((e)=>{
      if(e.name == value){
          return e
      }
    })
    let dataNews = this.res.rows.find((e)=>{
      if(e.name == value){
          return e
      }
    })
    this.listData = dataNews.columns
    this.listDataTable = dataNew.data
  }

  /***CREACION DE FORMULARIO N1***/
  public formTable1(){
    this.formGroup = new FormGroup({
      'T1C1': new FormControl('', Validators.required),
      'T1C2': new FormControl('', Validators.required),
      'T1C3': new FormControl(''),
      'T1C4': new FormControl('')
    });
    return this.formGroup
  }

  /***CREACION DE FORMULARIO N2***/
  public formTable2(){
    this.formGroup = new FormGroup({
      'T2C1': new FormControl('', Validators.required),
      'T2C2': new FormControl(''),
      'T2C3': new FormControl(''),
      'T2C4': new FormControl('', Validators.required),
      'T2C5': new FormControl('', Validators.required)
    });
    return this.formGroup
  }

  /***CREACION DE FORMULARIO N3***/
  public formTable3(){
    this.formGroup = new FormGroup({
      'T3C1': new FormControl('', Validators.required),
      'T3C2': new FormControl(''),
      'T3C3': new FormControl('')
    });
    return this.formGroup
  }


  /***CREACION DE FORMULARIO N1***/
  public formTable1Edit(dataItem:object|any){
    this.dataItemTable = {
      'dato1':dataItem.T1C1,
      'dato2':dataItem.T1C2,
      'dato3':dataItem.T1C3
    }
    this.formGroup = new FormGroup({
      'T1C1': new FormControl(dataItem.T1C1, Validators.required),
      'T1C2': new FormControl(dataItem.T1C2, Validators.required),
      'T1C3': new FormControl(dataItem.T1C3),
      'T1C4': new FormControl(dataItem.T1C4)
    });
    return this.formGroup
  }

  /***CREACION DE FORMULARIO N2***/
  public formTable2Edit(dataItem:object|any){
    this.dataItemTable = {
      'dato1':dataItem.T2C1,
      'dato2':dataItem.T2C2,
      'dato3':dataItem.T2C3
    }
    this.formGroup = new FormGroup({
      'T2C1': new FormControl(dataItem.T2C1, Validators.required),
      'T2C2': new FormControl(dataItem.T2C2),
      'T2C3': new FormControl(dataItem.T2C3),
      'T2C4': new FormControl(dataItem.T2C4, Validators.required),
      'T2C5': new FormControl(dataItem.T2C5, Validators.required)
    });
    return this.formGroup
  }

  /***CREACION DE FORMULARIO N3***/
  public formTable3Edit(dataItem:object|any){
    this.dataItemTable = {
      'dato1':dataItem.T3C1,
      'dato2':dataItem.T3C2,
      'dato3':dataItem.T3C3
    }
    this.formGroup = new FormGroup({
      'T3C1': new FormControl(dataItem.T3C1, Validators.required),
      'T3C2': new FormControl(dataItem.T3C2),
      'T3C3': new FormControl(dataItem.T3C3)
    });
    return this.formGroup
  }

}
