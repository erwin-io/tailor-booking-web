import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Snackbar } from '../../../../../../app/core/ui/snackbar';
import { MyErrorStateMatcher } from '../../../../../core/form-validation/error-state.matcher';
import { AlertDialogModel } from '../../../../../../app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from '../../../../../../app/shared/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../../../app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../../../../app/core/model/role.model';
import { RoleService } from '../../../../../../app/core/services/role.service';
import {COMMA, ENTER, N} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { Staff } from '../../../../../../app/core/model/staff.model';
import { StorageService } from '../../../../../../app/core/storage/storage.service';
import { NavItem } from 'src/app/core/model/nav-item';
import { menu } from 'src/app/core/model/menu';
import { Customer } from 'src/app/core/model/customer.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserComponent implements OnInit, AfterViewChecked  {

  currentUserId:string;
  userData: Staff|Customer;
  staffUserRoleIds:string[] = [];
  userForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isLoading = false;
  isProcessing = false;
  isLoadingRoles = false;
  //roles
  roles:Role[] = [];
  selectedRoles:string[] = [];
  error;
  //auto complete chips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredRoles: Observable<string[]>;
  //end
  //access
  allowedAccess:string[] = [];

  @ViewChild('roleInput', {static:false}) roleInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: Snackbar,
    private storageService: StorageService,
    private readonly changeDetectorRef: ChangeDetectorRef
    ) {
      this.currentUserId = this.storageService.getLoginUser().userId;
      const userId = this.route.snapshot.paramMap.get("userId");
      if(this.currentUserId === userId){
        this.snackBar.snackbarError("Invalid user, Cannot edit this user!");
        this.router.navigate(['/security/users/']);
      }
      this.userForm = this.formBuilder.group({
        name: new FormControl(''),
        firstName: new FormControl(''),
        middleName: new FormControl(''),
        lastName: new FormControl(''),
        genderId: new FormControl('', [Validators.required]),
        birthDate: new FormControl(''),
        email: new FormControl('',
        Validators.compose(
            [Validators.email, Validators.required])),
        mobileNumber: ['',
            [Validators.minLength(11),Validators.maxLength(11), Validators.pattern("^[0-9]*$"), Validators.required]],
        address: ['', Validators.required],
        roleId : [''],
      });
      this.initUser(userId);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit(): void {

  }

  async initUser(userId:string){
    this.isLoading = true;
    this.isProcessing = true;
    this.isLoadingRoles = true;
    await this.initRoles();
    try{
      await this.userService.getById(userId)
      .subscribe(async res => {
        if (res.success) {
          this.userData = res.data;
          this.isLoading = false;
          this.isProcessing = false;
          if(res.data.user.userType.userTypeId === '1'){
            this.userForm.controls['name'].addValidators([Validators.required]);
            const role = this.roles.filter(x=>x.roleId === res.data.user.role.roleId)[0];
            this.userData.user.role = role;
            this.userForm.controls['roleId'].setValidators([Validators.required]);
            this.userForm.controls['birthDate'] = new FormControl('');
            this.userForm.controls['address'] = new FormControl('');
          }
          else if(res.data.user.userType.userTypeId === '2'){
            this.userForm.controls['firstName'].addValidators([Validators.required]);
            this.userForm.controls['lastName'].addValidators([Validators.required]);
            this.userForm.controls['address'].addValidators([Validators.required]);
            this.userForm.controls['birthDate'] = new FormControl(new Date(res.data.birthDate), [Validators.required]);
            this.userForm.controls['roleId'] = new FormControl('');
          }
          this.isLoading = false;
          this.isProcessing = false;
          this.isLoadingRoles = false;
        } else {
          this.isLoading = false;
          this.isProcessing = false;
          this.isLoadingRoles = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.snackbarError(this.error);
          if(this.error.toLowerCase().includes("not found")){
            this.router.navigate(['/security/users/']);
          }
        }
      }, async (err) => {
        this.isLoading = false;
        this.isProcessing = false;
        this.isLoadingRoles = false;
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.snackbarError(this.error);
        if(this.error.toLowerCase().includes("not found")){
          this.router.navigate(['/security/users/']);
        }
      });
    }
    catch(e){
      this.isLoading = false;
      this.isProcessing = false;
      this.isLoadingRoles = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
      if(this.error.toLowerCase().includes("not found")){
        this.router.navigate(['/security/users/']);
      }
    }
  }

  async initRoles(){
    try{
      const res = await this.roleService.get().toPromise();
      this.roles = res.data;
    }catch(e){
      this.isLoading = false;
      this.isProcessing = false;
      this.isLoadingRoles = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
    }
  }

  get f() { return this.userForm.controls; }
  get formIsValid() { return this.userForm.valid }
  get formData() { return { ...this.userForm.value, userId: this.userData.user.userId }  }
  get accessToDisplay():NavItem[] {
    const access: NavItem[] = [];
    const selectedRole = this.roles.filter(x=>x.roleId === this.formData.roleId);
    const selectedAccess = selectedRole !== undefined && selectedRole[0] !== undefined && selectedRole[0].access ? selectedRole[0].access.split(",") : [];
    if(selectedAccess.length === 0) {return []};
    menu.forEach(element => {
      if(element.isParent && element.children.length > 0) {
        element.children.forEach(c=>{
          if(selectedAccess.some(a=>a===c.displayName)){
            access.push(c);
          }
        })
      }
      else if(selectedAccess.some(x=> !element.isParent && x === element.displayName)){
        access.push(element);
      }
    });
    return access;
  }

  async onSubmit(){
    if (this.userForm.invalid) {
        return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save role?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color:'primary'
    }
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel'
    }
    const dialogRef = this.dialog.open(AlertDialogComponent, {
        maxWidth: '400px',
        closeOnNavigation: true
    })
    dialogRef.componentInstance.alertDialogConfig = dialogData;

    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try{
        this.isProcessing = true;
        const userData = this.formData;
        if(Number(this.userData.user.userType.userTypeId) === 1) {
          await this.userService.updateStaff(userData)
            .subscribe(async res => {
              if (res.success) {
                this.snackBar.snackbarSuccess('Saved!');
                this.router.navigate(['/security/users/details/' + res.data.user.userId]);
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                dialogRef.close();
              } else {
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                this.error = Array.isArray(res.message) ? res.message[0] : res.message;
                this.snackBar.snackbarError(this.error);
                dialogRef.close();
              }
            }, async (err) => {
              this.isProcessing = false;
              dialogRef.componentInstance.isProcessing = this.isProcessing;
              this.error = Array.isArray(err.message) ? err.message[0] : err.message;
              this.snackBar.snackbarError(this.error);
              dialogRef.close();
            });
        } else {
          await this.userService.updateCustomer(userData)
            .subscribe(async res => {
              if (res.success) {
                this.snackBar.snackbarSuccess('Saved!');
                this.router.navigate(['/security/users/details/' + res.data.user.userId]);
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                dialogRef.close();
              } else {
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                this.error = Array.isArray(res.message) ? res.message[0] : res.message;
                this.snackBar.snackbarError(this.error);
                dialogRef.close();
              }
            }, async (err) => {
              this.isProcessing = false;
              dialogRef.componentInstance.isProcessing = this.isProcessing;
              this.error = Array.isArray(err.message) ? err.message[0] : err.message;
              this.snackBar.snackbarError(this.error);
              dialogRef.close();
            });
        }
      } catch (e){
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.snackbarError(this.error);
        dialogRef.close();
      }
    });
  }
  getError(key:string){
    return this.f[key].errors;
  }
}
