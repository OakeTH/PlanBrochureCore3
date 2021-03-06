USE [ew.dev]
GO
DROP PROCEDURE IF EXISTS [oak].[sqlservices]
GO
DROP FUNCTION IF EXISTS [oak].[YearMonth]
GO
DROP FUNCTION IF EXISTS [oak].[substr]
GO
DROP FUNCTION IF EXISTS [oak].[Split]
GO
DROP FUNCTION IF EXISTS [oak].[removejsonmakeup]
GO
DROP FUNCTION IF EXISTS [oak].[numericonly]
GO
DROP FUNCTION IF EXISTS [oak].[dBE]
GO
DROP FUNCTION IF EXISTS [oak].[d108BE]
GO
DROP FUNCTION IF EXISTS [oak].[d108]
GO
DROP FUNCTION IF EXISTS [oak].[d103e]
GO
DROP FUNCTION IF EXISTS [oak].[d103BEe]
GO
DROP FUNCTION IF EXISTS [oak].[d103BE]
GO
DROP FUNCTION IF EXISTS [oak].[d103]
GO
DROP FUNCTION IF EXISTS [oak].[d]
GO
DROP FUNCTION IF EXISTS [oak].[countParticularChar]
GO
DROP FUNCTION IF EXISTS [oak].[comma00]
GO
DROP FUNCTION IF EXISTS [oak].[comma]
GO
DROP FUNCTION IF EXISTS [oak].[BE_TO_AD]
GO
DROP FUNCTION IF EXISTS [oak].[add0]
GO
DROP FUNCTION IF EXISTS [oak].[AD_TO_BE]
GO
DROP SCHEMA IF EXISTS [oak]
GO
CREATE SCHEMA [oak]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[AD_TO_BE](  @P_Value date)		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS

BEGIN	

  IF(YEAR(@P_Value)< 2500)BEGIN  
    RETURN  DATEADD(year, +543, @P_Value)
  END ELSE BEGIN
    RETURN @P_Value
  END 
    RETURN @P_Value

END

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Pachara Khawtong
-- Create date: 14/10/2014
-- Description:	Validate Invoice No
-- EXEC  [dbo].[fn_validate_InvNo] '0' 
-- =============================================
CREATE FUNCTION [oak].[add0]( @P_Value VARCHAR(20),@Digit as smallint)		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS
BEGIN
	
	RETURN  RIGHT('0000000'+CAST(@P_Value AS VARCHAR(20)),@Digit);
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[BE_TO_AD](  @P_Value date)		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS

BEGIN	

  IF(YEAR(@P_Value)> 2500)BEGIN  
    RETURN  DATEADD(year, -543, @P_Value)
  END ELSE BEGIN
    RETURN @P_Value
  END 

    RETURN @P_Value

END

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[comma](  @P_Value VARCHAR(20))		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS

BEGIN
    RETURN REPLACE(CONVERT(VARCHAR(20),CAST(  ISNULL(@P_Value,0) AS MONEY),1),'.00','');

END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Pachara KhawtongT
-- Create date: 14/10/2014
-- Description:	Validate Invoice No
-- EXEC  [dbo].[fn_validate_InvNo] '0' 
-- =============================================
CREATE FUNCTION [oak].[comma00](  @P_Value VARCHAR(20))		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS
BEGIN
   RETURN CONVERT(VARCHAR,CAST(ISNULL(@P_Value,0) AS MONEY),1) ;

END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Pachara Khawtong
-- Create date: 14/10/2014
-- Description:	Validate Invoice No
-- EXEC  [dbo].[fn_validate_InvNo] '0' 
-- =============================================
CREATE FUNCTION [oak].[countParticularChar](  @P_Value VARCHAR(500),@ParticularChar VARCHAR(5))		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS
BEGIN

    SET @P_Value = len(@P_Value) - len(replace(@P_Value,',',''))
	
	RETURN @P_Value;
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d](  @P_Value date)		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS

