@echo off
rem # ===================  COPYRIGHT @ 2012==============================================
rem #  Copyright 2012 by Shanghai SuperComputer Center. All rights reserved. 
rem # 
rem #     This script may not be duplicated for any profit-driven enterprise or any profit-driven usage without permission. 
rem #  None profit-driven copy or use is hereby granted subject to inclusion of this copyright notice. 
rem #  Unauthorized reproduction by any means at any time is prohibited by law.
rem # 
rem #  Version 1.0
rem #  Author yiyangliu
rem #  Date 2012-8-28
rem #
rem # ===================  Define some constants ==================================
rem # Define the Exit_Code and file extension
set CONST_EXIT_SUCCESS=0
set CONST_EXIT_USER_FAULT=11
set CONST_EXIT_PARA_FAULT=12
set CONST_EXIT_SUBMIT_FAULT=13
set CONST_EXIT_FILE_NOT_FOUND_FAULT=14
set CONST_EXIT_CMD_FAILED_FAULT=15
set CONST_EXIT_FILE_FAULT=16
set CONST_UNCOMPLETE_INFO=Unfinished
rem #set windows external variables , so that variable could be set within the for-loop 
setlocal ENABLEDELAYEDEXPANSION

rem ########## Parameter Checking#############
rem ## read parameters from command

set a=0
FOR %%A IN (%*) DO (
     set /a a=!a!+1  
     set commandpara!a!=%%A
    
)

rem # Username 
set PARA_USERNAME=%commandpara2%

rem # operation
set PARA_OPERATION=%commandpara4%

rem # operation
set PARA_OPESUFFIX=%commandpara5%

rem # parameter1
set PARA_PARAMETER1=%commandpara6%

rem # patameter2
set PARA_PARAMETER2=%commandpara8%

rem # patameter3
set PARA_PARAMETER3=%commandpara10%


for /f "tokens=1,2,3 delims=-/ " %%i in ("%date%") do (
 set DATETMP=%%i%%j%%k
)

for /f "tokens=1,2,3,4 delims=:." %%i in ("%time%") do (
 set timetmp=_%%i.%%j.%%k.%%l
) 
set TIMETMP=%timetmp: =%

set ROOT_PATH=z:
set LOG_PATH=@SCC_HOME@\apache-tomcat-5.5.27\logs\cluster_error_logs
set LOG_FILE=%LOG_PATH%\%DATETMP%.log
set JAVA_MD5=@SCC_HOME@\lib\scc-file-md5generator.jar
set DOZIP=@SCC_HOME@\tools\7-Zip\7z.exe
set TAILCMD=@SCC_HOME@\tools\tail.exe
set FTPTEMP=@SCC_HOME@
if not exist %LOG_PATH% (md %LOG_PATH%)



rem ##################### Functions ##################

rem # The function to create the working dir for job


rem #################################
rem ##   Main Module Begins Here   ##
rem ################################# 
rem # Dispatch the operation selections  

if "%PARA_OPERATION%" == "mkfile" goto make_file
if "%PARA_OPERATION%" == "mkdir" goto make_dir
if "%PARA_OPERATION%" == "rename" goto rename 
if "%PARA_OPERATION%" == "mkdirAndChmod" goto make_dir
if "%PARA_OPERATION%" == "chmod" goto fn_chmod 
if "%PARA_OPERATION%" == "copyContent" goto copyContent
if "%PARA_OPERATION%" == "rm" goto delete 
if "%PARA_OPERATION%" == "movefile" goto mv_file 
if "%PARA_OPERATION%" == "cp" goto cp_file 
if "%PARA_OPERATION%" == "cpself" goto cpself 
if "%PARA_OPERATION%" == "cat" goto cat_file 
if "%PARA_OPERATION%" == "tail" goto tail_file 
if "%PARA_OPERATION%" == "md5" goto javamd5_file
if "%PARA_OPERATION%" == "zip" goto zip_file
if "%PARA_OPERATION%" == "tar" goto tar_file
if "%PARA_OPERATION%" == "targz" goto targz_file
if "%PARA_OPERATION%" == "superunzip" goto superunzip

if "%PARA_OPERATION%" == "isReadAble" goto isReadAble 
if "%PARA_OPERATION%" == "getFirstExistPath" goto getFirstExistPath 
if "%PARA_OPERATION%" == "isWriteAble" goto isWriteAble 
if "%PARA_OPERATION%" == "chown" goto chown_file 

goto end

rem ########################################################
:make_file

    setlocal enabledelayedexpansion
    set fileRelativePath=%PARA_PARAMETER1%
    set filePath=%ROOT_PATH%%PARA_PARAMETER1% 

    if exist "%filePath%" (

     	rem file Existed
        echo "<FileResponse><result>false</result><output>fileexisted</output><error> %fileRelativePath%</error></FileResponse>"
       
        rem exit  %CONST_EXIT_FILE_FAULT%
         endlocal   
        goto end
    
    )

    type nul > "%filePath%" 2>> %LOG_FILE%

    if exist "%filePath%" (
      echo "<FileResponse><result>true</result><output>Successfully create %fileRelativePath% </output><error></error></FileResponse>"
      rem exit %CONST_EXIT_SUCCESS%
       endlocal   
      goto end
    ) 

     echo %date% %time% ,%PARA_USERNAME% ,Failed to create %fileRelativePath%,permission or path invalid >> %LOG_FILE%
     echo "<FileResponse><result>false</result><output>Failed to create %fileRelativePath%,permission or path invalid</output><error></error></FileResponse>"  
     rem exit  %CONST_EXIT_FILE_FAULT%
      endlocal   
     goto end
    
    
   


