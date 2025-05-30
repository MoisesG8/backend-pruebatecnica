CREATE PROCEDURE dbo.sp_AssignCase
  @CasoID INT,
  @FiscalUserID INT,
  @NewAssignmentID INT OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  INSERT INTO dbo.Asignaciones_Casos (CasoID, FiscalUserID, AssignedAt)
  VALUES (@CasoID, @FiscalUserID, SYSUTCDATETIME());

  SET @NewAssignmentID = SCOPE_IDENTITY();
END
go

-- Crea el SP para insertar un nuevo caso y devolver su ID
CREATE PROCEDURE dbo.sp_CreateCase
    @CaseNumber      NVARCHAR(50),
    @Title           NVARCHAR(200),
    @Description     NVARCHAR(MAX)   = NULL,
    @CreatedByUserID INT,
    @CurrentStatusID INT,
    @Priority        TINYINT,
    @NewCaseID       INT             OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Casos
      (CaseNumber, Title, Description, CreatedByUserID, CurrentStatusID, Priority, CreatedAt, UpdatedAt)
    VALUES
      (@CaseNumber, @Title, @Description, @CreatedByUserID, @CurrentStatusID, @Priority,
       SYSUTCDATETIME(), SYSUTCDATETIME());

    SET @NewCaseID = SCOPE_IDENTITY();
END
go

-- 2) Crear el SP para insertar un usuario
CREATE PROCEDURE dbo.sp_CreateUser
  @Username        NVARCHAR(100),
  @PasswordHash    VARBINARY(256),
  @Email           NVARCHAR(150),
  @RoleID          INT,
  @DPI             NVARCHAR(13),
  @PrimerNombre    NVARCHAR(50),
  @SegundoNombre   NVARCHAR(50)  = NULL,
  @PrimerApellido  NVARCHAR(50),
  @SegundoApellido NVARCHAR(50)  = NULL,
  @FechaNacimiento DATE,
  @Telefono        NVARCHAR(8),
  @FiscaliaID      INT,
  @NewUserID       INT           OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  INSERT INTO dbo.Usuarios
    (Username, PasswordHash, Email, RoleID,
     DPI, PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido,
     FechaNacimiento, Telefono, CreatedAt, UpdatedAt, FiscaliaID)
  VALUES
    (@Username, @PasswordHash, @Email, @RoleID,
     @DPI, @PrimerNombre, @SegundoNombre, @PrimerApellido, @SegundoApellido,
     @FechaNacimiento, @Telefono,
     SYSUTCDATETIME(), SYSUTCDATETIME(), @FiscaliaID);

  SET @NewUserID = SCOPE_IDENTITY();
END
go

-- 2) Crear el SP que recupera todos los casos con usuario creador y estado
CREATE PROCEDURE dbo.sp_GetAllCases
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    c.CasoID,
    c.CaseNumber,
    c.Title,
    c.Description,
    c.CreatedByUserID,
    u.Username        AS Username,
    u.PrimerNombre  AS Nombre,
    u.PrimerApellido AS Apellido,
    c.CurrentStatusID,
    s.Name            AS CurrentStatus,
    c.Priority,
    c.CreatedAt,
    c.UpdatedAt
  FROM dbo.Casos c
  JOIN dbo.Usuarios u  ON c.CreatedByUserID  = u.UserID
  JOIN dbo.Estados  s  ON c.CurrentStatusID  = s.EstadoID
  ORDER BY c.CreatedAt DESC;
END
go

-- 2) Crea el SP que recupera casos junto al fiscal asignado (última asignación)
CREATE PROCEDURE dbo.sp_GetAllCasesWithFiscal
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    c.CasoID,
    c.CaseNumber,
    c.Title,
    c.Priority,
    s.Name,
    u.Username AS AssignedFiscal
  FROM dbo.Casos c
  OUTER APPLY
  (
    SELECT TOP 1 ac.FiscalUserID
    FROM dbo.Asignaciones_Casos ac
    WHERE ac.CasoID = c.CasoID
    ORDER BY ac.AssignedAt DESC
  ) AS lastAssign
  LEFT JOIN dbo.Usuarios u
    ON u.UserID = lastAssign.FiscalUserID
  JOIN dbo.Estados  s  ON c.CurrentStatusID  = s.EstadoID
  ORDER BY c.CreatedAt DESC;
END
go

-- 2) Crea el SP que recupera casos junto al fiscal asignado (última asignación)
CREATE PROCEDURE dbo.sp_GetAllCasesWithFiscal
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    c.CasoID,
    c.CaseNumber,
    c.Title,
    c.Priority,
    s.Name,
    u.Username AS AssignedFiscal
  FROM dbo.Casos c
  OUTER APPLY
  (
    SELECT TOP 1 ac.FiscalUserID
    FROM dbo.Asignaciones_Casos ac
    WHERE ac.CasoID = c.CasoID
    ORDER BY ac.AssignedAt DESC
  ) AS lastAssign
  LEFT JOIN dbo.Usuarios u
    ON u.UserID = lastAssign.FiscalUserID
  JOIN dbo.Estados  s  ON c.CurrentStatusID  = s.EstadoID
  ORDER BY c.CreatedAt DESC;