BEGIN	
   RETURN CONVERT(varchar(20),@P_Value,103) 
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d103](  @P_Value varchar(20))		
RETURNS DATE WITH EXECUTE AS CALLER
AS BEGIN 
	IF @P_Value='' BEGIN
		RETURN NULL
	END
	RETURN CONVERT(date,@P_Value,103) 
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d103BE](  @P_Value varchar(20))		
RETURNS datetime WITH EXECUTE AS CALLER
AS

BEGIN	
	IF(@P_Value IS NULL OR @P_Value ='') BEGIN
	   RETURN @P_Value
	END

	DECLARE @date DATETIME = CONVERT(date,@P_Value,103) 
	IF(YEAR(@date)> 2500)BEGIN  
		RETURN DATEADD(year, -543, @date);
	END ELSE BEGIN
		RETURN @date;
	END 

	RETURN @date;
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d103BEe](  @P_Value varchar(20))		
RETURNS datetime WITH EXECUTE AS CALLER
AS

BEGIN	
	IF(@P_Value IS NULL OR @P_Value ='') BEGIN
	   RETURN @P_Value
	END

	DECLARE @date DATETIME;
    SET @date =  CAST(CAST(oak.d103(@P_Value)AS varchar(20)) + ' 23:59:59' AS DATETIME);	

	IF(YEAR(@date)> 2500)BEGIN  
		RETURN DATEADD(year, -543, @date);
	END ELSE BEGIN
		RETURN @date;
	END 

	RETURN @date;
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d103e](  @P_Value varchar(20))		
RETURNS datetime WITH EXECUTE AS CALLER
AS

BEGIN	

	IF(@P_Value IS NULL OR @P_Value ='') BEGIN
	   RETURN @P_Value
	END

	DECLARE @date DATETIME;
    SET @date =  CAST(CAST(oak.d103(@P_Value)AS varchar(20)) + ' 23:59:59' AS DATETIME);	

	RETURN @date;
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d108](  @P_Value DATEtime)		
RETURNS VARCHAR(20) WITH EXECUTE AS CALLER
AS

BEGIN	
    RETURN oak.d(@P_Value) + ' '+ SUBSTRING(convert(varchar,@P_Value,108),1,5)
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[d108BE](  @P_Value DATEtime)		
RETURNS VARCHAR(20) WITH EXECUTE AS CALLER
AS

BEGIN	
    RETURN oak.d(DATEADD(YEAR,+543 ,@P_Value)) + ' '+ SUBSTRING(convert(varchar,@P_Value,108),1,5)

END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[dBE](  @P_Value date)		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS

BEGIN	
   RETURN CONVERT(varchar(20),DATEADD(year, +543, @P_Value),103) 
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [oak].[numericonly]( @Value VARCHAR(30))		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS
BEGIN
	SET  @Value = REPLACE(@Value,',','')
	SET  @Value = LEFT(SUBSTRING(@Value, PATINDEX('%[0-9.-]%',@Value), 8000),PATINDEX('%[^0-9.-]%', SUBSTRING(@Value, PATINDEX('%[0-9.-]%',@Value), 8000) + 'X') -1)
	IF @Value='' BEGIN 
		RETURN 0
	END ELSE BEGIN
		RETURN @Value
	END

  RETURN @Value 
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Pachara Khawtong
-- Create date: 27/04/2018
-- Description:	Remove json makup character
-- EXEC  [dbo].[fn_validate_InvNo] '0' 
-- =============================================
CREATE FUNCTION [oak].[removejsonmakeup]( @P_Value VARCHAR(3000))		
RETURNS VARCHAR(3000) WITH EXECUTE AS CALLER
AS
BEGIN
	
	RETURN   REPLACE(REPLACE(REPLACE(@P_Value,'[',''),']',''),'"','')
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [oak].[Split]
( @TextForSplit varchar(1000)
, @SplitWith	varchar(5) = ','
)		
RETURNS  @DataSource TABLE 
(
    ID  TINYINT identity,
    [Value] VARCHAR(500) NOT NULL
)
AS
BEGIN
		DECLARE @XML xml = N'<r><![CDATA[' + REPLACE(@TextForSplit, @SplitWith, ']]></r><r><![CDATA[') + ']]></r>'
		INSERT INTO @DataSource ([Value])
		SELECT RTRIM(LTRIM(T.c.value('.', 'NVARCHAR(128)')))
		FROM @xml.nodes('//r') T(c)
		
		DELETE @DataSource WHERE [VALUE] = ''
		RETURN