:make_dir
	   
    setlocal enabledelayedexpansion
    set fileRelativePath=%PARA_PARAMETER1%
    set filePath=%ROOT_PATH%%PARA_PARAMETER1%
 

    if exist "%filePath%" (

     	rem file Existed
        echo "<FileResponse><result>false</result><output>fileexisted</output><error> %fileRelativePath%</error></FileResponse>"
       
        rem exit  %CONST_EXIT_FILE_FAULT%
         endlocal  
        goto end
    
    )

    md "%filePath%" 2>> %LOG_FILE%

    if exist "%filePath%" (
      echo "<FileResponse><result>true</result><output>Successfully create %fileRelativePath% </output><error></error></FileResponse>"
      rem exit %CONST_EXIT_SUCCESS%
       endlocal  
      goto end
    ) 

     echo %date% %time% ,%PARA_USERNAME% ,Failed to create %fileRelativePath%,permission or path invalid >> %LOG_FILE%
     echo "<FileResponse><result>false</result><output>Failed to create %fileRelativePath%, permission or path invalid</output><error></error></FileResponse>"  
     rem exit  %CONST_EXIT_FILE_FAULT%
      endlocal  
     goto end
    
    
    


:rename
  setlocal enabledelayedexpansion
  set oldfileRelativePath=%PARA_PARAMETER1%
  set newfileRelativePath=%PARA_PARAMETER2%

  set oldName=%ROOT_PATH%%PARA_PARAMETER1%
  set newName=%ROOT_PATH%%PARA_PARAMETER2%
  
  rem replace / to \
  set oldName=%oldName:/=\%
  set newName=%newName:/=\%
  

  
   if not exist "%oldName%" (
	rem file Existed
        echo "<FileResponse><result>false</result><output>Not exist %oldfileRelativePath%</output><error></error></FileResponse>"
       
        rem exit  %CONST_EXIT_FILE_FAULT%
         endlocal 
        goto end

  )

  if exist "%newName%" (
	rem file Existed
        echo "<FileResponse><result>false</result><output>fileexisted</output><error> %newfileRelativePath%</error></FileResponse>"
       
        rem exit  %CONST_EXIT_FILE_FAULT%
         endlocal 
        goto end

  )

  move "%oldName%" "%newName%" > nul 2>> %LOG_FILE%
  if %errorlevel% equ 0 (

    echo "<FileResponse><result>true</result><output>Successfully rename %oldfileRelativePath% to %newfileRelativePath%</output><error></error></FileResponse>"
    rem exit %CONST_EXIT_SUCCESS%
     endlocal 
    goto end
  )
  
      echo %date% %time% ,%PARA_USERNAME% ,Failed to rename to %newfileRelativePath%,permission or path invalid >> %LOG_FILE%
     echo "<FileResponse><result>false</result><output>Failed to rename to %newfileRelativePath%, permission or path invalid</output><error></error></FileResponse>"  
     rem exit  %CONST_EXIT_FILE_FAULT%
      endlocal 
     goto end

  


rem # The function to create the working dir for temp location and chmod 777

:mk_dir_chmod
	goto make_dir


rem # The function to create the working dir for temp location and chmod 777
:fn_chmod
	rem do nothing
	echo "<response><isSuccess>true</isSuccess><output>no need to chmod</output><error></error></response>"
	goto end



rem # To read the content of source file and write to the target file.
rem # During this process, owner-changing operation will be done.
:copyContent 

	
	goto end



rem ## To delete the indicated file or dir
:delete 
	setlocal ENABLEDELAYEDEXPANSION
	
  set isSuccess=true
  set errorInfo=Failed to delete:
  set successInfo=Succed to delete:
  set ifFileError=false
  
  if ^%PARA_PARAMETER1:~0,1% == ^" (
     if ^%PARA_PARAMETER1:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER1=%PARA_PARAMETER1:~1,-1%
 
   )
  )

	for %%i in (%PARA_PARAMETER1%) do (
	
	 set newpath=%ROOT_PATH%%%i
	 set newpath=!newpath:/=\!
	 
	  if exist !newpath!\* (
	      set fileType=folder
	      rmdir /s /q !newpath! > nul 2>> %LOG_FILE%
	    ) else (
	      set fileType=file
	      if exist !newpath! (
	         del !newpath! > nul 2>> %LOG_FILE%
	       )
	   )
	   
	   if exist !newpath! (
      set isSuccess=false
      if "!fileType!"=="folder" (
         set errorInfo=!errorInfo! [%%i:%CONST_UNCOMPLETE_INFO%]
      ) else (
         set errorInfo=!errorInfo! [%%i]
      )
      ) else (
       set successInfo=!successInfo! [%%i]
      )
	  )
	 

	if "%isSuccess%" == "true" ( 
	  echo "<FileResponse><result>true</result><output>%successInfo%</output><error></error></FileResponse>" 
	) else (
	  echo %date% %time% ,%PARA_USERNAME% ,Failed to delete %errorInfo% >> %LOG_FILE%
	  echo "<FileResponse><result>false</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
	)
	
  endlocal 
	goto end
	




