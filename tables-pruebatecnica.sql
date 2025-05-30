create table dbo.Estados
(
    EstadoID    int identity
        primary key,
    Name        nvarchar(50) not null,
    Description nvarchar(200)
)
go

create table dbo.Fiscalias
(
    FiscaliaID int identity
        primary key,
    Nombre     nvarchar(100) not null
)
go

create table dbo.Permisos
(
    PermisoID   int identity
        primary key,
    Name        nvarchar(50) not null,
    Description nvarchar(200)
)
go

create table dbo.Roles
(
    RoleID      int identity
        primary key,
    Name        nvarchar(50) not null,
    Description nvarchar(200)
)
go

create table dbo.Permisos_Rol
(
    RoleID    int not null
        constraint FK_PR_Roles
            references dbo.Roles,
    PermisoID int not null
        constraint FK_PR_Permisos
            references dbo.Permisos,
    constraint PK_Permisos_Rol
        primary key (RoleID, PermisoID)
)
go

create table dbo.Usuarios
(
    UserID          int identity
        primary key,
    Username        nvarchar(100)                      not null
        unique,
    PasswordHash    varbinary(256)                     not null,
    Email           nvarchar(150)                      not null,
    RoleID          int                                not null
        constraint FK_Usuarios_Roles
            references dbo.Roles,
    DPI             nvarchar(13)                       not null
        constraint UQ_Usuarios_DPI
            unique,
    PrimerNombre    nvarchar(50)                       not null,
    SegundoNombre   nvarchar(50),
    PrimerApellido  nvarchar(50)                       not null,
    SegundoApellido nvarchar(50),
    FechaNacimiento date                               not null,
    Telefono        nvarchar(8)                        not null
        constraint UQ_Usuarios_Telefono
            unique,
    CreatedAt       datetime2 default sysutcdatetime() not null,
    UpdatedAt       datetime2 default sysutcdatetime() not null,
    FiscaliaID      int                                not null
        constraint FK_Usuarios_Fiscalias
            references dbo.Fiscalias
)
go

create table dbo.Casos
(
    CasoID          int identity
        primary key,
    CaseNumber      nvarchar(50)                       not null
        unique,
    Title           nvarchar(200)                      not null,
    Description     nvarchar(max),
    CreatedByUserID int                                not null
        constraint FK_Casos_Usuarios
            references dbo.Usuarios,
    CurrentStatusID int                                not null
        constraint FK_Casos_Estados
            references dbo.Estados,
    Priority        tinyint                            not null,
    CreatedAt       datetime2 default sysutcdatetime() not null,
    UpdatedAt       datetime2 default sysutcdatetime() not null
)
go

create table dbo.Asignaciones_Casos
(
    AsignacionID int identity
        primary key,
    CasoID       int                                not null
        constraint FK_Asign_Casos_Casos
            references dbo.Casos,
    FiscalUserID int                                not null
        constraint FK_Asign_Casos_Usuarios
            references dbo.Usuarios,
    AssignedAt   datetime2 default sysutcdatetime() not null
)
go

create table dbo.Historial_Estados
(
    HistoryID       int identity
        primary key,
    CasoID          int                                not null
        constraint FK_Hist_Casos
            references dbo.Casos,
    FromStatusID    int                                not null
        constraint FK_Hist_FromEstados
            references dbo.Estados,
    ToStatusID      int                                not null
        constraint FK_Hist_ToEstados
            references dbo.Estados,
    ChangedByUserID int                                not null
        constraint FK_Hist_ChangedBy
            references dbo.Usuarios,
    ChangedAt       datetime2 default sysutcdatetime() not null,
    Notes           nvarchar(max)
)
go

create table dbo.LogReasignacionesFallidas
(
    LogID           int identity
        primary key,
    CasoID          int                                not null
        constraint FK_LogReasig_Casos
            references dbo.Casos,
    OldFiscalUserID int                                not null
        constraint FK_LogReasig_OldUser
            references dbo.Usuarios,
    NewFiscalUserID int                                not null
        constraint FK_LogReasig_NewUser
            references dbo.Usuarios,
    IntentoAt       datetime2 default sysutcdatetime() not null,
    Motivo          nvarchar(200)                      not null
)
go

