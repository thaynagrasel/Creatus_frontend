// user-table.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'level', 'actions'];
  editUser: any = {};
  showEditPanel = false;

  constructor(private userService: UserService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  openUserForm(): void {
    this.router.navigate(['/user-form']);
  }

  openEditPanel(user: any): void {
    this.editUser = { ...user }; // Faz uma cópia do usuário para edição
    this.showEditPanel = true;
  }

  closeEditPanel(): void {
    this.showEditPanel = false;
  }

  saveUser(): void {
    if (this.validateForm()) {
      if (this.editUser.password !== this.editUser.confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }

      // Implemente a lógica para salvar o usuário aqui
      this.userService.updateUser(this.editUser.id, this.editUser).subscribe({
        next: () => {
          console.log('Usuário editado:', this.editUser);
          this.loadUsers(); // Recarrega a lista de usuários após edição
          this.closeEditPanel();
        },
        error: (err) => {
          console.error('Erro ao editar usuário:', err);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  validateForm(): boolean {
    return (
      this.editUser.name &&
      this.editUser.email &&
      this.editUser.level &&
      this.editUser.password &&
      this.editUser.confirmPassword
    );
  }

  deleteUser(user: any): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u !== user);
      }
    });
  }
}