rem ## To move files
rem ## step 1 
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 2
rem ##    check whether path and source file exist. 
rem ## step 3
rem ##    in terms of parameter of osuffix, "-c" represents whether to check the same name file in target directory.
rem ## step 4
rem ##    move file one by one within the for-loop
:mv_file 

  rem ## step 1 
   if ^%PARA_PARAMETER1:~0,1% == ^" (
     if ^%PARA_PARAMETER1:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER1=%PARA_PARAMETER1:~1,-1%
 
   )
  )
  
  rem ## step 2
   set osuffix=%PARA_OPESUFFIX%
	 set fromPath=%PARA_PARAMETER1%
	 set toPath=%PARA_PARAMETER2%
	 set srcPath=%PARA_PARAMETER3%

   set srcFolderPath=%ROOT_PATH%%srcPath%
   set srcFolderPath=%srcFolderPath:/=\%
   
   set toFolderPath=%ROOT_PATH%%toPath%
   set toFolderPath=%toFolderPath:/=\%
   
   if not exist %srcFolderPath%\* (
   
       echo "<FileResponse><result>false</result><output></output><error>%srcPath% has already been removed</error></FileResponse>"
       goto end
   )
   
   if not exist %toFolderPath%\* (
   
     echo "<FileResponse><result>false</result><output></output><error>%toPath% has already been removed</error></FileResponse>"
    goto end
   ) 
  
    for %%i in (%fromPath%) do (

      set srcfilepath=%ROOT_PATH%%srcPath%/%%i
      set srcfilepath=!srcfilepath:/=\!
      
      if not exist !srcfilepath!\* (
         if not exist !srcfilepath! (
         
          echo "<FileResponse><result>false</result><output></output><error>File state has already been changed</error></FileResponse>"
          goto end
        ) 
       )
     )
   
   rem ## step 3
   if "%osuffix%"=="-c" (
     set fileexist=false
     set fileExistedlist=File Exists:
    
    for %%i in (%fromPath%) do (
      set tofilepath=%ROOT_PATH%%toPath%/%%i
      set tofilepath=!tofilepath:/=\!

      if exist !tofilepath! (
        set fileexist=true
        set fileExistedlist=!fileExistedlist! [%%i]
      )
    )
  )

  if "%fileexist%"=="true" (
     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%fileExistedlist%</error></FileResponse>"
     goto end
  )
   

 rem ## step 4
  set errorInfo=Faild to move:
  set successInfo=succeed to move:
  set isSuccess=true
  set ifFileError=false
   for %%i in (%fromPath%) do (
      set tofilepath=%ROOT_PATH%%toPath%/%%i
      set tofilepath=!tofilepath:/=\!
      
      set srcfilepath=%ROOT_PATH%%srcPath%/%%i
      set srcfilepath=!srcfilepath:/=\!
      
      if exist !srcfilepath!\* (
         set fileType=folder
         xcopy "!srcfilepath!" "!tofilepath!\" /E/Y > nul 2>> %LOG_FILE%
         if !errorlevel! equ 0 (
            rd !srcfilepath! /Q/S
         ) 
         
      ) else (
         set fileType=file
         move /Y "!srcfilepath!" "!tofilepath!" > nul 2>> %LOG_FILE%
      )
      
     if !errorlevel! neq 0 (
       if "!fileType!"=="folder" (
         if  exist !tofilepath!\* (
          set ifFileError=true
         )
        )
       set isSuccess=false
       
       if "!ifFileError!" == "true" (
         set errorInfo=!errorInfo! [!%%i!:%CONST_UNCOMPLETE_INFO%]
       ) else (
         set errorInfo=!errorInfo! [!%%i!]
       )
       echo %date% %time% ,%PARA_USERNAME% ,Failed to move !%%i! >> %LOG_FILE%
      ) else (
     
       set successInfo=!successInfo! [!%%i!]
       
      )
      
      
    )
    
     if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>false</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
  
    echo "<FileResponse><result>true</result><output>%successInfo%</output><error></error></FileResponse>"
  
	goto end


