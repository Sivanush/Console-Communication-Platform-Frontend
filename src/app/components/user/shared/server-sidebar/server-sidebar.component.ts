import { Component, EventEmitter, HostListener, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MainSidebarComponent } from "../main-sidebar/main-sidebar.component";
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ServerService } from '../../../../service/server/server.service';
import { MenuItem } from 'primeng/api';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { TreeModule } from 'primeng/tree';
import { IChannel, IServer } from '../../../../interface/server/serverDetails';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InviteUserModalComponent } from "../invite-user-modal/invite-user-modal.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { Subscription } from 'rxjs';
import { ICategory } from '../../../../interface/server/categories';
import { environment } from '../../../../../environments/environment';
import { FriendSidebarToggleService } from '../../../../service/friend-sidebar-toggle/friend-sidebar-toggle.service';

interface TreeNode {
  _id: string
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
  imports: [MainSidebarComponent, TreeModule, FormsModule, CommonModule, AsyncPipe, RouterLink, MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule, InviteUserModalComponent, RouterLinkActive],
  providers: [{ provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} },]
})
export class ServerSidebarComponent {
  @Output() toggleChat = new EventEmitter<boolean>(false)
  @Output() toggleVideo = new EventEmitter<boolean>(false)
  @Output() toggleAudio = new EventEmitter<boolean>(false)
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
    categories: [],
    role: [],
    channelId: ''
  }
  treeData: TreeNode[] = [];
  items: MenuItem[] | undefined;
  serverId!: string
  showModal = false;
  inviteLink = environment.domain + '/invite/';
  expiresAt: Date | null = null;
  subscription!: Subscription;
  serverOptions:boolean = false
  sidebarOpen: boolean  = false;

  constructor(private route: ActivatedRoute, private serverService: ServerService, private dialog: MatDialog, private router: Router,private sidebarToggleService:FriendSidebarToggleService) {}


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.sidebar, #toggle-icon');
    if (!clickedInside && this.sidebarOpen) {
      this.sidebarOpen = false; 
      this.sidebarToggleService.closeSidebar()
    }
  }

 @HostListener('window:popstate', ['$event'])
 onBackButtonEvent() {
   if (this.sidebarOpen) {
     this.closeSidebar();
   }
 }


 closeSidebar() {
  this.sidebarToggleService.closeSidebar();
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

    this.subscription = this.route.params.subscribe(params => {
      const channelId = params['channelId']
      if (channelId) {
        this.loadChannelDetails(channelId);
      }
    })

    this.subscription = this.sidebarToggleService.sidebarState$.subscribe((state) => {
      this.sidebarOpen = state;

      console.log(state,'the value emitted')
    });


  }

  toggleServerOptions(){
    this.serverOptions = !this.serverOptions
  }


  loadChannelDetails(channelId: string) {
    this.serverService.getChannelDetail(channelId).subscribe(channelDetails => {
      if (channelDetails.channelDetail.type === 'text') {
        this.toggleChat.emit(true);
        this.toggleAudio.emit(false);
        this.toggleVideo.emit(false);
      } else if (channelDetails.channelDetail.type === 'video') {
        this.toggleChat.emit(false);
        this.toggleAudio.emit(false);
        this.toggleVideo.emit(true);
      } else if (channelDetails.channelDetail.type === 'voice') {
        this.toggleChat.emit(false);
        this.toggleAudio.emit(true);
        this.toggleVideo.emit(false);
      } else {
        this.toggleChat.emit(false);
        this.toggleAudio.emit(false);
        this.toggleVideo.emit(false);
      }
    }); 
  }


  generateInviteCode() {
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
      error: (err) => {
        console.log(err);

      }
    })
  }

  createCategory() {
    const Dialog = this.dialog.open(CreateCategoryComponent, {
      width: '400px',
      data: {
        serverId: this.serverId,
      },
      panelClass: 'invite-dialog'
    });

    Dialog.componentInstance.categoryCreated.subscribe((newCategory: ICategory) => {
      this.addNewCategory(newCategory)
    })
  }


  addNewCategory(newCategory: ICategory) {
    const newTreeNode = {
      _id: newCategory._id,
      label: newCategory.name,
      expanded: true,
      children: []
    }
    this.treeData = [...this.treeData, newTreeNode]
  }



  createChannel(categoryId?: string) {
    const Dialog = this.dialog.open(CreateChannelComponent, {
      width: '400px',
      data: {
        serverId: this.serverId,
        categoryId: categoryId
      },
      panelClass: 'invite-dialog'
    });

    Dialog.componentInstance.channelCreated.subscribe((newChannel: IChannel) => {
      this.addNewChannel(newChannel)
    })
  }


  addNewChannel(newChannel: IChannel) {
    console.log('❌❌❌');

    console.log(newChannel);

    const categoryIndex = this.treeData.findIndex(category => category._id == newChannel.category)
    if (categoryIndex > -1) {
      this.treeData[categoryIndex].children.push({
        _id: newChannel._id,
        label: newChannel.name,
        type: newChannel.type,
      })
    }
    this.treeData = [...this.treeData]
  }

  closeModal() {
    this.showModal = false;
  }


  onChannelClick(channel: ChannelNode) {
    if (channel.type === 'text') {
      this.toggleChat.emit(true);
      this.toggleVideo.emit(false);
      this.channelSelected.emit(channel._id);
    } else if (channel.type === 'video') {
      this.toggleVideo.emit(true);
      this.toggleChat.emit(false);
      this.channelSelected.emit(channel._id);
    } else {
      this.toggleVideo.emit(false);
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
      _id: category._id,
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

  // redirectToMembers(){
  //   this.router.navigate([]);
  // }

}
