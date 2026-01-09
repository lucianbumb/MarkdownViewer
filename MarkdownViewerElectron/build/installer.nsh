; Custom NSIS hook used by electron-builder.
; Purpose: recreate shortcuts with a stable icon path + working directory.
; On some systems, the default AUMI-setting step can result in corrupted shortcut fields,
; which then makes Windows show a generic taskbar icon for the app group.

!macro customInstall
  ; Recreate Start Menu shortcut
  ${if} ${FileExists} "$newStartMenuLink"
    Delete "$newStartMenuLink"
  ${endIf}
  CreateShortCut "$newStartMenuLink" "$appExe" "" "$INSTDIR\markdownviewer.ico" 0 "" "" "${APP_DESCRIPTION}"
  ClearErrors

  ; Recreate Desktop shortcut (if enabled)
  ${ifNot} ${isNoDesktopShortcut}
    ${if} ${FileExists} "$newDesktopLink"
      Delete "$newDesktopLink"
    ${endIf}
    CreateShortCut "$newDesktopLink" "$appExe" "" "$INSTDIR\markdownviewer.ico" 0 "" "" "${APP_DESCRIPTION}"
    ClearErrors
  ${endIf}
!macroend