rem ## To copy files
rem ## step 1 
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 2
rem ##    check whether path and source file exist. 
rem ## step 3
rem ##    in terms of parameter of osuffix, "-c" represents whether to check the same name file in target directory.
rem ## step 4
rem ##    copy file one by one within the for-loop
:cp_file

  rem ## step 1 
   if ^%PARA_PARAMETER1:~0,1% == ^" (
     if ^%PARA_PARAMETER1:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER1=%PARA_PARAMETER1:~1,-1%
 
   )
  )
  
  rem ## step 2
   set osuffix=%PARA_OPESUFFIX%
	 set fromPath=%PARA_PARAMETER1%
	 set toPath=%PARA_PARAMETER2%
	 set srcPath=%PARA_PARAMETER3%

   set srcFolderPath=%ROOT_PATH%%srcPath%
   set srcFolderPath=%srcFolderPath:/=\%
   
   set toFolderPath=%ROOT_PATH%%toPath%
   set toFolderPath=%toFolderPath:/=\%
   
   if not exist %srcFolderPath%\* (
   
       echo "<FileResponse><result>false</result><output></output><error>%srcPath% has already been removed</error></FileResponse>"
       goto end
   )
   
   if not exist %toFolderPath%\* (
   
     echo "<FileResponse><result>false</result><output></output><error>%toPath% has already been removed</error></FileResponse>"
    goto end
   ) 

 for %%i in (%fromPath%) do (

      set srcfilepath=%ROOT_PATH%%srcPath%/%%i
      set srcfilepath=!srcfilepath:/=\!
      
      if not exist !srcfilepath!\* (
         if not exist !srcfilepath! (
         
          echo "<FileResponse><result>false</result><output></output><error>File state has already been changed</error></FileResponse>"
          goto end
        ) 
       )
     )
   
   rem ## step 3
   if "%osuffix%"=="-c" (
     set fileexist=false
     set fileExistedlist=File Exists:
    
    for %%i in (%fromPath%) do (
      set tofilepath=%ROOT_PATH%%toPath%/%%i
      set tofilepath=!tofilepath:/=\!

      if exist !tofilepath! (
        set fileexist=true
        set fileExistedlist=!fileExistedlist! [%%i]
      )
    )
  )

  if "%fileexist%"=="true" (
     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%fileExistedlist%</error></FileResponse>"
     goto end
  )
   
   
 rem ## step 4
  set errorInfo=Faild to copy:
  set successInfo=succeed to copy:
  set isSuccess=true
   set ifFileError=false
   for %%i in (%fromPath%) do (
      set tofilepath=%ROOT_PATH%%toPath%/%%i
      set tofilepath=!tofilepath:/=\!
      
      set srcfilepath=%ROOT_PATH%%srcPath%/%%i
      set srcfilepath=!srcfilepath:/=\!
      
      if exist !srcfilepath!\* (
        set fileType=folder
        xcopy "!srcfilepath!" "!tofilepath!\" /E/Y > nul 2>> %LOG_FILE%
        
      ) else (
        set fileType=file
        copy "!srcfilepath!" "!tofilepath!" /Y > nul 2>> %LOG_FILE%
      )
      
      
     if !errorlevel! neq 0 (
      if "!fileType!"=="folder" (
        if  exist !tofilepath!\* (
          set ifFileError=true
        )
      )
       set isSuccess=false
       
       if "!ifFileError!" == "true" (
         set errorInfo=!errorInfo! [!%%i!:%CONST_UNCOMPLETE_INFO%]
       ) else (
         set errorInfo=!errorInfo! [!%%i!]
       )
       echo %date% %time% ,%PARA_USERNAME% ,Failed to copy !%%i! >> %LOG_FILE%
      ) else (
     
       set successInfo=!successInfo! [!%%i!]
       
      )
      
    
      
    )
    
     if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>false</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
  
    echo "<FileResponse><result>true</result><output>%successInfo%</output><error></error></FileResponse>"
  
	goto end



rem ## To copy self
rem ## step 1 
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 2
rem ##    check whether path and source file exist. 
rem ## step 3
rem ##    copy from src to others 
:cpself

rem ## step 1 
   rem ## step 1 
   if ^%PARA_PARAMETER2:~0,1% == ^" (
     if ^%PARA_PARAMETER2:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER2=%PARA_PARAMETER2:~1,-1%
 
   )
  )
  
   if ^%PARA_PARAMETER3:~0,1% == ^" (
     if ^%PARA_PARAMETER3:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER3=%PARA_PARAMETER3:~1,-1%
 
   )
  )
