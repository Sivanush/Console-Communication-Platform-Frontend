import { Component, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MainSidebarComponent } from "../main-sidebar/main-sidebar.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServerService } from '../../../../service/server/server.service';
import { MenuItem } from 'primeng/api';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { TreeModule } from 'primeng/tree';
import { IServer } from '../../../../interface/server/serverDetails';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InviteUserModalComponent } from "../invite-user-modal/invite-user-modal.component";
import { environment } from '../../../../../environments/environment.prod';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { CreateChannelComponent } from '../create-channel/create-channel.component';

interface TreeNode {
  label: string;
  children: ChannelNode[];
  expanded: boolean;
}

interface ChannelNode {
  _id: string;
  label: string;
  type: 'text' | 'voice' | 'video';
}


@Component({
    selector: 'app-server-sidebar',
    standalone: true,
    templateUrl: './server-sidebar.component.html',
    styleUrl: './server-sidebar.component.scss',
    imports: [MainSidebarComponent, TreeModule, FormsModule, CommonModule, AsyncPipe, RouterLink, MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule, InviteUserModalComponent],
    providers:[ {provide: MatDialogRef, useValue:{}},{ provide: MAT_DIALOG_DATA, useValue: {} },]
})
export class ServerSidebarComponent {
  @Output() toggleChat = new EventEmitter<boolean>()
  @Output() channelSelected = new EventEmitter<string>();

  server: IServer = {
    name: '',
    _id: '',
    image: '',
    owner: '',
    id: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
    categories: []
  }
  treeData: TreeNode[] = [];
  items: MenuItem[] | undefined;
  serverId!:string
  showModal = false;
  inviteLink = environment.domain+'/invite/';
  expiresAt: Date | null = null;

  constructor(private route: ActivatedRoute, private serverService: ServerService,private dialog: MatDialog) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serverId'] && changes['serverId'].currentValue) {
      this.loadServerDetails(changes['serverId'].currentValue);
    }
  }



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serverId = params['serverId']
      this.loadServerDetails(this.serverId);
    })

  }


  generateInviteCode(){
    this.serverService.generateInviteLink(this.serverId).subscribe({
      next: (response) => {
        console.log(response);
        this.inviteLink = this.inviteLink + response.inviteCode
        this.expiresAt = new Date(response.expireDate);
          this.dialog.open(InviteUserModalComponent, {
            width: '400px',
            data: {
              inviteLink: this.inviteLink,
              expiresAt: this.expiresAt
            },
            panelClass: 'invite-dialog'
          });
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

  createCategory(){
    this.dialog.open(CreateCategoryComponent, {
      width: '400px',
      data: {
        serverId: this.serverId,
      },
      panelClass: 'invite-dialog'
    });
  }

  createChannel(){
    this.dialog.open(CreateChannelComponent, {
      width: '400px',
      data: {
        serverId: this.serverId,
      },
      panelClass: 'invite-dialog'
    });
  }

  closeModal() {
    this.showModal = false;
  }


  onChannelClick(channel: ChannelNode) {
    if (channel.type === 'text') {
      this.toggleChat.emit(true);
      this.channelSelected.emit(channel._id);
    } else {
      this.toggleChat.emit(false);
      this.channelSelected.emit(channel._id);
    }
  }


  loadServerDetails(serverId: string) {
    this.serverService.getServerDetails(serverId).subscribe({
      next: (response) => {
        this.server = response;
        this.treeData = this.transformServerToTreeData(this.server);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  transformServerToTreeData(server: IServer): TreeNode[] {
    return server.categories.map(category => ({

      label: category.name,
      expanded: true,
      children: category.channels.map(channel => ({
        label: channel.name,
        type: channel.type, 
        _id: channel._id
      }))
    }));
  }


  toggleCategory(category: TreeNode) {
    category.expanded = !category.expanded;
  }

  
}
