enum IncomeBracket {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum Regoin{
    Regoin1 = 'Regoin1',
    Regoin2 = 'Regoin2',
    Regoin3 = 'Regoin3',
    Regoin4 = 'Regoin4',
    Regoin5 = 'Regoin5',
    Regoin6 = 'Regoin6',
    Regoin7 = 'Regoin7',
    Regoin8 = 'Regoin8',
    Regoin9 = 'Regoin9',
    Regoin10 = 'Regoin10',
}

enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
}

enum EducationLevel {
    HIGH_SCHOOL = 'high_school',
    ASSOCIATE_DEGREE = 'associate_degree',
    BACHELORS_DEGREE = 'bachelors_degree',
    MASTERS_DEGREE = 'masters_degree',
    DOCTORATE = 'doctorate',
}

enum EmploymentStatus {
    EMPLOYED = 'employed',
    UNEMPLOYED = 'unemployed',
    SELF_EMPLOYED = 'self_employed',
    RETIRED = 'retired',
}

export interface Customer {
    customer_id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    age: number;
    gender: string;
    income_bracket: IncomeBracket;
    country: string;
    region: Regoin;
    phone_number: string;
    marital_status: MaritalStatus;
    education_level: EducationLevel;
    employment_status: EmploymentStatus;
    created_at: Date;
    updated_at: Date;
}

export interface CreateCustomer extends Omit<Customer, "customer_id"> {}
export interface UpdateCustomer extends Partial<CreateCustomer> {}