rem ## step 2
  set fromPath=%PARA_PARAMETER1%
  set srcFileNames=%PARA_PARAMETER2%
  set toFileNames=%PARA_PARAMETER3%

  set fromFolderPath=%ROOT_PATH%%fromPath%
  set fromFolderPath=%fromFolderPath:/=\%

    if not exist %fromFolderPath%\* (
	   echo "<FileResponse><result>false</result><output></output><error>%fromPath% has already been removed</error></FileResponse>"
	   goto end
	 )


  	 for %%i in (%srcFileNames%) do (
	 
	   set srcfilepath=%fromFolderPath%\%%i
	    if not exist !srcfilepath!\* (
         if not exist !srcfilepath! (
         
          echo "<FileResponse><result>false</result><output></output><error>File state has already been changed</error></FileResponse>"
          goto end
        ) 
       )
	 
	 )
	 
	  
     set fileexist=false
     set fileExistedlist=File Exists:
    
    for %%i in (%toFileNames%) do (
      set tofilepath=%fromFolderPath%\%%i

      if exist !tofilepath! (
        set fileexist=true
        set fileExistedlist=!fileExistedlist! [%%i]
      )
    )
  

  if "%fileexist%"=="true" (
     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%fileExistedlist%</error></FileResponse>"
     goto end
  )
  
  
  rem ## step 3
   set isSuccess=true
   set errorInfo=Faild to copy self :
   set successInfo=succeed to copy self :
   set ifFileError=false

    set count=0
    for %%i in (%srcFileNames%) do (
      
      set /a count=!count!+1
      
      set srcFileNames!count!=%%i
      
    )
      
    set count=0
    for %%i in (%toFileNames%) do (
    
      set /a count=!count!+1
      set toFileNames!count!=%%i
    )

    for /L %%i in (1,1,%count%) do (

     set srcfilepath=%fromFolderPath%\!srcFileNames%%i!
     set tofilepath=%fromFolderPath%\!toFileNames%%i!
     
     
      if exist !srcfilepath!\* (
        set fileType=folder
        xcopy "!srcfilepath!" "!tofilepath!\" /E/Y > nul 2>> %LOG_FILE%
        
      ) else (
        set fileType=file
        copy "!srcfilepath!" "!tofilepath!" /Y > nul 2>> %LOG_FILE%
      )
      
      if !errorlevel! neq 0 (
      if "!fileType!"=="folder" (
        if  exist !tofilepath!\* (
          set ifFileError=true
        )
      )
       set isSuccess=false
       
       if "!ifFileError!" == "true" (
         set errorInfo=!errorInfo! [!srcFileNames%%i!:%CONST_UNCOMPLETE_INFO%]
       ) else (
         set errorInfo=!errorInfo! [!srcFileNames%%i!]
       )
       echo %date% %time% ,%PARA_USERNAME% ,Failed to copy self !srcFileNames%%i! >> %LOG_FILE%
      ) else (
     
       set successInfo=!successInfo! [!srcFileNames%%i!]
       
      )
      
    )

    

    if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>false</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
  
    echo "<FileResponse><result>true</result><output>%successInfo%</output><error></error></FileResponse>"
    
    goto end
   
   


rem ## external java application md5,make sure the parameter of %JAVA_MD5% has been set correctly. 
:javamd5_file

   	 if not exist %JAVA_MD5% (
	   echo "<FileResponse><result>false</result><output></output><error>This function has not been supported</error></FileResponse>"
	   goto end
	 )
	 

   set filepath=%PARA_PARAMETER1%
	 set srcfile=%PARA_PARAMETER2%
	 set md5file=%PARA_PARAMETER3%
	 
	 set srcfilepath=%ROOT_PATH%%filepath%/%srcfile%
	 set srcfilepath=%srcfilepath:/=\%
	 

	 
	 if not exist %srcfilepath% (
	   echo "<FileResponse><result>false</result><output></output><error>%srcfile% has already been removed</error></FileResponse>"
	   goto end
	 )
	 

	 set md5filepath=%ROOT_PATH%%filepath%/%md5file%
	 set md5filepath=%md5filepath:/=\%
	 
	  java -jar %JAVA_MD5% %srcfilepath% %md5filepath%  2>> %LOG_FILE%
    if %errorlevel% equ 0 (
       echo "<FileResponse><result>true</result><output></output><error></error></FileResponse>"
       goto end
    ) 
    
     echo %date% %time% ,%PARA_USERNAME% , Md5 process meets inner error >> %LOG_FILE%
     echo "<FileResponse><result>false</result><output></output><error>Md5 process meets inner error</error></FileResponse>"
     goto end
     
     

:cat_file 

	
	goto end

:chown_file 
	rem do nothing
	echo "<response><isSuccess>true</isSuccess><output>no need to chown</output><error></error></response>"
	goto end

:getFirstExistPath 
	echo "/tmp"
	goto end


:tail_file 
	
	set rowNum=%PARA_PARAMETER1%

  set filePath=%PARA_PARAMETER2%

  set targetPath=%PARA_PARAMETER3%
	
	set srcfilePath=%ROOT_PATH%%filePath%
	set srcfilePath=%srcfilePath:/=\%
	
	set targetfilePath=%FTPTEMP%%targetPath%
	set targetfilePath=%targetfilePath:/=\%
	
	if not exist %srcfilePath% (
	
	   echo "<FileResponse><result>false</result><output></output><error>%filePath% is not file or has been removed</error></FileResponse>"
	   goto end
	)
	
	 %TAILCMD% -%rowNum% %srcfilePath% > %targetfilePath%  2>> %LOG_FILE%
	 if %errorlevel% equ 0 (
	   
	   if exist %targetfilePath% (
	   
	   echo "<FileResponse><result>true</result><output> %targetPath% </output><error></error></FileResponse>"
	   goto end
	   )
	   
	   echo %date% %time% ,%PARA_USERNAME% , tail meets inner error >> %LOG_FILE%
	   echo "<FileResponse><result>false</result><output> %targetPath% </output><error>tail meets inner error</error></FileResponse>"
	   goto end
	   
	 ) else (
	
	   echo %date% %time% ,%PARA_USERNAME% , tail meets inner error >> %LOG_FILE%
	   echo "<FileResponse><result>false</result><output> %targetPath% </output><error>tail meets inner error</error></FileResponse>"
	   goto end
	   
	   )
	
	goto end