END
go

-- 2) Crea el SP que recupera casos junto al fiscal asignado (última asignación)
CREATE PROCEDURE dbo.sp_GetAllCasesWithFiscal
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    c.CasoID,
    c.CaseNumber,
    c.Title,
    c.Priority,
    s.Name,
    u.Username AS AssignedFiscal
  FROM dbo.Casos c
  OUTER APPLY
  (
    SELECT TOP 1 ac.FiscalUserID
    FROM dbo.Asignaciones_Casos ac
    WHERE ac.CasoID = c.CasoID
    ORDER BY ac.AssignedAt DESC
  ) AS lastAssign
  LEFT JOIN dbo.Usuarios u
    ON u.UserID = lastAssign.FiscalUserID
  JOIN dbo.Estados  s  ON c.CurrentStatusID  = s.EstadoID
  ORDER BY c.CreatedAt DESC;
END
go

CREATE PROCEDURE dbo.sp_GetFiscales
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    u.UserID,
    u.Username,
    u.Email,
    u.DPI,
    u.PrimerNombre,
    u.SegundoNombre,
    u.PrimerApellido,
    u.SegundoApellido,
    u.FechaNacimiento,
    u.Telefono,
    f.Nombre      AS Fiscalia,
    u.CreatedAt,
    u.UpdatedAt
  FROM dbo.Usuarios u
  JOIN dbo.Roles    r ON u.RoleID     = r.RoleID
  JOIN dbo.Fiscalias f ON u.FiscaliaID = f.FiscaliaID
  WHERE r.Name = 'Fiscal'
  ORDER BY u.PrimerApellido, u.PrimerNombre;
END
go


-- Crea el SP que obtiene los datos necesarios para el login
CREATE PROCEDURE dbo.sp_GetUserForLogin
  @Username NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT 
    UserID,
    Username,
    PasswordHash,
    RoleID
  FROM dbo.Usuarios
  WHERE Username = @Username;
END
go

-- 2) Crear el SP que maneja la reasignación con las reglas:
--    • Sólo si Estado = “Pendiente”
--    • Sólo si ambas fiscalías coinciden
--    • Si falla, escribe en LogReasignacionesFallidas
CREATE PROCEDURE dbo.sp_ReassignCase
  @CasoID          INT,
  @NuevoFiscalID   INT,
  @Resultado       NVARCHAR(200) OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE
    @EstadoPendienteID INT,
    @ActualStatusID    INT,
    @AntiguoFiscal     INT,
    @MismaFiscalia     BIT;

  -- a) Obtener el ID de estado “Pendiente”
  SELECT @EstadoPendienteID = EstadoID
  FROM dbo.Estados
  WHERE Name = 'Pendiente';

  IF @EstadoPendienteID IS NULL
  BEGIN
    RAISERROR('No existe el estado Pendiente en la tabla Estados', 16, 1);
    RETURN;
  END

  -- b) Recuperar estado actual y último fiscal asignado
  SELECT TOP 1
    @ActualStatusID = c.CurrentStatusID,
    @AntiguoFiscal  = ac.FiscalUserID
  FROM dbo.Casos c
  JOIN dbo.Asignaciones_Casos ac
    ON ac.CasoID = c.CasoID
  WHERE c.CasoID = @CasoID
  ORDER BY ac.AssignedAt DESC;

  -- c) Verificar que el caso esté en estado Pendiente
  IF @ActualStatusID <> @EstadoPendienteID
  BEGIN
    SET @Resultado = 'Estado no pendiente';
    GOTO LogError;
  END

  -- d) Verificar que ambos fiscales pertenezcan a la misma fiscalía
  SELECT
    @MismaFiscalia = CASE
                       WHEN u1.FiscaliaID = u2.FiscaliaID THEN 1
                       ELSE 0
                     END
  FROM dbo.Usuarios u1
  JOIN dbo.Usuarios u2
    ON u2.UserID = @NuevoFiscalID
  WHERE u1.UserID = @AntiguoFiscal;

  IF @MismaFiscalia = 0
  BEGIN
    SET @Resultado = 'Fiscalía distinta';
    GOTO LogError;
  END

  -- e) Insertar la nueva asignación
  INSERT INTO dbo.Asignaciones_Casos (CasoID, FiscalUserID, AssignedAt)
  VALUES (@CasoID, @NuevoFiscalID, SYSUTCDATETIME());

  SET @Resultado = 'OK';
  RETURN;

  -- f) Etiqueta para el log de error
  LogError:
    INSERT INTO dbo.LogReasignacionesFallidas
      (CasoID, OldFiscalUserID, NewFiscalUserID, IntentoAt, Motivo)
    VALUES
      (@CasoID, @AntiguoFiscal, @NuevoFiscalID, SYSUTCDATETIME(), @Resultado);
END
go

