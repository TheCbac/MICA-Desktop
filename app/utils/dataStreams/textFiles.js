/* @flow */
/* **********************************************************
* File: utils/dataStreams/textFiles.js
*
* Brief: Opening, reading, and manipulating text files.
*
* Authors: Craig Cheney
*
* 2017.10.25 CC - Document created
*
********************************************************* */

/* Save a text file with optional extension */
export function saveTextFile(
  filePath: string, targetData: string, extension?: string = '.txt'
): boolean {
  /* Ensure that the correct extension is written */
  let fileWithExtension = filePath;
  if (!fileWithExtension.endsWith(extension)) {
    fileWithExtension += extension;
  }
  // jetpack.write(filePath, )
}
/* [] - END OF FILE */