rem ## make zip-format file
rem ## step 1
rem ##   verify whether 7z.exe exists.
rem ## step 2
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 3
rem ##    check whether path and source file exist.   
rem ## step 4
rem ##    make a temporary file with tar-format file
:zip_file

rem ## step 1
 if  not exist %DOZIP% (
  
  echo "<FileResponse><result>false</result><output></output><error>This function has not been supported</error></FileResponse>"
  goto end
 )

 rem ## step 2 
   if ^%PARA_PARAMETER2:~0,1% == ^" (
     if ^%PARA_PARAMETER2:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER2=%PARA_PARAMETER2:~1,-1%
 
   )
  )
  
  rem ## step 3
   set osuffix=%PARA_OPESUFFIX%
	 set zipName=%PARA_PARAMETER1%
	 set sourceName=%PARA_PARAMETER2%
	 set sourcePath=%PARA_PARAMETER3%
	 
	 set srcfolderpath=%ROOT_PATH%%sourcePath%
	 set srcfolderpath=%srcfolderpath:/=\%
	 
	 if not exist %srcfolderpath% (
	   echo "<FileResponse><result>false</result><output></output><error>%sourcePath% has already been removed</error></FileResponse>"
	   goto end
	 )
	 
	 set zipfilepath=%srcfolderpath%\%zipName%
	 if "%osuffix%"=="-c" (
	 
	   if exist %zipfilepath% (
	     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%zipName%</error></FileResponse>"
	     goto end
	   )
	 
	 )
	 
	 rem ## step 4
	 set isSuccess=true
	 set errorInfo=Failed to add archive:
	 for %%i in (%sourceName%) do (
	  	 

	    set srcfilepath=%srcfolderpath%\%%i
	   
           echo "%DOZIP% a -tzip %zipfilepath% !srcfilepath! > nul 2>> %LOG_FILE%"
	    %DOZIP% a -tzip %zipfilepath% !srcfilepath! > nul 2>> %LOG_FILE%
	  
	    if !errorlevel! neq 0 (
	    
	      echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't add !srcfilepath! to %zipfilepath% >> %LOG_FILE%
	      set errorInfo=!errorInfo! [%%i]
	      set isSuccess=false
	      
	    )
	 
	 )
	 
	
	 if not exist %zipfilepath% (
	    echo "<FileResponse><result>false</result><output></output><error>Failed to add archive </error></FileResponse>"
	    goto end
	 )
	 
    if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>true</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
     
     echo "<FileResponse><result>true</result><output></output><error></error></FileResponse>"
     goto end


rem ## make tar-format file
rem ## step 1
rem ##   verify whether 7z.exe exists.
rem ## step 2
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 3
rem ##    check whether path and source file exist.   
rem ## step 4
rem ##    make a temporary file with tar-format file
:tar_file

 rem ## step 1 
 if  not exist %DOZIP% (
  
  echo "<FileResponse><result>false</result><output></output><error>This function has not been supported</error></FileResponse>"
  goto end
 )

 rem ## step 2
   if ^%PARA_PARAMETER2:~0,1% == ^" (
     if ^%PARA_PARAMETER2:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER2=%PARA_PARAMETER2:~1,-1%
 
   )
  )
  
  rem ## step 3
   set osuffix=%PARA_OPESUFFIX%
	 set zipName=%PARA_PARAMETER1%
	 set sourceName=%PARA_PARAMETER2%
	 set sourcePath=%PARA_PARAMETER3%
	 
	 set srcfolderpath=%ROOT_PATH%%sourcePath%
	 set srcfolderpath=%srcfolderpath:/=\%
	 
	 if not exist %srcfolderpath% (
	   echo "<FileResponse><result>false</result><output></output><error>%sourcePath% has already been removed</error></FileResponse>"
	   goto end
	 )
	 
	 set zipfilepath=%srcfolderpath%\%zipName%
	 if "%osuffix%"=="-c" (
	 
	   if exist %zipfilepath% (
	     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%zipName%</error></FileResponse>"
	     goto end
	   )
	 
	 )
	 
	 rem ## step 4
	 set isSuccess=true
	 set errorInfo=Failed to add archive:
	 for %%i in (%sourceName%) do (
	  	 
	    set srcfilepath=%srcfolderpath%\%%i
	    
	    %DOZIP% a -ttar %zipfilepath% !srcfilepath! > nul 2>> %LOG_FILE%
	   
	    if !errorlevel! neq 0 (
	    
	      echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't add !srcfilepath! to %zipfilepath% >> %LOG_FILE%
	      set errorInfo=!errorInfo! [%%i]
	      set isSuccess=false
	      
	    )
	 
	 )
	 
	
	 if not exist %zipfilepath% (
	    echo "<FileResponse><result>false</result><output></output><error>Failed to add archive </error></FileResponse>"
	    goto end
	 )
	 
    if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>true</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
     
     echo "<FileResponse><result>true</result><output></output><error></error></FileResponse>"
     goto end


