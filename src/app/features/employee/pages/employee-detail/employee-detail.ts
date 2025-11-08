import { MdlInput } from './../../../../shared/components/mdl/mdl-input/mdl-input';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeDetailModel } from '../../../../core/models/app/employee/bussiness';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MdlSelect } from '../../../../shared/components/mdl/mdl-select/mdl-select';
import { MdlDatepicker } from '../../../../shared/components/mdl/mdl-datepicker/mdl-datepicker';
import { IconsModule } from '../../../../icons.module';

@Component({
  selector: 'app-employee-detail',
  imports: [MatTabsModule, ReactiveFormsModule, MdlInput, CommonModule, TranslateModule, MdlSelect, MdlDatepicker, IconsModule],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss',
})
export class EmployeeDetail implements OnInit {
  public model: EmployeeDetailModel = new EmployeeDetailModel();
  editForm!: FormGroup;

  public lstGender = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' }
  ]

  lstPosition = [
    { id: 1, name: 'Software Engineer' },
    { id: 2, name: 'Product Manager' },
    { id: 3, name: 'HR Specialist' }
  ];
  
  lstDepartment = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Marketing' }
  ];

  lstProvince = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Marketing' }
  ];

  lstCommune = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Marketing' }
  ];

  lstNationality = [
    { id: 1, name: 'Vietnamese' },
    { id: 2, name: 'American' },
    { id: 3, name: 'British' }
  ];

  lstReligion = [
    { id: 1, name: 'Buddhism' },
    { id: 2, name: 'Christianity' },
    { id: 3, name: 'Islam' }
  ];

  lstStatus = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' }
  ];

  constructor(private formBuilder: FormBuilder, public translate: TranslateService) {
    this.editForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      positionId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      facebook: [''],
      linkedin: [''],
      sizeClother: [''],
      nationality: [''],
      religion: [''],
      bankAccount: [''],
      bankName: [''],
      bankBranch: [''],
      baseSalary: [''],
      allowances: [''],
      onboardDate: [''],
      offboardDate: [''],
      status: [''],
      hometownProvinceId: [''],
      hometownCommuneId: [''],
      hometownDetail: [''],
      temporaryAddressCommuneId: [''],
      temporaryAddressProvinceId: [''],
      temporaryAddressDetail: [''],
      permanentAddressCommuneId: [''],
      permanentAddressProvinceId: [''],
      permanentAddressDetail: [''],

      // education
      degree: [''],
      institution: [''],
      major: [''],
      graduationYear: [''],

      // infor
      nationalId: ['', Validators.required],
      nationalCreatedDate: ['', Validators.required],
      nationalAddress: ['', Validators.required],
      maritalStatus: [''],
      emergencyContact: ['', Validators.required]

    });
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  // Method to switch language
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
