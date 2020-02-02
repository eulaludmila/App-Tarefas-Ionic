import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  

  constructor(private alertCtrl:AlertController, private toastCtrl: ToastController, 
  private actionController: ActionSheetController) {
    
    if(localStorage.getItem('tasksDb')){
      this.tasks = JSON.parse(localStorage.getItem('tasksDb'))
    }
    
  }

  

  async showAdd(){
      
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name:'taskToDo',
          type:'text',
          placeholder:'nome'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {

            //passando somente o valor da input
            this.add(form.taskToDo);
          }
        }
      ]
    });

    await alert.present();
  
  }

  async add(taskToDo:string){

    //se o valor do input estiver vazio
    if (taskToDo.trim().length < 1){

      //aparecerá um toast de aviso
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'middle'
      });

      toast.present();
      return;
    }

    //se der tudo certo, itá adicionar a task no array
    let task = {name:taskToDo, done: false};

    this.tasks.push(task);

    this.updateLocalStorage();
  }

  async openActions(task : any) {
    console.log(task)
    const actionsSheet = await this.actionController.create({
      header: "O QUE VOCÊ DESEJA FAZER?",
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {

          //lógica de se o tiver false, fica true e assim vice-versa
          task.done = !task.done

          this.updateLocalStorage();
        }
      },
      {
        text:'Cancelar',
        icon:'close'
      }
    ],
    })

    await actionsSheet.present()
  }

  delete = (task : any) => {
    this.tasks = this.tasks.filter(taskArray => task != taskArray);


    this.updateLocalStorage();
  }

  updateLocalStorage = () => {
    localStorage.setItem('tasksDb', JSON.stringify(this.tasks));
  }

}