rem ## make gzip
rem ## step 1
rem ##   verify whether 7z.exe exists.
rem ## step 2
rem ##    eliminate double quotation , because more than two files were seperated by space, parameter must be enclosed with double quotation in dos.
rem ## step 3
rem ##    check whether path and source file exist.   
rem ## step 4
rem ##    make a temporary file with tar-format file
rem ## step 5
rem ##    make gzip-format file from this tar-format file and then delete the tar-format file.
:targz_file

rem ## step 1
 if  not exist %DOZIP% (
  
  echo "<FileResponse><result>false</result><output></output><error>This function has not been supported</error></FileResponse>"
  goto end
 )

 rem ## step 2 
   if ^%PARA_PARAMETER2:~0,1% == ^" (
     if ^%PARA_PARAMETER2:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER2=%PARA_PARAMETER2:~1,-1%
 
   )
  )
  
  rem ## step 3
   set osuffix=%PARA_OPESUFFIX%
	 set zipName=%PARA_PARAMETER1%
	 set sourceName=%PARA_PARAMETER2%
	 set sourcePath=%PARA_PARAMETER3%
	 
	 set srcfolderpath=%ROOT_PATH%%sourcePath%
	 set srcfolderpath=%srcfolderpath:/=\%
	 
	 if not exist %srcfolderpath% (
	   echo "<FileResponse><result>false</result><output></output><error>%sourcePath% has already been removed</error></FileResponse>"
	   goto end
	 )
	 
	 set zipfilepath=%srcfolderpath%\%zipName%
	 if "%osuffix%"=="-c" (
	 
	   if exist %zipfilepath% (
	     echo "<FileResponse><result>false</result><output>fileexisted</output><error>%zipName%</error></FileResponse>"
	     goto end
	   )
	 
	 )
	 
	
	rem ## step 4
	 set isSuccess=true
	 set errorInfo=Failed to add archive:
	 for %%i in (%sourceName%) do (
	  	 
	    set srcfilepath=%srcfolderpath%\%%i
	    
	    %DOZIP% a -ttar %zipfilepath%%DATETMP%%TIMETMP% !srcfilepath! > nul 2>> %LOG_FILE%
	   
	    if !errorlevel! neq 0 (
	    
	      echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't add !srcfilepath! to %zipfilepath% >> %LOG_FILE%
	      set errorInfo=!errorInfo! [%%i]
	      set isSuccess=false
	      
	    )
	 
	 )
	 
	 if not exist %zipfilepath%%DATETMP%%TIMETMP% (
	    echo "<FileResponse><result>false</result><output></output><error>Failed to add archive </error></FileResponse>"
	    goto end
	 )
   
   rem ## step 5
	 %DOZIP% a -tgzip %zipfilepath% %zipfilepath%%DATETMP%%TIMETMP% > nul 2>> %LOG_FILE%
	 set ifError=!errorlevel!
	 
	 del %zipfilepath%%DATETMP%%TIMETMP%  > nul 2>> %LOG_FILE%
	 
	 if not exist %zipfilepath% (
	 
	    echo "<FileResponse><result>false</result><output></output><error>Failed to add archive </error></FileResponse>"
	    goto end
	    
	 ) else (
	 
	     if %ifError% neq 0 (
	     echo "<FileResponse><result>false</result><output></output><error>Failed to add archive </error></FileResponse>"
	     echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't add %zipfilepath% to %zipfilepath%%DATETMP%%TIMETMP% >> %LOG_FILE%
	     goto end
	    
	    )
	 
	 )
	 
    if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>true</result><output>%successInfo%</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
     
     echo "<FileResponse><result>true</result><output></output><error></error></FileResponse>"
     goto end