END


	--	select * FROM F.Split('dfsdfsdfsdf,^23423423424234,^d3e32e23232(*&*(),^324234$#$#$#fdgf,^^^',',^')
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE FUNCTION [oak].[substr](@If varchar(10) = '' , @P_Value VARCHAR(100),@charIndex as varchar(10))		
RETURNS VARCHAR(100) WITH EXECUTE AS CALLER
AS BEGIN

	SET @If = LOWER(@If);
	SET @If =CASE WHEN @If ='l' THEN 'left' 
				  WHEN @If ='r' THEN 'right'
				  ELSE @If 
			 END 

	DECLARE @RETURN_VALUE VARCHAR(100);

   IF @If = 'left' BEGIN
		SET @RETURN_VALUE=  LEFT(@P_Value, CASE WHEN CHARINDEX(@charIndex,@P_Value,1) = 0 
												THEN LEN(@P_Value) 
												ELSE CHARINDEX(@charIndex,@P_Value,1)-1 END  );

	END ELSE IF @If = 'right' BEGIN
		SET @RETURN_VALUE =  RIGHT(@P_Value, CASE WHEN CHARINDEX(@charIndex,@P_Value,1) = 0 
												  THEN   LEN(@P_Value) 
												  ELSE  CHARINDEX(REVERSE(@charIndex),REVERSE(@P_Value),1)-1	END  );

	END
	
	RETURN @RETURN_VALUE

END


 --	select f.substr('r','aaaaaaaaaab2cccccc','b2')
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Pachara Khawtong
-- Create date: 14/10/2014
-- Description:	Validate Invoice No
-- EXEC  [dbo].[fn_validate_InvNo] '0' 
-- =============================================
CREATE FUNCTION [oak].[YearMonth]()		
RETURNS VARCHAR(25) WITH EXECUTE AS CALLER
AS
BEGIN

	RETURN  CAST(Right(Year(getDate()),2) AS char(2))  +  oak.add0(CAST(MONTH(GETDATE()) AS varchar(2)),2)  
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


--		exec oak.sqlservices @if='Get_table_types_columns' ,@tablename = 'mail.AddressForSend'

