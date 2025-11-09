export class EmployeeDetailModel {
  id?: number;
  code?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailCompany?: string;
  dob?: Date;
  phone?: string;
  gender?: string;
  departmentId?: number;
  departmentName?: string;
  positionId?: number;
  positionName?: string;
  nationality?: string; // quoc gia
  religion?: string; // ton giao
  status?: string; // active , inactive
  onboardDate?: Date;
  offboardDate?: Date;
  baseSalary?: number;
  allowances?: number;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  facebook?: string;
  linkedin?: string;
  sizeClother?: string;
  hometownCommuneId?: number; // quê quán
  hometownProvinceId?: number; // quê quán
  hometownDetail?: string; // quê quán
  temporaryAddressCommuneId?: number; // tạm trú
  temporaryAddressProvinceId?: number; // tạm trú
  temporaryAddressDetail?: string; // tạm trú
  permanentAddressCommuneId?: number; // thường trú
  permanentAddressProvinceId?: number; // thường trú
  permanentAddressDetail?: string; // thường trú
  avatarUrl?: string;

  // education
  degree?: string;
  institution?: string;
  major?: string;
  graduationYear?: number;

  // infor
  nationalId?: string;
  nationalCreatedDate?: Date;
  nationalAddress?: string;
  maritalStatus?: string;
  emergencyContact?: string;

  // experience
  companyName?: string;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  responsibilities?: string;

  techstack?: TechstackAndLevel[];
}

export class TechstackAndLevel {
  techstackId?: number;
  levelId?: number;
}
