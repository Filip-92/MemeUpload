import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BanModalComponent } from 'src/app/modals/ban-modal/ban-modal.component';
import { RemoveUserComponent } from 'src/app/modals/remove-user/remove-user.component';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any;
  bsModalRef: BsModalRef;
  banUserForm: FormGroup;
  validationErrors: string[] = [];
  photo: Photo;
  url: string;
  userSearchForm: FormGroup;

  constructor(private adminService: AdminService, private modalService: BsModalService, 
    private modalServ: NgbModal, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
    this.initializeUserForm();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
          user.roles = [...rolesToUpdate.roles]
        })
      }
    })
  }

  initializeUserForm() {
    this.userSearchForm= this.fb.group({
      searchString: ['']
    })
  }

  searchForUser(searchString: string) {
    this.adminService.searchForUser(searchString.toLowerCase()).subscribe(response => {
      this.users = response;
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'}
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }

  openRemoveUserModal(username: string) {
    const modalRef = this.modalServ.open(RemoveUserComponent);
    modalRef.componentInstance.username = username;
    modalRef.componentInstance.modalRef = modalRef;
  }

  openBanModal(username: string) {
    const modalRef = this.modalServ.open(BanModalComponent);
    modalRef.componentInstance.username = username;
    modalRef.componentInstance.modalRef = modalRef;
  }

  unbanUser(username: string) {
    this.adminService.unbanUser(username).subscribe(() => {
      this.users.splice(this.users.findIndex(p => p.username === username), 1);
      this.toastr.success('Pomyślnie zdjęto bana z użytkownika ' + username);
    })
  }

  getUserPhoto(id: number) {
    this.adminService.getUserPhoto(id).subscribe(photo => {
      if (photo.url !== null) {
        this.url = photo.url;
      } else {
        this.url = null;
      }
    })
  }

}