CREATE PROCEDURE [oak].[sqlservices]( 
	 @If varchar(50) =''
	,@TableName    varchar(100) =''
	,@Select		varchar(500)=''
	,@Form			varchar(500)=''
	,@Where01		varchar(500)='' 
)
AS BEGIN SET NOCOUNT ON; 

	DECLARE  @TABLE_SCHEMA   AS varchar(50)=''
	DECLARE  @Tabel01_L AS varchar(100)=''
			,@Keyword_R AS varchar(100)='';

	SET @If   =  UPPER(RTRIM(@If));


	SET @TABLE_SCHEMA =  CASE WHEN  @TableName LIKE '%.%'
						      THEN  OAK.substr('left',@TableName,'.')
							  ELSE  'DBO'
						 END
	SET @TableName    =  OAK.substr('right',RTRIM(@TableName),'.');	


					 
	IF @If = 'P' BEGIN-->>----------------- Parametor of stored ------------------------------------------------------------------------------------->
		SELECT  CASE WHEN Number >1 
					 THEN ',' + D 
					 ELSE ' ' + D
				END
		FROM(	SELECT ROW_NUMBER()OVER(ORDER BY ORDINAL_POSITION) AS Number  , D  ,ORDINAL_POSITION
				FROM( SELECT REPLACE(C,'^',' ') AS D ,ORDINAL_POSITION
					  FROM(	SELECT  A+ REPLICATE('^',35-LEN(A+'^'+B) - 11 + LEN(B)    ) + B AS C ,ORDINAL_POSITION
							FROM(	SELECT '@' + COLUMN_NAME AS A, DATA_TYPE + 
											CASE WHEN DATA_TYPE = 'int'
												 THEN ''
												 WHEN DATA_TYPE LIKE '%char'
												 THEN '('+ CAST(CHARACTER_MAXIMUM_LENGTH AS varchar(10)) + ')'
												 WHEN DATA_TYPE = 'decimal'
												 THEN '('+ CAST(NUMERIC_PRECISION		 AS varchar(10)) + ',' +CAST(NUMERIC_SCALE AS varchar(10))+')'
												 WHEN DATA_TYPE = 'date'
												 THEN ''
												 WHEN DATA_TYPE = 'datetime'
												 THEN ''
												 WHEN DATA_TYPE = 'bit'
												 THEN ''
												 ELSE ''
											END AS B
											,ORDINAL_POSITION
									FROM INFORMATION_SCHEMA.COLUMNS
									WHERE TABLE_NAME  = @TableName  AND COLUMN_NAME NOT IN ('id','ID')
									AND   TABLE_SCHEMA = @TABLE_SCHEMA
								)AS TMP01 ) AS TMP02 ) AS TMP03 ) AS TMP04 ORDER BY ORDINAL_POSITION


	END ELSE IF @If IN('I','INSERT') BEGIN-->>----------------- To Insert ---------------------------------------------------------------------------------------->

		IF OBJECT_ID('tempdb..#TmpBaseColumn') IS NOT NULL BEGIN
			DROP TABLE #TmpBaseColumn
		END
		IF OBJECT_ID('tempdb..#TmpOutput') IS NOT NULL BEGIN
			DROP TABLE #TmpOutput
		END

		SELECT   (ROW_NUMBER() OVER(ORDER BY ORDINAL_POSITION)-1) /5 AS Num  ,COLUMN_NAME AS ColName
		INTO     #TmpBaseColumn
		FROM	 INFORMATION_SCHEMA.COLUMNS
		WHERE	 TABLE_NAME  =  @TableName
		AND       TABLE_SCHEMA = @TABLE_SCHEMA
		AND      UPPER(COLUMN_NAME) <> 'ID'
		ORDER BY ORDINAL_POSITION

		CREATE TABLE #TmpOutput(
		   OutputCol varchar(5000),
		   LineNumber INT
		);
		CREATE TABLE #TmpOutput_2(
		   OutputCol varchar(5000),
		   LineNumber INT
		);
		
		 UPDATE  #TmpBaseColumn SET ColName ='['+ ColName +']' WHERE UPPER(ColName) IN('TYPE','NAME','DATE','YEAR','Period')

		 DECLARE @Num INT
		 DECLARE Cursor001 CURSOR FOR  
		 SELECT Num FROM #TmpBaseColumn GROUP BY Num
		 OPEN   Cursor001 FETCH NEXT FROM Cursor001 INTO @Num
		 WHILE @@fetch_status = 0  BEGIN    

				DECLARE  @OutputPerLine varchar(5000)='' ,@OutputPerLine_2 varchar(5000)='';
				--   >>-------- Column Name ---------->
				SELECT   @OutputPerLine +=  ','+ ColName + REPLICATE(' ', 20 - LEN(ColName))
				FROM	 #TmpBaseColumn
				WHERE    Num = @Num;

				INSERT #TmpOutput
				SELECT @OutputPerLine , @Num;
				--   >>-------- Values --------------->

				SELECT   @OutputPerLine_2 +=  ',@'+ ColName + REPLICATE(' ', 19 - LEN(ColName))
				FROM	 #TmpBaseColumn
				WHERE    Num = @Num;

				INSERT #TmpOutput_2
				SELECT @OutputPerLine_2 , @Num;


			    FETCH NEXT FROM Cursor001 INTO @Num;
		END 
		CLOSE Cursor001 DEALLOCATE Cursor001;

		DECLARE @LineNumberMax INT = (SELECT MAX(LineNumber) FROM #TmpOutput);

		SELECT OutputCol,LineNumberAll
		FROM (	SELECT CASE WHEN LineNumber = 0 
							THEN REPLACE('INSERT '+ @TABLE_SCHEMA +'.' + @TableName + ' (' + RTRIM(OutputCol) ,'(,','(') 
							WHEN LineNumber = @LineNumberMax
							THEN REPLICATE(' ',8+ LEN(@TABLE_SCHEMA+'.'+@TableName)) +RTRIM(OutputCol) + ')'
							ELSE REPLICATE(' ',8+ LEN(@TABLE_SCHEMA+'.'+@TableName)) +RTRIM(OutputCol) 
							END AS OutputCol
					 ,ROW_NUMBER() OVER(ORDER BY LineNumber) AS LineNumberAll
				FROM #TmpOutput
				UNION
				SELECT CASE WHEN LineNumber = 0
							THEN 'SELECT'+  REPLICATE(' ',2 + LEN(@TABLE_SCHEMA+'.'+@TableName) )+ STUFF(OutputCol,1,1,' ')
							ELSE REPLICATE(' ',8 + LEN(@TABLE_SCHEMA+'.'+@TableName) ) +RTRIM(OutputCol) 
							END AS OutputCol
					   ,99 + ROW_NUMBER() OVER(ORDER BY LineNumber) AS LineNumberAll
				FROM #TmpOutput_2 ) AS A ORDER BY LineNumberAll

	END ELSE IF @If IN ('U','UPDATE') BEGIN-->>----------------- To Update ---------------------------------------------------------------------------------->
		 
		IF OBJECT_ID('tempdb..#TmpBaseColumn2') IS NOT NULL BEGIN
			DROP TABLE #TmpBaseColumn2
		END
		IF OBJECT_ID('tempdb..#TmpOutput2') IS NOT NULL BEGIN
			DROP TABLE #TmpOutput2
		END	
		SELECT   (ROW_NUMBER() OVER(ORDER BY COLUMN_NAME)-1) /5 AS Num  ,COLUMN_NAME AS ColName
		INTO     #TmpBaseColumn2
		FROM	 INFORMATION_SCHEMA.COLUMNS
		WHERE	 TABLE_NAME  =@TableName
		AND      UPPER(COLUMN_NAME) <> 'ID'
	
		UPDATE  #TmpBaseColumn2 SET ColName ='['+ ColName +']' WHERE UPPER(ColName) IN('TYPE','NAME','DATE','YEAR','Period');

		CREATE TABLE #TmpOutput2(
		   OutputCol varchar(5000),
		   LineNumber INT
		);
		 DECLARE @Num2 INT
		 DECLARE Cursor002 CURSOR FOR  
		 SELECT Num FROM #TmpBaseColumn2 GROUP BY Num
		 OPEN   Cursor002 FETCH NEXT FROM Cursor002 INTO @Num2
		 WHILE @@fetch_status = 0  BEGIN    
				DECLARE  @OutputPerLine2 varchar(5000)='';
				SELECT   @OutputPerLine2 +=','+ ColName + ' =@' + ColName +  REPLICATE(' ', 50 - LEN( ColName + ' =@' + ColName))
				FROM	 #TmpBaseColumn2
				WHERE    Num = @Num2;

				INSERT #TmpOutput2
				SELECT @OutputPerLine2 , @Num2;

			    FETCH NEXT FROM Cursor002 INTO @Num2;
		END 
		CLOSE Cursor002 DEALLOCATE Cursor002;

		SELECT OutputCol
		FROM(	SELECT 'UPDATE ' + @TableName AS OutputCol ,-1 AS LineNumber
				UNION
				SELECT CASE WHEN LineNumber = 0
							THEN 'SET' + REPLICATE(' ', 3) + STUFF(OutputCol,1,1,' ')
							ELSE REPLICATE(' ',6) +RTRIM(OutputCol) 
							END AS OutputCol
							,LineNumber
				FROM #TmpOutput2 ) AS A ORDER BY LineNumber;
	
	END ELSE IF @If = 'FINDSP' BEGIN-->>----Find all stored name------------------------------------------------------------------------->
			SELECT SPECIFIC_SCHEMA +'.'+ SPECIFIC_NAME AS [SP Name],CAST( CREATED AS smalldatetime)
			, oak.d103(CREATED) 
			 , oak.d103(LAST_ALTERED)
			 FROM  INFORMATION_SCHEMA.ROUTINES 
			 WHERE ROUTINE_DEFINITION LIKE '%'+'select'+'%'
			 AND   ROUTINE_TYPE = @TableName
			 AND   SPECIFIC_NAME NOT LIKE 'sp_%';

	END ELSE IF @IF = 'SHORTQUERY' BEGIN	
		SET @Form = LOWER(@Form);
		SET @Form = REPLACE(@FORM,'from','');

		IF @Form = '' BEGIN
			EXEC (@Select);

		END ELSE IF  @Where01<> '' BEGIN
			SET  @Where01 = LOWER(@Where01);
			SET  @Where01 = REPLACE(@Where01,'where','')
			SET  @Where01 = REPLACE(@Where01,'=','=''')
			SET  @Where01 = REPLACE(@Where01, '='' ','=''')
			IF   @Where01 NOT LIKE '%=%' BEGIN
				SET  @Where01 = REPLACE(@Where01,'>','>''')
				SET  @Where01 = REPLACE(@Where01,'<','<''')
			END 
			IF   @Where01 like  '% and%' BEGIN
				SET  @Where01 = REPLACE(@Where01,'and','''and')
				SET  @Where01 = REPLACE(@Where01,' ''and','''and')
			END
			IF   @Where01 like  '% or%' BEGIN
				SET  @Where01 = REPLACE(@Where01,'or','''or')
				SET  @Where01 = REPLACE(@Where01,' ''or','''or')
			END
			SET  @Where01 = @Where01+ '''';   
			EXEC('SELECT ' + @Select + ' FROM ' + @Form + ' WHERE ' + @Where01 )

		END ELSE BEGIN
			EXEC('SELECT ' + @Select + ' FROM ' + @Form )
		END
	END ELSE IF @IF='Get_table_types_columns' BEGIN

		DECLARE  @tmp01 TABLE([name] varchar(50)  ,column_id INT)

		INSERT @tmp01
		select c.name , c.column_id		
		from sys.table_types t INNER JOIN sys.columns c on c.object_id = t.type_table_object_id
							   INNER JOIN Sys.schemas s on t.schema_id = s.schema_id
		where t.name = @TableName and s.name = @TABLE_SCHEMA

		IF NOT EXISTS(SELECT * FROM  @tmp01) AND @TableName LIKE '%_%' BEGIN

			SET @TABLE_SCHEMA =  OAK.substr('left',@TableName,'_')
			SET @TableName =    REPLACE(@TableName ,@TABLE_SCHEMA+'_','')
			select  c.name ,c.column_id
			from sys.table_types t INNER JOIN sys.columns c on c.object_id = t.type_table_object_id
								   INNER JOIN Sys.schemas s on t.schema_id = s.schema_id
			where t.name = @TableName and s.name = @TABLE_SCHEMA

		END ELSE BEGIN
			SELECT * FROM @tmp01;

		END

	



	END ELSE BEGIN -->>--- H E L P  --------------------------------------------------------------------------------->
		SELECT 'P' AS Parametor			,'Create input parametors on SP' AS [Output] ,'@TableName [Table Name]' AS Parameter UNION
		SELECT 'I / INSERT'				,'Create simple code for SQL inserting'		 ,'@TableName [Table Name]'			     UNION
		SELECT 'U / UPDATE'				,'Create simple code for SQL updating'		 ,'@TableName [Table Name]'			     UNION
		SELECT 'FindSP'					,'Find SP name is referenced to the the %keyword% as 2nd parametor','@TableName %keyword%' UNION
		SELECT 'ShortQuery'				,'Execute SQL Query string'					,	'@Select / @Form/ @Where01'		

	END 
	

	                        
END



GO
