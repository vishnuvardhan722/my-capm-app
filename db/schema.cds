namespace my.bookshop;

entity Books {
  key ID           : UUID;  // Unique identification for books
      title        : String;
      author       : String;
      stock        : Integer;
      name         : String;
      age          : Integer;
      email        : String;
      PhoneNumber  : String;  // Changed from Integer to String
      address      : String;
      gender       : String;

      Projects     : Composition of many Project on Projects.Employee_ID = $self;
}

entity Project {
    key ID          : UUID;  // Unique identification for projects
    Employee_ID     : Association to Books;  // Association to Books by ID
    ProjectName     : String;
    ProjectLocation : String;
}