:superunzip

 rem ## step 1
 if  not exist %DOZIP% (
  
  echo "<FileResponse><result>false</result><output></output><error>This function has not been supported</error></FileResponse>"
  goto end
 )
 

   rem ## step 2 
   if ^%PARA_PARAMETER1:~0,1% == ^" (
     if ^%PARA_PARAMETER1:~-1,1% == ^" (
   
   rem eliminate double Quotation
   set PARA_PARAMETER1=%PARA_PARAMETER1:~1,-1%
 
   )
  )


   rem ## step 3 
   set osuffix=%PARA_OPESUFFIX%
   set zipPath=%PARA_PARAMETER1%
   set dirPath=%PARA_PARAMETER2%
   
   set srcfolderpath=%ROOT_PATH%%dirPath%
	 set srcfolderpath=%srcfolderpath:/=\%
	 
	 if not exist %srcfolderpath% (
	   echo "<FileResponse><result>false</result><output></output><error>%dirPath% has already been removed</error></FileResponse>"
	   goto end
	 )
   
   
    for %%i in (%zipPath%) do (
    
      set zipFilePath=%srcfolderpath%\%%i
      if not exist !zipFilePath! (
      echo "<FileResponse><result>false</result><output></output><error>%%i has already been removed</error></FileResponse>"
      goto end
      )
    )
    
    

   if "%osuffix%"=="-c" (
    set isFileExisted=false
		set fileExistedlist=File exists:
   
     for %%i in (%zipPath%) do (
     
    
       for /f %%a in ("%%i") do (
     
         set fileextension=%%~xa
         set fileNameNoExtension=%%~na
          
         if "!fileextension!"==".gz" (
            
             for /F %%b in ("!fileNameNoExtension!") do (
              
                set fileNameNoExtension=%%~nb
                set fileextension=%%~xb!fileextension!
             )
         
         ) 
         
        rem echo !fileNameNoExtension!
        rem echo !fileextension!
         
         set destpath=%srcfolderpath%\!fileNameNoExtension!
       
         if exist !destpath! ( 
          
            set isFileExisted=true
          	set fileExistedlist=!fileExistedlist! [!fileNameNoExtension!]
          )
         
       )
     )
   
     if "!isFileExisted!"=="true" (
      echo "<FileResponse><result>false</result><output>fileexisted</output><error>!fileExistedlist!</error></FileResponse>"
      goto end
     ) 
   )
   
   
   set isSuccess=true
   set errorInfo=Failed to extract :
   
   for %%i in (%zipPath%) do (
     
    
       for /f %%a in ("%%i") do (
     
         set fileextension=%%~xa
         set fileNameNoExtension=%%~na
          
         if "!fileextension!"==".gz" (
            
             for /F %%b in ("!fileNameNoExtension!") do (
              
                set fileNameNoExtension=%%~nb
                set fileextension=%%~xb!fileextension!
             )
         
         ) 
           
           
           
         set destpath=%srcfolderpath%\!fileNameNoExtension!
         set autofolder=false
         if not exist !destpath! ( 
           
            md !destpath! 2>> %LOG_FILE%
            if !errorlevel! neq 0 (
               echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't  md !destpath! >> %LOG_FILE%
               echo "<FileResponse><result>false</result><output></output><error>can't make folder !fileNameNoExtension! </error></FileResponse>"
               goto end
            
            )
         )
         
         if "!fileextension!" == ".zip" (
         
           %DOZIP% x -tzip %srcfolderpath%\%%i -aoa -o!destpath! > nul 2>> %LOG_FILE%
           if !errorlevel! neq 0 (
             set isSuccess=false
             set errorInfo=!errorInfo! [%%i]
             echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't unzip %srcfolderpath%\%%i >> %LOG_FILE%
           )
         ) 
         
         if "!fileextension!" == ".tar" (
         
           %DOZIP% x -ttar %srcfolderpath%\%%i -aoa -o!destpath! > nul 2>> %LOG_FILE%
           if !errorlevel! neq 0 (
             set isSuccess=false
             set errorInfo=!errorInfo! [%%i]
             echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't untar %srcfolderpath%\%%i >> %LOG_FILE%
           )
         ) 
         
          if "!fileextension!" == ".rar" (
         
           %DOZIP% x -trar %srcfolderpath%\%%i -aoa -o!destpath! > nul 2>> %LOG_FILE%
           if !errorlevel! neq 0 (
             set isSuccess=false
             set errorInfo=!errorInfo! [%%i]
             echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't unrar %srcfolderpath%\%%i >> %LOG_FILE%
           )
         ) 
         
         
         if "!fileextension!" == ".tar.gz" (
         
           md !destpath!\%DATETMP%%TIMETMP% 2>> %LOG_FILE%
           if !errorlevel! neq 0 (
               echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't  md !destpath!\%DATETMP%%TIMETMP% >> %LOG_FILE%
               set isSuccess=false
               set errorInfo=!errorInfo! [%%i]
           ) else (
             
              %DOZIP% x -tgzip %srcfolderpath%\%%i -aoa -o!destpath!\%DATETMP%%TIMETMP% > nul 2>> %LOG_FILE%
              if !errorlevel! neq 0 (
              set isSuccess=false
              set errorInfo=!errorInfo! [%%i]
              echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't ungzip %srcfolderpath%\%%i >> %LOG_FILE%
              ) else (
                 
                 %DOZIP% x -ttar !destpath!\%DATETMP%%TIMETMP%\* -aoa -o!destpath!  > nul 2>> %LOG_FILE%
                 if !errorlevel! neq 0 (
                 set isSuccess=false
                 set errorInfo=!errorInfo! [%%i]
                 echo %date% %time% ,%PARA_USERNAME% , %DOZIP% can't untar !destpath!\%DATETMP%%TIMETMP%\* >> %LOG_FILE%
               ) 
 
              )
          
            rmdir /s /q !destpath!\%DATETMP%%TIMETMP% > nul 2>> %LOG_FILE%
            )
         ) 
         
       )
     )
  
   if "%isSuccess%"=="false" (
     
     echo "<FileResponse><result>false</result><output>error</output><error>%errorInfo%</error></FileResponse>"
     goto end
     )
     
     echo "<FileResponse><result>true</result><output>Success all</output><error></error></FileResponse>"
     goto end
  
   
  
  goto end 



:isReadAble 
	echo "<response><isSuccess>true</isSuccess><output>can read</output><error></error></response>"
	goto end

:isWriteAble 
	echo "<response><isSuccess>true</isSuccess><output>can write</output><error></error></response>"
	goto end


:end
endlocal

